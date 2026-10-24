import { useDelivery } from "@/features/delivery/model";
import { rupeesFromPaise } from "@/features/delivery/data/testScenario";
import { createFeatureStore } from "@/shared/state/createFeatureStore";
import { initialNotificationsState, notificationsReducer, type ReadUpdate } from "./reducer";
const { Provider, useStore } = createFeatureStore(
  "Notifications",
  initialNotificationsState,
  notificationsReducer,
);
export const NotificationsProvider = Provider;
export function useNotifications() {
  const { state, dispatch } = useStore();
  const { order, status, history } = useDelivery();
  const notifications = [
    ...(order
      ? [
          {
            id: order.id + "-offer",
            title: "You have a test order",
            body: `${order.id} · ${order.pickup.name} to ${order.drop.name} · rider earnings ${rupeesFromPaise(order.payoutPaise)}. ${status === "offered" ? "Review the offer before expiry." : "Offer is no longer pending."}`,
            at: order.offeredAt,
            orderId: order.id,
            kind: "offer" as const,
          },
        ]
      : []),
    ...history.map((receipt) => ({
      id: receipt.order.id + "-completed",
      title: "Test delivery completed",
      body: `${receipt.order.id} · ${rupeesFromPaise(receipt.order.payoutPaise)} simulated rider earnings added.`,
      at: receipt.completedAt,
      orderId: receipt.order.id,
      kind: "completed" as const,
    })),
  ].sort((a, b) => b.at - a.at);
  return {
    ...state,
    notifications,
    setNotificationRead: (value: ReadUpdate) => dispatch({ type: "readChanged", value }),
    setDeviceAlertsEnabled: (value: boolean) => dispatch({ type: "deviceAlertsChanged", value }),
  };
}
