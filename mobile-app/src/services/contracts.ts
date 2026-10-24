/** Shared client contracts. Backend implementation lives in another team's repository. */
export type IntegrationName =
  | "authentication"
  | "documents"
  | "dispatch"
  | "location"
  | "push"
  | "payouts"
  | "support"
  | "emergency";
export type IntegrationCapability = { enabled: boolean; reason: string };
export type RequestContext = { requestId?: string; idempotencyKey?: string; signal?: AbortSignal };
export type ServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      code: "NOT_CONFIGURED" | "UNAVAILABLE" | "CONFLICT" | "VALIDATION";
      message: string;
    };
