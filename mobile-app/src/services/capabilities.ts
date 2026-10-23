import type { IntegrationCapability, IntegrationName, ServiceResult } from "./contracts";
const disconnected: IntegrationCapability = {
  enabled: false,
  reason: "Demo only; no external provider is connected.",
};
export const capabilities: Record<IntegrationName, IntegrationCapability> = {
  authentication: disconnected,
  documents: disconnected,
  dispatch: disconnected,
  location: disconnected,
  push: disconnected,
  payouts: disconnected,
  support: disconnected,
  emergency: disconnected,
};
export function notConfigured<T>(service: IntegrationName): ServiceResult<T> {
  return {
    ok: false,
    code: "NOT_CONFIGURED",
    message: service + ": " + capabilities[service].reason,
  };
}
