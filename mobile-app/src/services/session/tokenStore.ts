import { isRecord } from "../api/types";

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  userId: string;
};
export type SecureStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};
const SESSION_KEY = "ybm.rider.session.v1";
export function decodeSession(value: unknown): SessionTokens {
  if (
    !isRecord(value) ||
    typeof value.accessToken !== "string" ||
    !value.accessToken.trim() ||
    typeof value.refreshToken !== "string" ||
    !value.refreshToken.trim() ||
    typeof value.userId !== "string" ||
    !value.userId.trim() ||
    typeof value.accessTokenExpiresAt !== "number" ||
    !Number.isFinite(value.accessTokenExpiresAt) ||
    value.accessTokenExpiresAt <= 0 ||
    /[\r\n]/.test(value.accessToken)
  ) {
    throw new Error("Invalid session response");
  }
  return {
    accessToken: value.accessToken,
    refreshToken: value.refreshToken,
    accessTokenExpiresAt: value.accessTokenExpiresAt,
    userId: value.userId,
  };
}

/** Serialize storage operations so a late write cannot overtake a queued logout. */
export function createTokenStore(storage: SecureStorage) {
  let queue: Promise<unknown> = Promise.resolve();
  let generation = 0;
  function serial<T>(operation: () => Promise<T>): Promise<T> {
    const pending = queue.then(operation, operation);
    queue = pending.catch(() => undefined);
    return pending;
  }
  return {
    generation: () => generation,
    read: () =>
      serial(async (): Promise<SessionTokens | null> => {
        const raw = await storage.getItem(SESSION_KEY);
        if (!raw) return null;
        try {
          return decodeSession(JSON.parse(raw));
        } catch {
          await storage.removeItem(SESSION_KEY);
          return null;
        }
      }),
    write: (tokens: SessionTokens, expectedGeneration = generation) =>
      serial(async () => {
        // Capture the generation before starting login/refresh, not after its response.
        if (generation !== expectedGeneration) return false;
        await storage.setItem(SESSION_KEY, JSON.stringify(decodeSession(tokens)));
        return true;
      }),
    clear: () => {
      generation += 1;
      return serial(() => storage.removeItem(SESSION_KEY));
    },
  };
}
export type TokenStore = ReturnType<typeof createTokenStore>;
