import { appConfig } from "@/config/app";
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { apiFailure, type ApiResult } from "../api/types";

export type NativePushToken = {
  token: string;
  platform: "android" | "ios";
  provider: "fcm" | "apns";
};

/** Receives device credentials only. Sending pushes belongs to the backend team. */
export async function requestNativePushToken(): Promise<ApiResult<NativePushToken>> {
  if (appConfig.configurationError || appConfig.dataMode !== "api" || !appConfig.pushEnabled) {
    return apiFailure(
      "NOT_CONFIGURED",
      "Push is disabled until the native app and backend device API are ready.",
    );
  }
  if (
    (Platform.OS !== "android" && Platform.OS !== "ios") ||
    !Device.isDevice ||
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient
  ) {
    return apiFailure(
      "NOT_CONFIGURED",
      "Use a physical device with a native development or release build.",
    );
  }
  try {
    const notifications = await import("expo-notifications");
    if (Platform.OS === "android") {
      await notifications.setNotificationChannelAsync("deliveries", {
        name: "Delivery updates",
        importance: notifications.AndroidImportance.HIGH,
      });
    }
    let permission = await notifications.getPermissionsAsync();
    if (!permission.granted && permission.canAskAgain)
      permission = await notifications.requestPermissionsAsync();
    if (!permission.granted)
      return apiFailure(
        "FORBIDDEN",
        "Enable notifications in system settings to receive delivery alerts.",
      );
    const native = await notifications.getDevicePushTokenAsync();
    if (typeof native.data !== "string" || !native.data)
      return apiFailure("INVALID_RESPONSE", "A device token was not returned.");
    return {
      ok: true,
      data: {
        token: native.data,
        platform: Platform.OS,
        provider: Platform.OS === "android" ? "fcm" : "apns",
      },
    };
  } catch {
    return apiFailure("NETWORK", "Device registration failed. Check native push configuration.");
  }
}
