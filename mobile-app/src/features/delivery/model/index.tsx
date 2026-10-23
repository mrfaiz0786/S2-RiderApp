import { createFeatureStore } from "@/shared/state/createFeatureStore";
import { deliveryFlags, deliveryReducer, initialDeliveryState } from "./reducer";
const { Provider, useStore } = createFeatureStore(
  "Delivery",
  initialDeliveryState,
  deliveryReducer,
);
export const DeliveryProvider = Provider;
export function useDelivery() {
  const { state, dispatch } = useStore();
  return {
    ...state,
    ...deliveryFlags(state),
    setOnline: (value: boolean) => dispatch({ type: "availabilityChanged", value }),
    acceptOffer: () => dispatch({ type: "acceptOffer" }),
    declineOffer: () => dispatch({ type: "declineOffer" }),
    confirmPickup: () => dispatch({ type: "confirmPickup" }),
    completeDelivery: () => dispatch({ type: "completeDelivery" }),
  };
}
