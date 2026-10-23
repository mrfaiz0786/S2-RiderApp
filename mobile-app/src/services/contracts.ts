/** Integration contracts only. No network client or backend URL is configured. */
export type IntegrationName =
  | "authentication"
  | "documents"
  | "dispatch"
  | "location"
  | "push"
  | "payouts"
  | "support"
  | "emergency";
export type IntegrationCapability = { enabled: false; reason: string };
export type RequestContext = { requestId: string; idempotencyKey?: string; signal?: AbortSignal };
export type ServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      code: "NOT_CONFIGURED" | "UNAVAILABLE" | "CONFLICT" | "VALIDATION";
      message: string;
    };
