const test = require("node:test");
const assert = require("node:assert/strict");
const { loadSource } = require("../support/loadSource.cjs");
const { routes, tabs, getRoute, isRouteName, defaultBackRoute } =
  loadSource("navigation/routes.ts");
const { navigationReducer: reduce, initialNavigationState: initial } =
  loadSource("navigation/reducer.ts");
test("all 21 routes have unique names and legacy references", () => {
  assert.equal(routes.length, 21);
  assert.equal(new Set(routes.map((r) => r.name)).size, 21);
  assert.equal(new Set(routes.map((r) => r.legacyId)).size, 21);
});
test("four primary tabs remain available", () =>
  assert.deepEqual(
    tabs.map((t) => t.name),
    ["home", "earnings", "history", "profile"],
  ));
test("focused delivery screens hide bottom navigation", () => {
  for (const name of [
    "offers",
    "active-job",
    "pickup",
    "delivery-navigation",
    "delivery-completion",
  ]) {
    assert.equal(getRoute(name).showTabs, false);
    assert.equal(getRoute(name).focusedDelivery, true);
  }
});
test("payouts belongs to Earnings tab", () => assert.equal(getRoute("payouts").tab, "earnings"));
test("onboarding follows city then hub then declarations", () => {
  assert.equal(defaultBackRoute("work-hub"), "work-city");
  assert.equal(defaultBackRoute("declarations"), "work-hub");
});
test("unknown routes are rejected", () => {
  assert.equal(isRouteName("admin"), false);
  assert.equal(isRouteName(6), false);
  assert.throws(() => getRoute("admin"));
});
test("navigation pushes and restores previous route", () => {
  const state = reduce(initial, { type: "navigate", target: "otp" });
  assert.deepEqual(reduce(state, { type: "back" }), initial);
});
test("same-route navigation does not grow history", () =>
  assert.equal(reduce(initial, { type: "navigate", target: "welcome" }), initial));
test("history is bounded", () => {
  let state = initial;
  for (let i = 0; i < 200; i++)
    state = reduce(state, { type: "navigate", target: i % 2 ? "home" : "earnings" });
  assert.equal(state.history.length, 50);
});
test("tabs reset stack rather than collecting previous tabs", () => {
  const state = reduce(
    { route: "support", history: ["welcome", "home", "profile"] },
    { type: "selectTab", target: "earnings" },
  );
  assert.deepEqual(state, { route: "earnings", history: ["home"] });
});
test("home tab clears navigation history", () =>
  assert.deepEqual(reduce(initial, { type: "selectTab", target: "home" }), {
    route: "home",
    history: [],
  }));
test("unsafe runtime route value is ignored", () =>
  assert.equal(reduce(initial, { type: "navigate", target: "missing" }), initial));
