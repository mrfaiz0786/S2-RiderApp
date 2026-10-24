import { demoConfig } from "@/services/demo/credentials";
import {
  createTestOrder,
  isTestCity,
  type PaymentMethod,
  type TestCity,
  type TestOrder,
} from "../data/testScenario";
export type DeliveryStatus =
  | "idle"
  | "offered"
  | "declined"
  | "expired"
  | "accepted"
  | "at_pickup"
  | "picked_up"
  | "at_dropoff"
  | "awaiting_payment"
  | "completed";
export type DeliveryEvent = { type: string; at: number };
export type DeliveryReceipt = {
  order: TestOrder;
  completedAt: number;
  codCollectedPaise: number;
  events: DeliveryEvent[];
};
export type DeliveryState = {
  online: boolean;
  status: DeliveryStatus;
  order: TestOrder | null;
  sequence: number;
  pickupProgress: number;
  dropProgress: number;
  events: DeliveryEvent[];
  history: DeliveryReceipt[];
};
export type DeliveryAction =
  | { type: "availabilityChanged"; value: boolean }
  | { type: "offerCreated"; cityId: TestCity; paymentMethod: PaymentMethod; now: number }
  | { type: "acceptOffer" | "declineOffer" | "expireOffer"; now: number }
  | { type: "advanceRoute"; leg: "pickup" | "drop"; step: number; now: number }
  | { type: "confirmPickup" | "verifyDelivery"; code: string; now: number }
  | { type: "confirmCod"; amountPaise: number; confirmed: boolean; now: number }
  | { type: "restore"; state: DeliveryState };
export const initialDeliveryState: DeliveryState = {
  online: false,
  status: "idle",
  order: null,
  sequence: 0,
  pickupProgress: 0,
  dropProgress: 0,
  events: [],
  history: [],
};
const event = (state: DeliveryState, type: string, at: number) => [...state.events, { type, at }];
function finish(state: DeliveryState, now: number): DeliveryState {
  const order = state.order;
  if (!order || state.history.some((receipt) => receipt.order.id === order.id)) return state;
  const events = event(state, "Delivered (simulation)", now);
  const receipt = { order, completedAt: now, codCollectedPaise: order.codPaise, events };
  return {
    ...state,
    status: "completed",
    events,
    history: [receipt, ...state.history].slice(0, 100),
  };
}
export function deliveryReducer(state: DeliveryState, action: DeliveryAction): DeliveryState {
  if ("now" in action && (!Number.isFinite(action.now) || action.now <= 0)) return state;
  switch (action.type) {
    case "restore":
      return { ...action.state, online: false };
    case "availabilityChanged":
      return { ...state, online: action.value };
    case "offerCreated": {
      if (
        !state.online ||
        !["idle", "declined", "expired", "completed"].includes(state.status) ||
        !isTestCity(action.cityId) ||
        !["cod", "prepaid"].includes(action.paymentMethod)
      )
        return state;
      const order = createTestOrder(
        state.sequence + 1,
        action.cityId,
        action.paymentMethod,
        action.now,
      );
      return {
        ...state,
        order,
        sequence: order.sequence,
        status: "offered",
        pickupProgress: 0,
        dropProgress: 0,
        events: [{ type: "Test order offered", at: action.now }],
      };
    }
    case "acceptOffer":
      if (!state.online || state.status !== "offered" || !state.order) return state;
      if (action.now >= state.order.expiresAt)
        return { ...state, status: "expired", events: event(state, "Offer expired", action.now) };
      return { ...state, status: "accepted", events: event(state, "Order accepted", action.now) };
    case "declineOffer":
      return state.status === "offered"
        ? { ...state, status: "declined", events: event(state, "Offer declined", action.now) }
        : state;
    case "expireOffer":
      return state.status === "offered" && state.order && action.now >= state.order.expiresAt
        ? { ...state, status: "expired", events: event(state, "Offer expired", action.now) }
        : state;
    case "advanceRoute": {
      if (!Number.isFinite(action.step) || action.step <= 0 || action.step > 1 || !state.order)
        return state;
      if (action.leg === "pickup" && state.status === "accepted") {
        const progress = Math.min(1, state.pickupProgress + action.step);
        return {
          ...state,
          pickupProgress: progress,
          status: progress >= 1 ? "at_pickup" : "accepted",
          events:
            progress >= 1 ? event(state, "Arrived at sample pickup", action.now) : state.events,
        };
      }
      if (action.leg === "drop" && state.status === "picked_up") {
        const progress = Math.min(1, state.dropProgress + action.step);
        return {
          ...state,
          dropProgress: progress,
          status: progress >= 1 ? "at_dropoff" : "picked_up",
          events: progress >= 1 ? event(state, "Arrived at sample drop", action.now) : state.events,
        };
      }
      return state;
    }
    case "confirmPickup":
      return state.status === "at_pickup" && action.code === demoConfig.pickupPin
        ? {
            ...state,
            status: "picked_up",
            events: event(state, "Sample pickup PIN verified", action.now),
          }
        : state;
    case "verifyDelivery": {
      if (state.status !== "at_dropoff" || !state.order || action.code !== demoConfig.deliveryPin)
        return state;
      const verified = {
        ...state,
        events: event(state, "Sample delivery OTP verified", action.now),
      };
      return state.order.paymentMethod === "cod"
        ? { ...verified, status: "awaiting_payment" }
        : finish(verified, action.now);
    }
    case "confirmCod": {
      if (
        state.status !== "awaiting_payment" ||
        !state.order ||
        state.order.paymentMethod !== "cod" ||
        !action.confirmed ||
        !Number.isInteger(action.amountPaise) ||
        action.amountPaise !== state.order.codPaise
      )
        return state;
      return finish(
        { ...state, events: event(state, "Simulated COD collected", action.now) },
        action.now,
      );
    }
    default:
      return state;
  }
}
export function deliveryFlags(state: DeliveryState) {
  return {
    jobAccepted: [
      "accepted",
      "at_pickup",
      "picked_up",
      "at_dropoff",
      "awaiting_payment",
      "completed",
    ].includes(state.status),
    pickupDone: ["picked_up", "at_dropoff", "awaiting_payment", "completed"].includes(state.status),
    deliveryDone: state.status === "completed",
  };
}
export const deliveryTotals = (state: DeliveryState) => ({
  earnedPaise: state.history.reduce((sum, item) => sum + item.order.payoutPaise, 0),
  codHeldPaise: state.history.reduce((sum, item) => sum + item.codCollectedPaise, 0),
  completed: state.history.length,
});
