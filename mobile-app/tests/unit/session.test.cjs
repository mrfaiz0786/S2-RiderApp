const test = require("node:test");
const assert = require("node:assert/strict");
const { loadSource } = require("../support/loadSource.cjs");
const { createTokenStore, decodeSession } = loadSource("services/session/tokenStore.ts");
const { createSessionManager } = loadSource("services/session/refresh.ts");
const tokens = (expires = 1000000) => ({
  userId: "rider-1",
  accessToken: "access",
  refreshToken: "refresh",
  accessTokenExpiresAt: expires,
});
function memory(initial = null) {
  let value = initial;
  return {
    getItem: async () => value,
    setItem: async (_, next) => {
      value = next;
    },
    removeItem: async () => {
      value = null;
    },
  };
}
test("Session decoder rejects malformed or injected tokens", () => {
  for (const value of [
    null,
    {},
    { ...tokens(), accessToken: "" },
    { ...tokens(), accessToken: "bad\r\ntoken" },
    { ...tokens(), accessTokenExpiresAt: Infinity },
  ])
    assert.throws(() => decodeSession(value));
  assert.deepEqual(decodeSession(tokens()), tokens());
});
test("Token store persists and clears a validated native session", async () => {
  const store = createTokenStore(memory());
  assert.equal(await store.read(), null);
  assert.equal(await store.write(tokens()), true);
  assert.deepEqual(await store.read(), tokens());
  await store.clear();
  assert.equal(await store.read(), null);
});
test("Token store removes corrupt persisted data", async () => {
  const storage = memory("{invalid JSON");
  const store = createTokenStore(storage);
  assert.equal(await store.read(), null);
  assert.equal(await storage.getItem("unused"), null);
});
test("Logout invalidates late login or refresh results", async () => {
  const store = createTokenStore(memory());
  const generation = store.generation();
  await store.clear();
  assert.equal(await store.write(tokens(), generation), false);
  assert.equal(await store.read(), null);
});
test("Queued session writes cannot overtake logout", async () => {
  const store = createTokenStore(memory());
  await Promise.all([store.write(tokens()), store.clear()]);
  assert.equal(await store.read(), null);
});
test("Token store queue recovers after a storage failure", async () => {
  let fail = true;
  const storage = memory();
  const store = createTokenStore({
    ...storage,
    setItem: async (...args) => {
      if (fail) {
        fail = false;
        throw new Error("locked");
      }
      return storage.setItem(...args);
    },
  });
  await assert.rejects(store.write(tokens()));
  await store.write(tokens());
  assert.deepEqual(await store.read(), tokens());
});
test("Fresh sessions do not trigger token refresh", async () => {
  const store = createTokenStore(memory());
  await store.write(tokens());
  let calls = 0;
  const manager = createSessionManager(
    store,
    async () => {
      calls++;
      throw new Error("unneeded");
    },
    () => 100,
  );
  assert.equal((await manager.getSession()).data.userId, "rider-1");
  assert.equal(calls, 0);
});
test("Concurrent expired requests share a single refresh", async () => {
  const store = createTokenStore(memory());
  await store.write(tokens(10));
  let calls = 0;
  const manager = createSessionManager(
    store,
    async () => {
      calls++;
      await new Promise((resolve) => setTimeout(resolve, 5));
      return { ok: true, data: tokens(2000000) };
    },
    () => 100,
  );
  const results = await Promise.all([
    manager.getSession(),
    manager.getSession(),
    manager.getSession(),
  ]);
  assert.equal(calls, 1);
  assert.ok(results.every((result) => result.ok && result.data.accessTokenExpiresAt === 2000000));
});
test("Temporary refresh failure preserves the recoverable session", async () => {
  const store = createTokenStore(memory());
  await store.write(tokens(10));
  const manager = createSessionManager(
    store,
    async () => ({ ok: false, error: { code: "NETWORK", message: "offline" } }),
    () => 100,
  );
  assert.equal((await manager.getSession()).error.code, "NETWORK");
  assert.ok(await store.read());
});
test("Revoked refresh credentials clear local session", async () => {
  const store = createTokenStore(memory());
  await store.write(tokens(10));
  const manager = createSessionManager(
    store,
    async () => ({ ok: false, error: { code: "UNAUTHENTICATED", message: "revoked" } }),
    () => 100,
  );
  assert.equal((await manager.getSession()).error.code, "UNAUTHENTICATED");
  assert.equal(await store.read(), null);
});
test("A refresh response cannot switch rider identity", async () => {
  const store = createTokenStore(memory());
  await store.write(tokens(10));
  const manager = createSessionManager(
    store,
    async () => ({ ok: true, data: { ...tokens(), userId: "rider-2" } }),
    () => 100,
  );
  assert.equal((await manager.getSession()).error.code, "INVALID_RESPONSE");
  assert.equal((await store.read()).userId, "rider-1");
});
test("Logging out during refresh does not resurrect the session", async () => {
  const store = createTokenStore(memory());
  await store.write(tokens(10));
  let finish;
  let entered;
  const started = new Promise((resolve) => {
    entered = resolve;
  });
  const manager = createSessionManager(
    store,
    async () => {
      entered();
      return new Promise((resolve) => {
        finish = resolve;
      });
    },
    () => 100,
  );
  const pending = manager.getSession();
  await started;
  await manager.clear();
  finish({ ok: true, data: tokens() });
  assert.equal((await pending).data, null);
  assert.equal(await store.read(), null);
});
