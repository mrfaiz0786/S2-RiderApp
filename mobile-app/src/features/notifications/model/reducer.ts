export type NotificationsState = { notificationRead: string[]; deviceAlertsEnabled: boolean };
export type ReadUpdate = string[] | ((previous: string[]) => string[]);
export type NotificationsAction =
  { type: "readChanged"; value: ReadUpdate } | { type: "deviceAlertsChanged"; value: boolean };
export const initialNotificationsState: NotificationsState = {
  notificationRead: [],
  deviceAlertsEnabled: false,
};
export function notificationsReducer(
  state: NotificationsState,
  action: NotificationsAction,
): NotificationsState {
  if (action.type === "deviceAlertsChanged") return { ...state, deviceAlertsEnabled: action.value };
  if (action.type !== "readChanged") return state;
  const value =
    typeof action.value === "function" ? action.value(state.notificationRead) : action.value;
  return { ...state, notificationRead: [...new Set(value)] };
}
