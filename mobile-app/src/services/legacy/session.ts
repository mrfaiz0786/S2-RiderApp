import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import {
  createEphemeralSessionStorage,
  createLegacySessionStore,
  type LegacySecureStorage,
} from "./sessionModel";
export { decodeLegacySession, fromLogin } from "./sessionModel";
export type { LegacySession } from "./sessionModel";
const native: LegacySecureStorage = {
  async getItem(key) {
    await ensureNative();
    return SecureStore.getItemAsync(key);
  },
  async setItem(key, value) {
    await ensureNative();
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },
  async removeItem(key) {
    await ensureNative();
    await SecureStore.deleteItemAsync(key);
  },
};
async function ensureNative() {
  if (Platform.OS === "web" || !(await SecureStore.isAvailableAsync())) {
    throw new Error(
      "Live login needs native device secure storage. Use Expo Go or a development build.",
    );
  }
}
// Staging web: memory only, automatically lost when the tab reloads.
export const legacySessionStore = createLegacySessionStore(
  Platform.OS === "web" ? createEphemeralSessionStorage() : native,
);
