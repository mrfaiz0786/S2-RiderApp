import "react-native-url-polyfill/auto";
import { appConfig } from "@/config/app";
import { createApiClient, type ApiClientSettings } from "./client";

export { createApiClient } from "./client";
export type { ApiClient, ApiClientSettings } from "./client";
export type { ApiError, ApiResult, Decoder, RequestOptions } from "./types";

/** Construct in a feature adapter after the backend team's contract is agreed. */
export function createConfiguredApiClient(
  session: Pick<ApiClientSettings, "getAccessToken" | "onUnauthorized">,
) {
  if (appConfig.configurationError || appConfig.dataMode !== "api" || !appConfig.apiBaseUrl)
    return null;
  return createApiClient({
    baseUrl: appConfig.apiBaseUrl,
    timeoutMs: appConfig.requestTimeoutMs,
    ...session,
  });
}
