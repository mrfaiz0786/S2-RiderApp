const test = require("node:test");
const assert = require("node:assert/strict");
const { loadSource } = require("../support/loadSource.cjs");
const { authReducer, initialAuthState } = loadSource("features/auth/model/reducer.ts");
const {
  onboardingReducer: onboard,
  initialOnboardingState,
  sampleReviewReady,
} = loadSource("features/onboarding/model/reducer.ts");
const { deliveryReducer: delivery, initialDeliveryState } = loadSource(
  "features/delivery/model/reducer.ts",
);
const { encodeDeliverySnapshot, decodeDeliverySnapshot } = loadSource(
  "features/delivery/model/persistence.ts",
);
const { resolveTestRoute } = loadSource("navigation/guards.ts");
const { createTestOrder } = loadSource("features/delivery/data/testScenario.ts");
const { pointAlongRoute, project, fitZoom, routeDistanceMeters } = loadSource(
  "features/delivery/model/mapGeometry.ts",
);
const now = 1800000000000;
function setup() {
  let state = onboard(initialOnboardingState, { type: "attachSampleDocuments" });
  state = onboard(state, { type: "checkSampleVehicle" });
  state = onboard(state, { type: "cityChanged", value: "delhi" });
  state = onboard(state, { type: "hubChanged", value: "delhi-central-demo" });
  state = onboard(state, { type: "accuracyChanged", value: true });
  return onboard(state, { type: "termsChanged", value: true });
}
function complete(method = "cod") {
  let state = delivery(initialDeliveryState, { type: "availabilityChanged", value: true });
  state = delivery(state, { type: "offerCreated", cityId: "delhi", paymentMethod: method, now });
  state = delivery(state, { type: "acceptOffer", now: now + 100 });
  state = delivery(state, { type: "advanceRoute", leg: "pickup", step: 1, now: now + 200 });
  state = delivery(state, { type: "confirmPickup", code: "112233", now: now + 300 });
  state = delivery(state, { type: "advanceRoute", leg: "drop", step: 1, now: now + 400 });
  state = delivery(state, { type: "verifyDelivery", code: "654321", now: now + 500 });
  return method === "cod"
    ? delivery(state, { type: "confirmCod", amountPaise: 64900, confirmed: true, now: now + 600 })
    : state;
}
test("only the shown test phone and login OTP establish a test session", () => {
  let state = authReducer(initialAuthState, { type: "phoneChanged", value: "9999999999" });
  assert.equal(authReducer(state, { type: "verifyTestOtp", code: "000000" }), state);
  assert.equal(authReducer(state, { type: "verifyTestOtp", code: "654321" }), state);
  state = authReducer(state, { type: "verifyTestOtp", code: "123456" });
  assert.equal(state.testSignedIn, true);
  assert.equal(
    authReducer(state, { type: "phoneChanged", value: "9999999998" }).testSignedIn,
    false,
  );
});
test("arbitrary ten-digit phone does not pass the test login", () => {
  const state = authReducer(initialAuthState, { type: "phoneChanged", value: "8888888888" });
  assert.equal(authReducer(state, { type: "verifyTestOtp", code: "123456" }).testSignedIn, false);
});
test("sample review requires documents, vehicle check, valid hub and both confirmations", () => {
  assert.equal(sampleReviewReady(initialOnboardingState), false);
  const ready = setup();
  assert.equal(sampleReviewReady(ready), true);
  for (const patch of [
    { vehicleChecked: false },
    { docStates: {} },
    { termsAccepted: false },
    { dataAccuracyAccepted: false },
    { workHub: "wrong" },
  ])
    assert.equal(sampleReviewReady({ ...ready, ...patch }), false);
});
test("review cannot be approved before running the sample check", () => {
  const state = setup();
  assert.equal(onboard(state, { type: "finishSampleReview" }), state);
});
test("sample review produces test-only approval, never real verified identity", () => {
  let state = onboard(setup(), { type: "startSampleReview" });
  assert.equal(state.sampleReview, "reviewing");
  state = onboard(state, { type: "finishSampleReview" });
  assert.equal(state.sampleReview, "test_approved");
  assert.equal(state.docStates.aadhaar, "Test verified");
  assert.notEqual(state.docStates.aadhaar, "Verified");
});
test("changing vehicle revokes test approval and requires another vehicle check", () => {
  const approved = onboard(onboard(setup(), { type: "startSampleReview" }), {
    type: "finishSampleReview",
  });
  const changed = onboard(approved, { type: "vehicleChanged", value: "Bicycle / Cycle" });
  assert.equal(changed.sampleReview, "not_started");
  assert.equal(changed.vehicleChecked, false);
});
test("test navigation cannot bypass login or sample approval", () => {
  assert.equal(
    resolveTestRoute("home", { signedIn: false, approved: false, status: "idle" }),
    "welcome",
  );
  assert.equal(
    resolveTestRoute("offers", { signedIn: true, approved: false, status: "idle" }),
    "verification-status",
  );
});
test("test navigation cannot jump from acceptance to delivery OTP or COD", () => {
  const access = { signedIn: true, approved: true, status: "accepted" };
  assert.equal(resolveTestRoute("delivery-completion", access), "pickup");
  assert.equal(resolveTestRoute("cod-payment", access), "active-job");
  assert.equal(resolveTestRoute("delivery-navigation", access), "pickup");
});
test("route interpolation is clamped and ends at the actual sample destination", () => {
  const route = createTestOrder(1, "delhi", "cod", now).dropRoute;
  assert.deepEqual(pointAlongRoute(route, -1), route[0]);
  assert.deepEqual(pointAlongRoute(route, 1), route.at(-1));
  assert.deepEqual(pointAlongRoute(route, 2), route.at(-1));
  assert.deepEqual(pointAlongRoute(route, NaN), route[0]);
  assert.ok(routeDistanceMeters(route) > 0);
  assert.throws(() => pointAlongRoute([], 0));
});
test("map projection stays finite and the fitting zoom shows the sample path", () => {
  const route = createTestOrder(1, "delhi", "cod", now).dropRoute;
  const zoom = fitZoom(route, 340, 300);
  assert.ok(zoom >= 11 && zoom <= 17);
  for (const point of route) {
    const pixel = project(point, zoom);
    assert.ok(Number.isFinite(pixel.x));
    assert.ok(Number.isFinite(pixel.y));
  }
  assert.ok(Number.isFinite(project({ latitude: 90, longitude: 0 }, 15).y));
});
test("completed COD and prepaid histories survive the local snapshot roundtrip", () => {
  for (const method of ["cod", "prepaid"]) {
    const state = complete(method),
      restored = decodeDeliverySnapshot(encodeDeliverySnapshot(state));
    assert.equal(restored.status, "completed");
    assert.equal(restored.online, false);
    assert.equal(restored.history.length, 1);
    assert.deepEqual(restored.history[0], state.history[0]);
  }
});
test("snapshot does not store submitted OTPs or user identity inputs", () => {
  const snapshot = encodeDeliverySnapshot(complete());
  assert.equal(snapshot.includes('"code"'), false);
  assert.equal(snapshot.includes('"phone"'), false);
  assert.equal(snapshot.includes('"docStates"'), false);
});
test("corrupted or old snapshot starts safely with an empty test history", () => {
  for (const raw of [null, "", "{broken", "{}", '{"schema":0}'])
    assert.equal(decodeDeliverySnapshot(raw), initialDeliveryState);
});
test("malformed completed state or duplicated receipt is rejected on restore", () => {
  const state = complete();
  assert.equal(
    decodeDeliverySnapshot(encodeDeliverySnapshot({ ...state, dropProgress: 0 })),
    initialDeliveryState,
  );
  assert.equal(
    decodeDeliverySnapshot(
      encodeDeliverySnapshot({ ...state, history: [state.history[0], state.history[0]] }),
    ),
    initialDeliveryState,
  );
  assert.equal(
    decodeDeliverySnapshot(encodeDeliverySnapshot({ ...state, history: [] })),
    initialDeliveryState,
  );
});
test("restored order amounts are rebuilt from canonical test fixtures", () => {
  const state = complete(),
    parsed = JSON.parse(encodeDeliverySnapshot(state));
  parsed.state.order.payoutPaise = 9999999;
  parsed.state.history[0].order.payoutPaise = 9999999;
  const restored = decodeDeliverySnapshot(JSON.stringify(parsed));
  assert.equal(restored.order.payoutPaise, 8600);
  assert.equal(restored.history[0].order.payoutPaise, 8600);
});
