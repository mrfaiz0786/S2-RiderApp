import { createApiClient, type ApiClientSettings } from "../api/client";
import type { ApiResult } from "../api/types";
import {
  decodeAssignment,
  decodeAssignmentList,
  decodeLogin,
  decodeProfile,
  decodeRoute,
  type LoginResponse,
  type RiderAssignment,
  type RiderProfile,
  type RouteSummary,
} from "./contracts";

export function createLegacyRiderApi(settings: ApiClientSettings) {
  // Shared /api/auth and /api/rider-app require a server ORIGIN, not a rider prefix.
  const url = new URL(settings.baseUrl);
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error("Set EXPO_PUBLIC_API_BASE_URL to the server HTTPS origin only.");
  }
  const client = createApiClient(settings);
  return {
    requestOtp: (phone: string, signal?: AbortSignal): Promise<ApiResult<boolean>> =>
      client.request("/api/auth/otp/request", {
        method: "POST",
        authenticated: false,
        body: { identifier: phone, purpose: "LOGIN" },
        signal,
        decode: () => true,
      }),
    loginPassword: (
      phone: string,
      password: string,
      signal?: AbortSignal,
    ): Promise<ApiResult<LoginResponse>> =>
      client.request("/api/auth/login", {
        method: "POST",
        authenticated: false,
        body: { identifier: phone, password, loginMethod: "PASSWORD" },
        responseFormat: "raw",
        decode: decodeLogin,
        signal,
      }),
    loginOtp: (
      phone: string,
      otp: string,
      signal?: AbortSignal,
    ): Promise<ApiResult<LoginResponse>> =>
      client.request("/api/auth/login", {
        method: "POST",
        authenticated: false,
        body: { identifier: phone, otp, loginMethod: "OTP" },
        responseFormat: "raw",
        decode: decodeLogin,
        signal,
      }),
    orders: (signal?: AbortSignal): Promise<ApiResult<RiderAssignment[]>> =>
      client.request("/api/rider-app/orders", { decode: decodeAssignmentList, signal }),
    history: (signal?: AbortSignal): Promise<ApiResult<RiderAssignment[]>> =>
      client.request("/api/rider-app/orders/history", { decode: decodeAssignmentList, signal }),
    detail: (assignmentId: number, signal?: AbortSignal): Promise<ApiResult<RiderAssignment>> =>
      client.request("/api/rider-app/orders/" + assertAssignmentId(assignmentId), {
        decode: decodeAssignment,
        signal,
      }),
    profile: (signal?: AbortSignal): Promise<ApiResult<RiderProfile>> =>
      client.request("/api/rider-app/profile", { decode: decodeProfile, signal }),
    route: (
      originLat: number,
      originLng: number,
      destLat: number,
      destLng: number,
      signal?: AbortSignal,
    ): Promise<ApiResult<RouteSummary>> =>
      client.request("/api/rider-app/maps/route", {
        query: { originLat, originLng, destLat, destLng },
        decode: decodeRoute,
        signal,
      }),
    // IMPORTANT: assignment status mutations intentionally omitted.
    // rider-api.txt documents missing authorization of these endpoints.
  };
}
export function assertAssignmentId(value: number): number {
  if (!Number.isSafeInteger(value) || value < 1) throw new Error("Invalid assignment id");
  return value;
}
export type LegacyRiderApi = ReturnType<typeof createLegacyRiderApi>;
