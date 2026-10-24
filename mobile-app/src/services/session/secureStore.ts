import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { createTokenStore, type SecureStorage } from "./tokenStore";

async function assertNative() {
  if (Platform.OS === "web" || !(await SecureStore.isAvailableAsync())) {
    throw new Error("Persistent authenticated sessions require a supported native build.");
  }
}
const storage: SecureStorage = {
  async getItem(key) {
    await assertNative();
    return SecureStore.getItemAsync(key);
  },
  async setItem(key, value) {
    await assertNative();
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },
  async removeItem(key) {
    await assertNative();
    await SecureStore.deleteItemAsync(key);
  },
};
// Never put refresh tokens, identity documents or session objects in plain localStorage.
export const tokenStore = createTokenStore(storage);
