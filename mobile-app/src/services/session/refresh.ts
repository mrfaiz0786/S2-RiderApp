import { apiFailure, type ApiResult } from "../api/types";
import type { SessionTokens, TokenStore } from "./tokenStore";

/** An injectable single-flight refresh boundary. It does not assume an auth vendor. */
export function createSessionManager(
  store: TokenStore,
  refresh: (refreshToken: string) => Promise<ApiResult<SessionTokens>>,
  now = Date.now,
) {
  let inFlight: Promise<ApiResult<SessionTokens | null>> | null = null;
  async function resolve(): Promise<ApiResult<SessionTokens | null>> {
    const generation = store.generation();
    try {
      const current = await store.read();
      if (generation !== store.generation()) return { ok: true, data: null };
      if (!current) return { ok: true, data: null };
      if (current.accessTokenExpiresAt > now() + 30000) return { ok: true, data: current };
      const result = await refresh(current.refreshToken);
      if (generation !== store.generation()) return { ok: true, data: null };
      if (!result.ok) {
        // Network problems must not erase a still-recoverable refresh token.
        if (result.error.code === "UNAUTHENTICATED") await store.clear();
        return result;
      }
      if (result.data.userId !== current.userId || result.data.accessTokenExpiresAt <= now()) {
        return apiFailure("INVALID_RESPONSE", "Invalid refreshed session.");
      }
      const saved = await store.write(result.data, generation);
      return { ok: true, data: saved ? result.data : null };
    } catch {
      return apiFailure("STORAGE", "Could not restore the session securely.");
    }
  }
  return {
    getSession: (): Promise<ApiResult<SessionTokens | null>> => {
      if (!inFlight) {
        inFlight = resolve().finally(() => {
          inFlight = null;
        });
      }
      return inFlight;
    },
    // Caller should request server revocation too; local deletion is not server revocation.
    clear: () => store.clear(),
  };
}
