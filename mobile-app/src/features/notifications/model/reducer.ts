export type NotificationsState = { notificationRead: string[] };
export type ReadUpdate = string[] | ((previous: string[]) => string[]);
export type NotificationsAction = { type: "readChanged"; value: ReadUpdate };
export const initialNotificationsState: NotificationsState = { notificationRead: [] };
export function notificationsReducer(
  state: NotificationsState,
  action: NotificationsAction,
): NotificationsState {
  if (action.type !== "readChanged") return state;
  const value =
    typeof action.value === "function" ? action.value(state.notificationRead) : action.value;
  return { notificationRead: [...new Set(value)] };
}
