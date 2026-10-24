import type { IntegrationCapability, IntegrationName, ServiceResult } from "./contracts";

// Do not equate an API URL with a tested feature. Enable capabilities only when
// its screen adapter, backend contract and device acceptance have been verified.
const pending: IntegrationCapability = {
  enabled: false,
  reason: "Awaiting backend-team API contract and mobile screen integration.",
};
export const capabilities: Record<IntegrationName, IntegrationCapability> = {
  authentication: pending,
  documents: pending,
  dispatch: pending,
  location: pending,
  push: pending,
  payouts: pending,
  support: pending,
  emergency: pending,
};
export function notConfigured<T>(service: IntegrationName): ServiceResult<T> {
  return {
    ok: false,
    code: "NOT_CONFIGURED",
    message: service + ": " + capabilities[service].reason,
  };
}
