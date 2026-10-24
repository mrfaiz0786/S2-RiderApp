const test = require("node:test");
const assert = require("node:assert/strict");
const { loadSource } = require("../support/loadSource.cjs");
const { createApiClient } = loadSource("services/api/client.ts");
const { createRiderApi } = loadSource("services/api/operations.ts");
const { apiOperations } = loadSource("services/api/catalog.ts");
const decode = (value) => value;
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify({ data }), { status, headers });
function client(transport, settings = {}) {
  return createApiClient({
    baseUrl: "https://api.example.test/v1",
    getAccessToken: async () => "test-access-token",
    transport,
    ...settings,
  });
}

test("API rejects unsafe base URLs and invalid timeouts", () => {
  for (const baseUrl of [
    "",
    "http://api.example.test",
    "https://user:pass@api.example.test",
    "https://api.example.test?key=secret",
    "https://api.example.test/#token",
  ]) {
    assert.throws(() => createApiClient({ baseUrl }));
  }
  for (const timeoutMs of [0, -1, 60001, 1.1, NaN])
    assert.throws(() => createApiClient({ baseUrl: "https://api.example.test", timeoutMs }));
});
test("API never performs authenticated requests without a session", async () => {
  let calls = 0;
  const api = client(
    async () => {
      calls++;
      return json({});
    },
    { getAccessToken: async () => null },
  );
  const result = await api.request("/riders/me", { decode });
  assert.equal(result.error.code, "UNAUTHENTICATED");
  assert.equal(calls, 0);
});
test("API handles secure token read failures", async () => {
  const api = client(
    async () => {
      throw new Error("must not call");
    },
    {
      getAccessToken: async () => {
        throw new Error("keychain locked");
      },
    },
  );
  assert.equal((await api.request("/riders/me", { decode })).error.code, "STORAGE");
});
test("API rejects token header injection", async () => {
  let called = false;
  const api = client(
    async () => {
      called = true;
      return json({});
    },
    { getAccessToken: async () => "token\r\nother-header: value" },
  );
  assert.equal((await api.request("/riders/me", { decode })).ok, false);
  assert.equal(called, false);
});
test("API encodes query values and retains versioned base path", async () => {
  let observed;
  const api = client(async (url, options) => {
    observed = { url, options };
    return json({ name: "Rider" }, 200, { "x-request-id": "req-123" });
  });
  const result = await api.request("/riders/me", {
    query: { search: "A & B", limit: 10, unused: undefined },
    decode,
  });
  assert.equal(observed.url, "https://api.example.test/v1/riders/me?search=A%20%26%20B&limit=10");
  assert.equal(observed.options.headers.Authorization, "Bearer test-access-token");
  assert.equal(observed.options.redirect, "error");
  assert.equal(result.requestId, "req-123");
  assert.deepEqual(result.data, { name: "Rider" });
});
test("Public OTP request does not attach an existing session token", async () => {
  let headers;
  const api = client(async (_, options) => {
    headers = options.headers;
    return json({ challengeId: "c1" });
  });
  await api.request("/auth/otp/requests", {
    method: "POST",
    authenticated: false,
    body: { phoneE164: "+910000000000" },
    decode,
  });
  assert.equal(headers.Authorization, undefined);
  assert.equal(headers["Content-Type"], "application/json");
});
test("API rejects cross-origin URLs, unresolved templates and path traversal", async () => {
  let calls = 0;
  const api = client(async () => {
    calls++;
    return json({});
  });
  for (const path of [
    "https://attacker.test",
    "//attacker.test",
    "/../auth",
    "/a/./b",
    "/a//b",
    "/%2e%2e/auth",
    "/jobs/{jobId}",
    "/a?token=x",
    "/a#b",
  ]) {
    assert.equal((await api.request(path, { decode })).error.code, "VALIDATION", path);
  }
  assert.equal(calls, 0);
});
test("API rejects invalid idempotency keys and invalid bodies before transport", async () => {
  let calls = 0;
  const api = client(async () => {
    calls++;
    return json({});
  });
  assert.equal(
    (await api.request("/jobs", { method: "POST", idempotencyKey: "bad", decode })).error.code,
    "VALIDATION",
  );
  assert.equal(
    (await api.request("/jobs", { method: "GET", body: {}, decode })).error.code,
    "VALIDATION",
  );
  const circular = {};
  circular.self = circular;
  assert.equal(
    (await api.request("/jobs", { method: "POST", body: circular, decode })).error.code,
    "VALIDATION",
  );
  assert.equal(calls, 0);
});
test("API returns typed errors without exposing server text", async () => {
  const statuses = [
    [400, "VALIDATION"],
    [401, "UNAUTHENTICATED"],
    [403, "FORBIDDEN"],
    [404, "NOT_FOUND"],
    [409, "CONFLICT"],
    [412, "CONFLICT"],
    [422, "VALIDATION"],
    [429, "RATE_LIMITED"],
    [500, "SERVER"],
    [503, "SERVER"],
  ];
  for (const [status, code] of statuses) {
    const api = client(
      async () =>
        new Response(
          JSON.stringify({
            error: { code: "OFFER_EXPIRED", message: "private database password" },
          }),
          { status },
        ),
    );
    const result = await api.request("/offers", { decode });
    assert.equal(result.error.code, code);
    assert.equal(result.error.serverCode, "OFFER_EXPIRED");
    assert.equal(JSON.stringify(result).includes("password"), false);
  }
});
test("API accepts numeric Retry-After and safely handles non-JSON errors", async () => {
  const api = client(
    async () =>
      new Response("upstream private error", { status: 429, headers: { "retry-after": "30" } }),
  );
  const result = await api.request("/offers", { decode });
  assert.equal(result.error.retryAfterSeconds, 30);
  assert.equal(result.error.code, "RATE_LIMITED");
  assert.equal(JSON.stringify(result).includes("upstream"), false);
});
test("API calls unauthorized handler only for protected requests", async () => {
  let expired = 0;
  const api = client(async () => new Response("", { status: 401 }), {
    onUnauthorized: () => {
      expired++;
    },
  });
  await api.request("/auth/otp/verify", { method: "POST", authenticated: false, decode });
  assert.equal(expired, 0);
  await api.request("/riders/me", { decode });
  assert.equal(expired, 1);
});
test("API rejects malformed JSON, missing envelopes and failed decoders", async () => {
  for (const transport of [
    async () => new Response("invalid"),
    async () => new Response(JSON.stringify({ notData: true })),
    async () => json({ unexpected: true }),
  ]) {
    const api = client(transport);
    const result = await api.request("/riders/me", {
      decode: () => {
        throw new Error("invalid DTO");
      },
    });
    assert.equal(result.error.code, "INVALID_RESPONSE");
  }
});
test("API handles valid empty 204 and nullable successful responses", async () => {
  const api = client(async () => new Response(null, { status: 204 }));
  assert.deepEqual(
    await api.request("/auth/logout", {
      method: "POST",
      decode: (value) => {
        assert.equal(value, undefined);
        return null;
      },
    }),
    { ok: true, data: null, requestId: undefined },
  );
  const empty = client(async () => json(null));
  assert.equal((await empty.request("/riders/me/jobs/active", { decode })).data, null);
});
test("API network errors never automatically replay a mutation", async () => {
  let attempts = 0;
  const api = client(async () => {
    attempts++;
    throw new Error("offline");
  });
  const result = await api.request("/offers/o1/accept", {
    method: "POST",
    body: {},
    idempotencyKey: "action-1234567890123456",
    decode,
  });
  assert.equal(result.error.code, "NETWORK");
  assert.equal(attempts, 1);
});
test("API timeout aborts the in-flight transport", async () => {
  const api = client(
    (_, options) =>
      new Promise((_, reject) => {
        options.signal.addEventListener("abort", () => reject(new Error("aborted")), {
          once: true,
        });
      }),
    { timeoutMs: 10 },
  );
  assert.equal((await api.request("/offers", { decode })).error.code, "TIMEOUT");
});
test("API supports cancellation before and during transport", async () => {
  let calls = 0;
  const pre = new AbortController();
  pre.abort();
  const api = client(async () => {
    calls++;
    return json({});
  });
  assert.equal(
    (await api.request("/offers", { signal: pre.signal, decode })).error.code,
    "CANCELLED",
  );
  assert.equal(calls, 0);
  const active = new AbortController();
  const pendingApi = client(
    (_, options) =>
      new Promise((_, reject) => {
        options.signal.addEventListener("abort", () => reject(new Error("aborted")), {
          once: true,
        });
        active.abort();
      }),
  );
  assert.equal(
    (await pendingApi.request("/offers", { signal: active.signal, decode })).error.code,
    "CANCELLED",
  );
});
test("Draft API catalog has unique operation routes and mandatory mutation keys", () => {
  const operations = Object.values(apiOperations);
  assert.equal(new Set(operations.map((op) => op.method + " " + op.path)).size, operations.length);
  assert.ok(operations.length >= 50);
  for (const operation of operations) {
    assert.ok(operation.requestFields && operation.responseFields && operation.purpose);
    if (operation.method !== "GET") assert.equal(operation.requiresIdempotencyKey, true);
  }
});
test("Rider API validates route parameters and mutation identity", async () => {
  let observed;
  const api = createRiderApi({
    request: async (...args) => {
      observed = args;
      return { ok: true, data: {} };
    },
  });
  assert.equal(
    (await api.call("acceptOffer", { pathParams: { offerId: "o1" }, decode })).error.code,
    "VALIDATION",
  );
  assert.equal(
    (await api.call("job", { pathParams: { jobId: "../me" }, decode })).error.code,
    "VALIDATION",
  );
  assert.equal((await api.call("job", { decode })).error.code, "VALIDATION");
  const result = await api.call("acceptOffer", {
    pathParams: { offerId: "offer-1" },
    idempotencyKey: "action-1234567890123456",
    body: { expectedVersion: 1 },
    decode,
  });
  assert.equal(result.ok, true);
  assert.equal(observed[0], "/offers/offer-1/accept");
  assert.equal(observed[1].method, "POST");
  assert.equal(observed[1].authenticated, true);
});
