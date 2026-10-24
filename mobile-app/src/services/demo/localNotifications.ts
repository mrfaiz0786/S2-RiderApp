import { appConfig } from "@/config/app";
import { Platform } from "react-native";
const allowed = () => appConfig.dataMode === "mock" && appConfig.environment !== "production";
export async function enableTestNotifications(): Promise<{ ok: boolean; message: string }> {
  if (!allowed() || Platform.OS === "web")
    return {
      ok: false,
      message:
        "Use the in-app notification banner here. Local phone alerts require Android or iOS.",
    };
  try {
    const notifications = await import("expo-notifications");
    notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS === "android")
      await notifications.setNotificationChannelAsync("ybm-test-orders", {
        name: "YBM test orders",
        importance: notifications.AndroidImportance.HIGH,
      });
    let permission = await notifications.getPermissionsAsync();
    if (!permission.granted && permission.canAskAgain)
      permission = await notifications.requestPermissionsAsync();
    return permission.granted
      ? {
          ok: true,
          message: "Local test alerts enabled. No remote push token or server connection is used.",
        }
      : {
          ok: false,
          message:
            "Phone notification permission was not granted. In-app test order alerts still work.",
        };
  } catch {
    return {
      ok: false,
      message:
        "Phone alerts are unavailable in this build. Use the in-app banner or a native development build.",
    };
  }
}
export async function showTestOrderNotification(orderId: string): Promise<boolean> {
  if (!allowed() || Platform.OS === "web" || !/^YBM-TEST-\d+$/.test(orderId)) return false;
  try {
    const notifications = await import("expo-notifications");
    const permission = await notifications.getPermissionsAsync();
    if (!permission.granted) return false;
    await notifications.scheduleNotificationAsync({
      content: {
        title: "You have a test order",
        body: `${orderId} · Open YBM Rider to review pickup, drop and earnings. Simulation only.`,
        data: { kind: "ybm-test-order", orderId },
      },
      trigger: Platform.OS === "android" ? { channelId: "ybm-test-orders" } : null,
    });
    return true;
  } catch {
    return false;
  }
}
export async function subscribeToTestOrderTaps(
  onOpen: (orderId: string) => void,
): Promise<() => void> {
  if (!allowed() || Platform.OS === "web") return () => {};
  try {
    const notifications = await import("expo-notifications");
    const listener = notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (
        data?.kind === "ybm-test-order" &&
        typeof data.orderId === "string" &&
        /^YBM-TEST-\d+$/.test(data.orderId)
      )
        onOpen(data.orderId);
    });
    return () => listener.remove();
  } catch {
    return () => {};
  }
}
