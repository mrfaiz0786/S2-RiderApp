import { parseEnvironment } from "./environment";

declare const process: {
  env: {
    EXPO_PUBLIC_APP_ENV?: string;
    EXPO_PUBLIC_DATA_MODE?: string;
    EXPO_PUBLIC_API_BASE_URL?: string;
    EXPO_PUBLIC_API_TIMEOUT_MS?: string;
    EXPO_PUBLIC_PUSH_ENABLED?: string;
  };
};

// Expo requires static dot-notation access to inline public configuration.
const environment = parseEnvironment({
  environment: process.env.EXPO_PUBLIC_APP_ENV,
  dataMode: process.env.EXPO_PUBLIC_DATA_MODE,
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
  requestTimeoutMs: process.env.EXPO_PUBLIC_API_TIMEOUT_MS,
  pushEnabled: process.env.EXPO_PUBLIC_PUSH_ENABLED,
});
export const appConfig = {
  ...environment,
  allowScreenPreview: environment.dataMode === "mock" && environment.environment !== "production",
  fontTimeoutMs: 8000,
} as const;
