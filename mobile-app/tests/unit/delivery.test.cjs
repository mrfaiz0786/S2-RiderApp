const test = require("node:test");
const assert = require("node:assert/strict");
const { loadSource } = require("../support/loadSource.cjs");
const {
  deliveryReducer: reduce,
  initialDeliveryState: initial,
  deliveryFlags,
  deliveryTotals,
} = loadSource("features/delivery/model/reducer.ts");
const { createTestOrder } = loadSource("features/delivery/data/testScenario.ts");
const NOW = 1800000000000;
function offered(method = "cod") {
  return reduce(reduce(initial, { type: "availabilityChanged", value: true }), {
    type: "offerCreated",
    cityId: "delhi",
    paymentMethod: method,
    now: NOW,
  });
}
function accepted(method = "cod") {
  return reduce(offered(method), { type: "acceptOffer", now: NOW + 100 });
}
function atPickup(method = "cod") {
  return reduce(accepted(method), { type: "advanceRoute", leg: "pickup", step: 1, now: NOW + 200 });
}
function pickedUp(method = "cod") {
  return reduce(atPickup(method), { type: "confirmPickup", code: "112233", now: NOW + 300 });
}
function atDrop(method = "cod") {
  return reduce(pickedUp(method), { type: "advanceRoute", leg: "drop", step: 1, now: NOW + 400 });
}
function verified(method = "cod") {
  return reduce(atDrop(method), { type: "verifyDelivery", code: "654321", now: NOW + 500 });
}
function completed() {
  return reduce(verified(), {
    type: "confirmCod",
    amountPaise: 64900,
    confirmed: true,
    now: NOW + 600,
  });
}
test("test journey starts offline with no fake completed jobs or earnings", () => {
  assert.equal(initial.status, "idle");
  assert.equal(initial.order, null);
  assert.deepEqual(deliveryTotals(initial), { earnedPaise: 0, codHeldPaise: 0, completed: 0 });
});
test("offline riders cannot receive an order", () =>
  assert.equal(
    reduce(initial, { type: "offerCreated", cityId: "delhi", paymentMethod: "cod", now: NOW }),
    initial,
  ));
test("sample order has complete amounts, item details and city-specific geography", () => {
  for (const cityId of ["delhi", "noida", "gurugram", "bengaluru"]) {
    const order = createTestOrder(1, cityId, "cod", NOW);
    assert.equal(
      order.items.reduce((sum, item) => sum + item.amountPaise, 0),
      64900,
    );
    assert.equal(order.basePayPaise + order.distancePayPaise + order.bonusPaise, order.payoutPaise);
    assert.equal(order.codPaise, 64900);
    assert.equal(order.payoutPaise, 8600);
    assert.ok(order.pickup.address.includes("fictional"));
    assert.ok(order.drop.address.includes("fictional"));
    assert.deepEqual(order.pickupRoute.at(-1), order.dropRoute[0]);
  }
});
test("offer receipt does not auto-accept", () => {
  assert.equal(offered().status, "offered");
  assert.equal(deliveryFlags(offered()).jobAccepted, false);
});
test("accept checks expiry including the exact expiry boundary", () => {
  const state = offered();
  assert.equal(
    reduce(state, { type: "acceptOffer", now: state.order.expiresAt }).status,
    "expired",
  );
  assert.equal(
    reduce(state, { type: "acceptOffer", now: state.order.expiresAt - 1 }).status,
    "accepted",
  );
});
test("going offline blocks acceptance but preserves an existing active parcel", () => {
  const waiting = reduce(offered(), { type: "availabilityChanged", value: false });
  assert.equal(reduce(waiting, { type: "acceptOffer", now: NOW + 1 }), waiting);
  const active = reduce(pickedUp(), { type: "availabilityChanged", value: false });
  assert.equal(active.status, "picked_up");
  assert.equal(active.order.id, "YBM-TEST-0001");
});
test("a new offer cannot overwrite pending or active work", () => {
  for (const state of [offered(), accepted(), pickedUp(), verified()])
    assert.equal(
      reduce(state, {
        type: "offerCreated",
        cityId: "delhi",
        paymentMethod: "prepaid",
        now: NOW + 700,
      }),
      state,
    );
});
test("decline cannot erase accepted work and does not create earnings", () => {
  const state = accepted();
  assert.equal(reduce(state, { type: "declineOffer", now: NOW + 200 }), state);
  const declined = reduce(offered(), { type: "declineOffer", now: NOW + 200 });
  assert.equal(declined.status, "declined");
  assert.equal(declined.history.length, 0);
});
test("declined and expired offers require a new offer rather than being silently accepted", () => {
  const declined = reduce(offered(), { type: "declineOffer", now: NOW + 200 });
  assert.equal(reduce(declined, { type: "acceptOffer", now: NOW + 300 }), declined);
  const next = reduce(declined, {
    type: "offerCreated",
    cityId: "noida",
    paymentMethod: "prepaid",
    now: NOW + 400,
  });
  assert.equal(next.order.id, "YBM-TEST-0002");
  assert.equal(next.order.cityId, "noida");
});
test("pickup route cannot advance before acceptance", () => {
  const state = offered();
  assert.equal(
    reduce(state, { type: "advanceRoute", leg: "pickup", step: 1, now: NOW + 10 }),
    state,
  );
});
test("drop route cannot advance before pickup verification", () => {
  const state = accepted();
  assert.equal(reduce(state, { type: "advanceRoute", leg: "drop", step: 1, now: NOW + 10 }), state);
});
test("invalid route steps are ignored", () => {
  const state = accepted();
  for (const step of [-1, 0, 2, NaN, Infinity])
    assert.equal(
      reduce(state, { type: "advanceRoute", leg: "pickup", step, now: NOW + 1000 }),
      state,
    );
});
test("route advancement clamps at arrival", () => {
  let state = reduce(accepted(), {
    type: "advanceRoute",
    leg: "pickup",
    step: 0.8,
    now: NOW + 1000,
  });
  state = reduce(state, { type: "advanceRoute", leg: "pickup", step: 0.8, now: NOW + 1001 });
  assert.equal(state.status, "at_pickup");
  assert.equal(state.pickupProgress, 1);
});
test("correct pickup PIN cannot bypass arrival", () => {
  const state = accepted();
  assert.equal(reduce(state, { type: "confirmPickup", code: "112233", now: NOW + 1 }), state);
});
test("wrong pickup PIN does not change the order", () => {
  const state = atPickup();
  assert.equal(reduce(state, { type: "confirmPickup", code: "000000", now: NOW + 1 }), state);
});
test("delivery OTP cannot bypass the drop route", () => {
  const state = pickedUp();
  assert.equal(reduce(state, { type: "verifyDelivery", code: "654321", now: NOW + 1 }), state);
});
test("wrong or login OTP cannot complete delivery", () => {
  const state = atDrop();
  for (const code of ["000000", "123456", "112233", ""])
    assert.equal(reduce(state, { type: "verifyDelivery", code, now: NOW + 500 }), state);
});
test("COD OTP verification opens payment without a history or earnings entry", () => {
  const state = verified();
  assert.equal(state.status, "awaiting_payment");
  assert.equal(state.history.length, 0);
  assert.equal(deliveryTotals(state).earnedPaise, 0);
});
test("incorrect, fractional, missing or unconfirmed COD cannot finish the order", () => {
  const state = verified();
  for (const amountPaise of [0, 649, 64899, 65000, 64900.5, NaN])
    assert.equal(
      reduce(state, { type: "confirmCod", amountPaise, confirmed: true, now: NOW + 600 }),
      state,
    );
  assert.equal(
    reduce(state, { type: "confirmCod", amountPaise: 64900, confirmed: false, now: NOW + 600 }),
    state,
  );
});
test("COD collection cannot bypass delivery OTP", () => {
  const state = atDrop();
  assert.equal(
    reduce(state, { type: "confirmCod", amountPaise: 64900, confirmed: true, now: NOW + 600 }),
    state,
  );
});
test("complete COD journey creates exactly one receipt and separate earnings/cash totals", () => {
  const state = completed();
  assert.equal(state.status, "completed");
  assert.equal(state.history.length, 1);
  assert.deepEqual(deliveryTotals(state), { earnedPaise: 8600, codHeldPaise: 64900, completed: 1 });
  assert.equal(state.history[0].order.id, "YBM-TEST-0001");
  assert.equal(state.history[0].events.at(-1).type, "Delivered (simulation)");
});
test("double confirmation and OTP resubmission cannot duplicate receipts", () => {
  const state = completed();
  assert.equal(
    reduce(state, { type: "confirmCod", amountPaise: 64900, confirmed: true, now: NOW + 700 }),
    state,
  );
  assert.equal(reduce(state, { type: "verifyDelivery", code: "654321", now: NOW + 700 }), state);
});
test("prepaid journey skips COD and completes after delivery OTP", () => {
  const state = verified("prepaid");
  assert.equal(state.status, "completed");
  assert.equal(state.history[0].codCollectedPaise, 0);
  assert.deepEqual(deliveryTotals(state), { earnedPaise: 8600, codHeldPaise: 0, completed: 1 });
});
test("requesting another test order preserves completed history", () => {
  const state = reduce(completed(), {
    type: "offerCreated",
    cityId: "bengaluru",
    paymentMethod: "prepaid",
    now: NOW + 900,
  });
  assert.equal(state.order.id, "YBM-TEST-0002");
  assert.equal(state.history.length, 1);
  assert.equal(state.pickupProgress, 0);
  assert.equal(state.dropProgress, 0);
});
test("invalid timestamps never mutate delivery state", () => {
  const state = offered();
  for (const now of [NaN, Infinity, 0, -1])
    assert.equal(reduce(state, { type: "acceptOffer", now }), state);
});
