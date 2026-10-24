import {
  apiFailure,
  isRecord,
  type ApiErrorCode,
  type ApiResult,
  type RequestOptions,
} from "./types";

export type ApiClientSettings = {
  baseUrl: string;
  timeoutMs?: number;
  getAccessToken?: () => Promise<string | null>;
  onUnauthorized?: () => void;
  transport?: typeof fetch;
};
const messages: Record<ApiErrorCode, string> = {
  NOT_CONFIGURED: "The API is not configured.",
  VALIDATION: "Check the information and try again.",
  UNAUTHENTICATED: "Your session has expired. Sign in again.",
  FORBIDDEN: "Your account cannot perform this action.",
  NOT_FOUND: "This item is no longer available.",
  CONFLICT: "This item changed. Refresh it before trying again.",
  RATE_LIMITED: "Too many requests. Wait before trying again.",
  SERVER: "The service is temporarily unavailable.",
  NETWORK: "Could not reach the service. Check your connection.",
  TIMEOUT: "The request timed out. Refresh the current status before repeating an action.",
  CANCELLED: "The request was cancelled.",
  INVALID_RESPONSE: "The service returned an unexpected response.",
  STORAGE: "The session could not be read securely. Sign in again.",
};
function statusCode(status: number): ApiErrorCode {
  if (status === 401) return "UNAUTHENTICATED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409 || status === 412) return "CONFLICT";
  if (status === 429) return "RATE_LIMITED";
  if (status === 400 || status === 422) return "VALIDATION";
  return "SERVER";
}
function safeIdentifier(value: unknown): string | undefined {
  return typeof value === "string" && /^[A-Za-z0-9._:-]{1,128}$/.test(value) ? value : undefined;
}
function retryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  if (/^\d+$/.test(value)) return Math.min(Number(value), 86400);
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp)
    ? Math.min(86400, Math.max(0, Math.ceil((timestamp - Date.now()) / 1000)))
    : undefined;
}

/** JSON API transport only. No database SDK, provider key or server implementation. */
export function createApiClient(settings: ApiClientSettings) {
  const baseUrl = settings.baseUrl.trim().replace(/\/+$/, "");
  const base = new URL(baseUrl);
  if (base.protocol !== "https:" || base.username || base.password || base.search || base.hash) {
    throw new Error("API base URL must use HTTPS without credentials, query or fragment.");
  }
  const timeoutMs = settings.timeoutMs ?? 15000;
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60000) {
    throw new Error("Invalid API timeout.");
  }
  const transport = settings.transport ?? fetch;

  async function request<T>(path: string, options: RequestOptions<T>): Promise<ApiResult<T>> {
    // Endpoints are relative to this API only. Never send bearer tokens to an upload URL.
    if (
      !/^\/[A-Za-z0-9/_.-]*$/.test(path) ||
      path.includes("//") ||
      path.split("/").some((segment) => segment === "." || segment === "..")
    ) {
      return apiFailure("VALIDATION", "Invalid API path.");
    }
    if (options.signal?.aborted) return apiFailure("CANCELLED", messages.CANCELLED);
    if (options.idempotencyKey && !/^[A-Za-z0-9_-]{16,128}$/.test(options.idempotencyKey)) {
      return apiFailure("VALIDATION", "Invalid idempotency key.");
    }
    let token: string | null = null;
    if (options.authenticated !== false) {
      try {
        token = (await settings.getAccessToken?.()) ?? null;
      } catch {
        return apiFailure("STORAGE", messages.STORAGE);
      }
      if (!token || /[\r\n]/.test(token))
        return apiFailure("UNAUTHENTICATED", messages.UNAUTHENTICATED);
    }
    if (options.signal?.aborted) return apiFailure("CANCELLED", messages.CANCELLED);
    const method = options.method ?? "GET";
    if (method === "GET" && options.body !== undefined)
      return apiFailure("VALIDATION", "GET requests cannot contain a body.");
    let body: string | undefined;
    try {
      body = options.body === undefined ? undefined : JSON.stringify(options.body);
      if (options.body !== undefined && body === undefined) throw new Error("Not JSON");
    } catch {
      return apiFailure("VALIDATION", "The request could not be encoded.");
    }
    let query: string;
    try {
      query = Object.entries(options.query ?? {})
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => encodeURIComponent(key) + "=" + encodeURIComponent(String(value)))
        .join("&");
    } catch {
      return apiFailure("VALIDATION", "The query could not be encoded.");
    }
    const controller = new AbortController();
    let timedOut = false;
    const cancel = () => controller.abort();
    options.signal?.addEventListener("abort", cancel, { once: true });
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    try {
      const response = await transport(baseUrl + path + (query ? "?" + query : ""), {
        method,
        signal: controller.signal,
        // The backend must use canonical endpoints, without auth-bearing redirects.
        redirect: "error",
        headers: {
          Accept: "application/json",
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
          ...(token ? { Authorization: "Bearer " + token } : {}),
          ...(options.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : {}),
        },
        ...(body === undefined ? {} : { body }),
      });
      const requestId = safeIdentifier(response.headers.get("x-request-id"));
      if (!response.ok) {
        const code = statusCode(response.status);
        let serverCode: string | undefined;
        try {
          const payload: unknown = await response.json();
          if (isRecord(payload) && isRecord(payload.error))
            serverCode = safeIdentifier(payload.error.code);
        } catch {
          /* A proxy may return non-JSON errors. Never expose its body. */
        }
        if (response.status === 401 && options.authenticated !== false) {
          try {
            settings.onUnauthorized?.();
          } catch {
            /* UI callbacks must not replace an API error. */
          }
        }
        return {
          ok: false,
          error: {
            code,
            message: messages[code],
            status: response.status,
            requestId,
            serverCode,
            retryAfterSeconds: retryAfter(response.headers.get("retry-after")),
          },
        };
      }
      try {
        if (response.status === 204)
          return { ok: true, data: options.decode(undefined), requestId };
        const envelope: unknown = await response.json();
        if (!isRecord(envelope) || !Object.prototype.hasOwnProperty.call(envelope, "data")) {
          return apiFailure("INVALID_RESPONSE", messages.INVALID_RESPONSE);
        }
        return { ok: true, data: options.decode(envelope.data), requestId };
      } catch {
        if (controller.signal.aborted) throw new Error("Aborted while reading response");
        return apiFailure("INVALID_RESPONSE", messages.INVALID_RESPONSE);
      }
    } catch {
      const code = timedOut ? "TIMEOUT" : options.signal?.aborted ? "CANCELLED" : "NETWORK";
      return apiFailure(code, messages[code]);
    } finally {
      clearTimeout(timer);
      options.signal?.removeEventListener("abort", cancel);
    }
  }
  // Mutations are NEVER retried automatically. Reuse the original idempotency key
  // only after reconciling ambiguous success with the canonical resource endpoint.
  return { request };
}
export type ApiClient = ReturnType<typeof createApiClient>;
