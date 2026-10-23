import { createFeatureStore } from "@/shared/state/createFeatureStore";
import type { ReadUpdate } from "./reducer";
import { initialNotificationsState, notificationsReducer } from "./reducer";
const { Provider, useStore } = createFeatureStore(
  "Notifications",
  initialNotificationsState,
  notificationsReducer,
);
export const NotificationsProvider = Provider;
export function useNotifications() {
  const { state, dispatch } = useStore();
  return {
    ...state,
    setNotificationRead: (value: ReadUpdate) => dispatch({ type: "readChanged", value }),
  };
}
