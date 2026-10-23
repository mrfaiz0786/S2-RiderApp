const test = require("node:test");
const assert = require("node:assert/strict");
const { loadSource } = require("../support/loadSource.cjs");
const {
  deliveryReducer: reduce,
  initialDeliveryState: initial,
  deliveryFlags,
} = loadSource("features/delivery/model/reducer.ts");
test("pickup cannot happen before acceptance", () =>
  assert.equal(reduce(initial, { type: "confirmPickup" }), initial));
test("completion cannot happen before pickup", () => {
  const accepted = reduce(initial, { type: "acceptOffer" });
  assert.equal(reduce(accepted, { type: "completeDelivery" }), accepted);
});
test("demo follows accept, pickup, complete sequence", () => {
  let state = reduce(initial, { type: "acceptOffer" });
  state = reduce(state, { type: "confirmPickup" });
  state = reduce(state, { type: "completeDelivery" });
  assert.equal(state.status, "completed");
  assert.deepEqual(deliveryFlags(state), {
    jobAccepted: true,
    pickupDone: true,
    deliveryDone: true,
  });
});
test("duplicate completion cannot change state twice", () => {
  const state = { online: true, status: "completed" };
  assert.equal(reduce(state, { type: "completeDelivery" }), state);
});
test("decline cannot erase an already accepted parcel", () => {
  const state = reduce(initial, { type: "acceptOffer" });
  assert.equal(reduce(state, { type: "declineOffer" }), state);
});
test("availability changes preserve active delivery", () =>
  assert.deepEqual(
    reduce({ online: true, status: "picked_up" }, { type: "availabilityChanged", value: false }),
    { online: false, status: "picked_up" },
  ));
test("declined sample can be accepted again for preview testing", () => {
  const state = reduce(initial, { type: "declineOffer" });
  assert.equal(reduce(state, { type: "acceptOffer" }).status, "accepted");
});
test("opening a completed offer does not reset delivery", () => {
  const state = { online: false, status: "completed" };
  assert.equal(reduce(state, { type: "acceptOffer" }), state);
});
