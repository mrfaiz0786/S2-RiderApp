import type { LoginResponse } from "./contracts";

const MAX_AGE_MS = 23 * 60 * 60 * 1000; // backend JWT is documented as 24 hours; no refresh exists
export type LegacySession = { token: string; username: string; expiresAt: number };
export type LegacySecureStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};
const KEY = "ybm.legacy.rider.session.v1";
export function decodeLegacySession(value: unknown, now = Date.now()): LegacySession | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const obj = value as Record<string, unknown>;
  if (
    typeof obj.token !== "string" ||
    obj.token.length < 1 ||
    obj.token.length > 8192 ||
    /[\r\n]/.test(obj.token) ||
    typeof obj.username !== "string" ||
    !obj.username ||
    typeof obj.expiresAt !== "number" ||
    !Number.isFinite(obj.expiresAt) ||
    obj.expiresAt <= now ||
    obj.expiresAt > now + MAX_AGE_MS
  )
    return null;
  return { token: obj.token, username: obj.username, expiresAt: obj.expiresAt };
}
export function fromLogin(login: LoginResponse, now = Date.now()): LegacySession {
  return { token: login.token, username: login.username, expiresAt: now + MAX_AGE_MS };
}
/**
 * Browser-only staging session storage. Never writes JWTs into localStorage,
 * sessionStorage, IndexedDB, cookies, filesystem or logs. A refresh signs out.
 * React Native uses Expo SecureStore instead.
 */
export function createEphemeralSessionStorage(): LegacySecureStorage {
  const memory = new Map<string, string>();
  return {
    getItem: async (key) => memory.get(key) ?? null,
    setItem: async (key, value) => {
      memory.set(key, value);
    },
    removeItem: async (key) => {
      memory.delete(key);
    },
  };
}
export function createLegacySessionStore(store: LegacySecureStorage) {
  let queue: Promise<unknown> = Promise.resolve();
  let generation = 0;
  function serial<T>(fn: () => Promise<T>): Promise<T> {
    const task = queue.then(fn, fn);
    queue = task.catch(() => undefined);
    return task;
  }
  return {
    generation: () => generation,
    read: () =>
      serial(async () => {
        const raw = await store.getItem(KEY);
        if (!raw) return null;
        let decoded: LegacySession | null = null;
        try {
          decoded = decodeLegacySession(JSON.parse(raw));
        } catch {
          /* corrupt storage */
        }
        if (!decoded) await store.removeItem(KEY);
        return decoded;
      }),
    save: (session: LegacySession, expected = generation) =>
      serial(async () => {
        if (generation !== expected || !decodeLegacySession(session, Date.now())) return false;
        await store.setItem(KEY, JSON.stringify(session));
        return true;
      }),
    clear: () => {
      generation++;
      return serial(() => store.removeItem(KEY));
    },
  };
}
