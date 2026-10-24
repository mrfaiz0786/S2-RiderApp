import type { ApiError } from "../api/types";

/**
 * Safe rider-facing failures. Do not echo raw response bodies, passwords or JWTs.
 * Browser network failures can also be offline/DNS; CORS diagnosis is based on
 * separately verified preflight behavior of this test server.
 */
export function explainLegacyError(error: ApiError, web: boolean): string {
  if (web && error.code === "NETWORK") {
    return "Browser request failed. This test server rejects CORS preflight from http://localhost:8081 (HTTP 403). Ask the backend team to allow your development origin and OPTIONS; check your connection too. Native Android requests do not use browser CORS.";
  }
  if (error.code === "INVALID_RESPONSE") {
    return "The server responded, but its JSON did not match the documented rider API contract. Ask the backend team to compare response field names, without sharing passwords or access tokens.";
  }
  return error.message;
}
