export type ApiErrorCode =
  | "NOT_CONFIGURED"
  | "VALIDATION"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "SERVER"
  | "NETWORK"
  | "TIMEOUT"
  | "CANCELLED"
  | "INVALID_RESPONSE"
  | "STORAGE";
export type ApiError = {
  code: ApiErrorCode;
  message: string;
  status?: number;
  requestId?: string;
  retryAfterSeconds?: number;
  serverCode?: string;
};
export type ApiResult<T> =
  { ok: true; data: T; requestId?: string } | { ok: false; error: ApiError };
export type Decoder<T> = (value: unknown) => T;
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type Query = Readonly<Record<string, string | number | boolean | undefined | null>>;
export type RequestOptions<T> = {
  method?: HttpMethod;
  body?: unknown;
  query?: Query;
  signal?: AbortSignal;
  authenticated?: boolean;
  idempotencyKey?: string;
  /** Only for the backend's documented raw login response. */
  responseFormat?: "envelope" | "raw";
  decode: Decoder<T>;
};
export function apiFailure(code: ApiErrorCode, message: string): ApiResult<never> {
  return { ok: false, error: { code, message } };
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
