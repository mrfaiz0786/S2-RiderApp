export type AppEnvironment = "development" | "staging" | "production";
export type DataMode = "mock" | "api";
export type EnvironmentInput = {
  environment?: string;
  dataMode?: string;
  apiBaseUrl?: string;
  requestTimeoutMs?: string;
  pushEnabled?: string;
};
export type EnvironmentConfig = {
  environment: AppEnvironment;
  dataMode: DataMode;
  apiBaseUrl: string;
  requestTimeoutMs: number;
  pushEnabled: boolean;
  configurationError: string | null;
};

/** Pure and testable. Invalid live configuration never falls back to sample data. */
export function parseEnvironment(input: EnvironmentInput): EnvironmentConfig {
  const environment = input.environment?.trim() || "development";
  const dataMode = input.dataMode?.trim() || "mock";
  const apiBaseUrl = (input.apiBaseUrl?.trim() || "").replace(/\/+$/, "");
  const timeout = input.requestTimeoutMs?.trim() || "15000";
  const requestTimeoutMs = Number(timeout);
  const push = input.pushEnabled?.trim() || "false";
  let configurationError: string | null = null;
  if (!["development", "staging", "production"].includes(environment)) {
    configurationError = "EXPO_PUBLIC_APP_ENV must be development, staging or production.";
  } else if (!["mock", "api"].includes(dataMode)) {
    configurationError = "EXPO_PUBLIC_DATA_MODE must be mock or api.";
  } else if (!/^\d+$/.test(timeout) || requestTimeoutMs < 1000 || requestTimeoutMs > 60000) {
    configurationError = "API timeout must be an integer between 1000 and 60000 milliseconds.";
  } else if (!["true", "false"].includes(push)) {
    configurationError = "EXPO_PUBLIC_PUSH_ENABLED must be true or false.";
  } else if (environment === "production" && dataMode !== "api") {
    configurationError = "Production builds cannot use mock data.";
  } else if (dataMode === "api") {
    try {
      const url = new URL(apiBaseUrl);
      if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
        throw new Error("Invalid API origin");
      }
    } catch {
      configurationError =
        "Set an HTTPS EXPO_PUBLIC_API_BASE_URL supplied by the backend team, without credentials, query or fragment.";
    }
  }
  return {
    environment: environment as AppEnvironment,
    dataMode: dataMode as DataMode,
    apiBaseUrl,
    requestTimeoutMs: Number.isInteger(requestTimeoutMs) ? requestTimeoutMs : 15000,
    pushEnabled: push === "true",
    configurationError,
  };
}
