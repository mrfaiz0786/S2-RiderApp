import { useDelivery } from "@/features/delivery/model";
import { rupeesFromPaise } from "@/features/delivery/data/testScenario";
import { useNotifications } from "@/features/notifications/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import {
  showTestOrderNotification,
  subscribeToTestOrderTaps,
} from "@/services/demo/localNotifications";
import { theme } from "@/shared/theme";
import { useEffect, useRef } from "react";
import { AppState, Pressable, StyleSheet, Text } from "react-native";
export function TestOrderAlerts() {
  const delivery = useDelivery();
  const { order, status, canTest } = delivery;
  const { deviceAlertsEnabled, setNotificationRead } = useNotifications();
  const { route, navigate } = useNavigation();
  const latest = useRef({ delivery, navigate });
  latest.current = { delivery, navigate };
  const notified = useRef(new Set<string>());
  useEffect(() => {
    if (!order || status !== "offered") return;
    const timer = setTimeout(
      () => latest.current.delivery.expireOffer(),
      Math.max(0, order.expiresAt - Date.now()) + 50,
    );
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") latest.current.delivery.expireOffer();
    });
    return () => {
      clearTimeout(timer);
      listener.remove();
    };
  }, [order?.id, order?.expiresAt, status]);
  useEffect(() => {
    if (
      !canTest ||
      !order ||
      status !== "offered" ||
      !deviceAlertsEnabled ||
      notified.current.has(order.id)
    )
      return;
    notified.current.add(order.id);
    void showTestOrderNotification(order.id);
  }, [canTest, order?.id, status, deviceAlertsEnabled]);
  useEffect(() => {
    if (!deviceAlertsEnabled) return;
    let cancelled = false;
    let stop: (() => void) | undefined;
    void subscribeToTestOrderTaps((orderId) => {
      const current = latest.current;
      if (!current.delivery.canTest || current.delivery.order?.id !== orderId) return;
      current.navigate(
        current.delivery.status === "offered"
          ? "offers"
          : ["expired", "declined"].includes(current.delivery.status)
            ? "home"
            : current.delivery.status === "completed"
              ? "history"
              : "active-job",
      );
    }).then((cleanup) => {
      if (cancelled) cleanup();
      else stop = cleanup;
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [deviceAlertsEnabled]);
  if (!canTest || !order || status !== "offered" || route === "offers") return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="You have a test order. Open order details."
      onPress={() => {
        setNotificationRead((previous) => [...previous, order.id + "-offer"]);
        navigate("offers");
      }}
      style={styles.banner}
    >
      <Text accessibilityLiveRegion="polite" style={styles.title}>
        You have a test order · {rupeesFromPaise(order.payoutPaise)} earnings
      </Text>
      <Text style={styles.detail}>
        {order.id} · {order.paymentMethod.toUpperCase()} · Tap for pickup and drop details
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginBottom: 6,
    padding: 14,
    borderRadius: 16,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  title: { color: theme.colors.primary, fontFamily: theme.typography.family.bold, fontSize: 15 },
  detail: { color: theme.colors.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 4 },
});
