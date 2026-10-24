const test = require("node:test");
const assert = require("node:assert/strict");
const { loadSource } = require("../support/loadSource.cjs");
const {
  decodeLogin,
  decodeAssignment,
  decodeAssignmentList,
  decodeProfile,
  decodeRoute,
  formatInr,
  hasLocation,
} = loadSource("services/legacy/contracts.ts");
const { createLegacyRiderApi } = loadSource("services/legacy/client.ts");
const { createLegacySessionStore, decodeLegacySession, fromLogin } = loadSource(
  "services/legacy/sessionModel.ts",
);
const { createApiClient } = loadSource("services/api/client.ts");
const login = {
  token: "jwt.test.token",
  username: "9800000000",
  name: "Test Rider",
  role: "ROLE_RIDER",
  personId: 88,
};
const assignment = {
  id: 701,
  orderId: 501,
  orderNumber: "SO-2026-00412",
  status: "ASSIGNED",
  assignedAt: "2026-10-13T11:30:00",
  warehouseName: "Example Warehouse",
  warehouseAddress: "Pickup Road",
  warehouseLatitude: 18.5204,
  warehouseLongitude: 73.8567,
  customerName: "Example Customer",
  customerPhone: "9800000001",
  deliveryAddress: "Drop Road",
  customerLatitude: 18.559,
  customerLongitude: 73.7868,
  grandTotal: 2499,
  unloadingCharge: 0,
  paymentMethod: "COD",
  orderItems: [
    { productName: "T-Shirt", variantLabel: "M", sku: "TSH-M", orderedQty: 2, lineTotal: 958 },
  ],
};
const envelope = (data, status = 200) =>
  new Response(JSON.stringify({ success: true, message: "OK", data }), { status });
const configured = (transport, token = "jwt.test.token", onUnauthorized) =>
  createLegacyRiderApi({
    baseUrl: "https://rider.example.test",
    transport,
    getAccessToken: async () => token,
    onUnauthorized,
  });
test("raw legacy login requires ROLE_RIDER and a valid token", () => {
  assert.equal(decodeLogin(login).token, login.token);
  assert.throws(() => decodeLogin({ ...login, role: "ROLE_ADMIN" }));
  assert.throws(() => decodeLogin({ ...login, token: "bad\r\nx" }));
  assert.throws(() => decodeLogin({ ...login, token: "" }));
});
test("contract validators reject invalid assignment identifiers and transition values", () => {
  assert.equal(decodeAssignment(assignment).id, 701);
  assert.equal(decodeAssignment(assignment).orderItems[0].productName, "T-Shirt");
  assert.throws(() => decodeAssignment({ ...assignment, id: 0 }));
  assert.throws(() => decodeAssignment({ ...assignment, status: "ACCEPTED" }));
  assert.throws(() => decodeAssignment({ ...assignment, customerLatitude: 1000 }));
  assert.throws(() => decodeAssignmentList([{ ...assignment }, { ...assignment }]));
  assert.equal(hasLocation(decodeAssignment({ ...assignment, customerLatitude: null })), false);
  assert.equal(formatInr(2499.5), "₹2,499.50");
});
test("profile and route decoder expect documented backend structures", () => {
  const profile = decodeProfile({
    riderId: 31,
    name: "Test",
    phone: "9800000000",
    email: null,
    vehicleType: "BIKE",
    status: "active",
    rating: 4.5,
  });
  assert.equal(profile.vehicleType, "BIKE");
  assert.equal(
    decodeRoute({
      routes: [{ distanceMeters: 8400, duration: "1260s", polyline: { encodedPolyline: "route" } }],
    }).durationSeconds,
    1260,
  );
  assert.throws(() => decodeRoute({ error: "Google Maps API key not configured" }));
  assert.throws(() => decodeRoute({ routes: [] }));
  assert.throws(() =>
    decodeRoute({
      routes: [{ distanceMeters: 1000, duration: "bad", polyline: { encodedPolyline: "x" } }],
    }),
  );
});
test("shared legacy auth sends correct request body without bearer tokens", async () => {
  const requests = [];
  const api = configured(async (url, options) => {
    requests.push({ url, options });
    if (url.endsWith("/api/auth/login")) return new Response(JSON.stringify(login));
    return envelope("requested");
  });
  assert.equal((await api.requestOtp("9800000000")).ok, true);
  const result = await api.loginPassword("9800000000", "pass");
  assert.equal(result.ok, true);
  assert.equal(result.data.role, "ROLE_RIDER");
  await api.loginOtp("9800000000", "123456");
  assert.deepEqual(JSON.parse(requests[0].options.body), {
    identifier: "9800000000",
    purpose: "LOGIN",
  });
  assert.equal(requests[0].options.headers.Authorization, undefined);
  assert.deepEqual(JSON.parse(requests[1].options.body), {
    identifier: "9800000000",
    password: "pass",
    loginMethod: "PASSWORD",
  });
  assert.deepEqual(JSON.parse(requests[2].options.body), {
    identifier: "9800000000",
    otp: "123456",
    loginMethod: "OTP",
  });
});
test("existing rider endpoints use assignment id and no arbitrary rider id", async () => {
  const requests = [];
  const api = configured(async (url, options) => {
    requests.push({ url, options });
    if (url.includes("/maps/route"))
      return envelope({
        routes: [{ distanceMeters: 1000, duration: "60s", polyline: { encodedPolyline: "route" } }],
      });
    if (url.endsWith("/profile"))
      return envelope({
        riderId: 31,
        name: "Test",
        phone: "9800000000",
        vehicleType: "BIKE",
        status: "active",
      });
    if (url.includes("/history")) return envelope([assignment]);
    if (url.endsWith("/orders")) return envelope([assignment]);
    return envelope(assignment);
  });
  assert.equal((await api.orders()).data[0].id, 701);
  assert.equal((await api.history()).data[0].orderNumber, assignment.orderNumber);
  assert.equal((await api.detail(701)).data.id, 701);
  assert.equal((await api.profile()).data.status, "active");
  assert.equal((await api.route(18.52, 73.85, 18.55, 73.78)).data.distanceMeters, 1000);
  assert.ok(
    requests.every(({ options }) => options.headers.Authorization === "Bearer jwt.test.token"),
  );
  assert.ok(requests.every(({ options }) => options.method === "GET"));
  assert.ok(requests.some(({ url }) => url.endsWith("/api/rider-app/orders/701")));
  assert.ok(requests.every(({ url }) => !url.includes("riderId=")));
});
test("legacy adapter rejects versioned subpath and invalid route envelopes", async () => {
  assert.throws(() =>
    createLegacyRiderApi({ baseUrl: "https://rider.example.test/api/rider-app" }),
  );
  const api = configured(async () => envelope({ error: "No routes found" }));
  const result = await api.route(18.52, 73.85, 18.55, 73.78);
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "INVALID_RESPONSE");
});
test("legacy business errors retain safe code without exposing raw backend message", async () => {
  let count = 0;
  const api = configured(async () => {
    count++;
    return new Response(
      JSON.stringify({
        traceId: "internal-trace",
        error: "BUSINESS_ERROR",
        message: "rider PII must not leak",
        status: 400,
      }),
      { status: 400 },
    );
  });
  const result = await api.orders();
  assert.equal(result.ok, false);
  assert.equal(result.error.serverCode, "BUSINESS_ERROR");
  assert.doesNotMatch(result.error.message, /PII/);
  assert.equal(count, 1);
});
test("a 401 signs out the user and forbidden statuses are not mistaken for valid auth", async () => {
  let invalid = 0;
  const api = configured(
    async () => new Response("{}", { status: 401 }),
    "token",
    () => invalid++,
  );
  assert.equal((await api.profile()).error.code, "UNAUTHENTICATED");
  assert.equal(invalid, 1);
  const raw = createApiClient({
    baseUrl: "https://rider.example.test",
    getAccessToken: async () => null,
    transport: async () => new Response(JSON.stringify({ ...login, role: "ROLE_ADMIN" })),
  });
  const attempted = await raw.request("/api/auth/login", {
    method: "POST",
    authenticated: false,
    responseFormat: "raw",
    decode: decodeLogin,
  });
  assert.equal(attempted.error.code, "INVALID_RESPONSE");
});
test("legacy native session store rejects stale sessions and clears on logout", async () => {
  let data = null;
  const store = createLegacySessionStore({
    getItem: async () => data,
    setItem: async (_, value) => {
      data = value;
    },
    removeItem: async () => {
      data = null;
    },
  });
  const item = fromLogin(decodeLogin(login));
  assert.equal(await store.save(item), true);
  assert.equal((await store.read()).username, login.username);
  const generation = store.generation();
  await store.clear();
  assert.equal(await store.read(), null);
  assert.equal(await store.save(item, generation), false);
  assert.equal(decodeLegacySession({ ...item, expiresAt: Date.now() - 10 }), null);
  assert.equal(
    decodeLegacySession({ ...item, expiresAt: Date.now() + 10 * 24 * 60 * 60 * 1000 }),
    null,
  );
  assert.equal(data, null);
});
test("backend status mutation endpoints remain absent from the unsafe initial live adapter", () => {
  const api = configured(async () => envelope([]));
  for (const name of ["picked", "delivered", "failed", "toggleAvailability", "acceptOffer"]) {
    assert.equal(Object.hasOwn(api, name), false);
  }
});
