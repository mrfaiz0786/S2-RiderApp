/** Client demo workflow only. The production server must authorize every transition. */
export type DeliveryStatus = "offer" | "declined" | "accepted" | "picked_up" | "completed";
export type DeliveryState = { online: boolean; status: DeliveryStatus };
export type DeliveryAction =
  | { type: "availabilityChanged"; value: boolean }
  | { type: "acceptOffer" | "declineOffer" | "confirmPickup" | "completeDelivery" };
export const initialDeliveryState: DeliveryState = { online: false, status: "offer" };
export function deliveryReducer(state: DeliveryState, action: DeliveryAction): DeliveryState {
  switch (action.type) {
    case "availabilityChanged":
      return { ...state, online: action.value };
    case "acceptOffer":
      return ["offer", "declined"].includes(state.status)
        ? { ...state, status: "accepted" }
        : state;
    case "declineOffer":
      return state.status === "offer" ? { ...state, status: "declined" } : state;
    case "confirmPickup":
      return state.status === "accepted" ? { ...state, status: "picked_up" } : state;
    case "completeDelivery":
      return state.status === "picked_up" ? { ...state, status: "completed" } : state;
    default:
      return state;
  }
}
export function deliveryFlags(state: DeliveryState) {
  return {
    jobAccepted: ["accepted", "picked_up", "completed"].includes(state.status),
    pickupDone: ["picked_up", "completed"].includes(state.status),
    deliveryDone: state.status === "completed",
  };
}
