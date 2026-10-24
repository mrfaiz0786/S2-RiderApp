import { useDelivery } from "@/features/delivery/model";
import { rupeesFromPaise, type PaymentMethod } from "@/features/delivery/data/testScenario";
import { useProfile } from "@/features/profile/model";
import { useNotifications } from "@/features/notifications/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { enableTestNotifications } from "@/services/demo/localNotifications";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { theme } from "@/shared/theme";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { Row } from "@/shared/ui/Row";
import { TestHint } from "@/shared/ui/TestHint";
import { useEffect, useRef, useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
export function HomeScreen() {
  const delivery = useDelivery();
  const { name } = useProfile();
  const { navigate } = useNavigation();
  const { deviceAlertsEnabled, setDeviceAlertsEnabled } = useNotifications();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [notificationNotice, setNotificationNotice] = useState("");
  const [enabling, setEnabling] = useState(false);
  const createOffer = useRef(delivery.createOffer);
  createOffer.current = delivery.createOffer;
  const { online, status, order, earnedPaise, codHeldPaise, completed, canTest, hydrated } =
    delivery;
  useEffect(() => {
    if (!online || !canTest || status !== "idle") return;
    const timer = setTimeout(() => createOffer.current(paymentMethod), 1800);
    return () => clearTimeout(timer);
  }, [online, canTest, status, paymentMethod]);
  const canRequest = ["idle", "declined", "expired", "completed"].includes(status);
  return (
    <>
      <View style={s.hero}>
        <Text style={s.heroText}>Hello, {name.split(" ")[0] || "Test Rider"}!</Text>
        <Text style={s.heroBody}>TEST RIDER · SAMPLE VERIFIED</Text>
        <View style={s.row}>
          <Text style={s.heroBody}>{online ? "Online for test orders" : "Offline"}</Text>
          <Switch
            accessibilityLabel="Go online for test orders"
            value={online}
            disabled={!canTest}
            onValueChange={delivery.setOnline}
            trackColor={{ false: theme.colors.muted, true: theme.colors.accent }}
          />
        </View>
      </View>
      <TestHint
        title="Your complete test delivery journey"
        detail="Go online, receive an order, accept it, play pickup/drop routes, verify OTPs, complete COD if required, and see history update."
      />
      {!hydrated ? <Text style={s.body}>Restoring local test delivery history...</Text> : null}
      {delivery.storageError ? (
        <Text accessibilityLiveRegion="polite" style={s.error}>
          {delivery.storageError}
        </Text>
      ) : null}
      <Card>
        <Row label="Completed test deliveries" value={String(completed)} />
        <Row label="Test rider earnings" value={rupeesFromPaise(earnedPaise)} />
        <Row label="Simulated customer cash held" value={rupeesFromPaise(codHeldPaise)} />
        <Text style={s.small}>
          Customer cash is separate from rider earnings. No amount is withdrawable.
        </Text>
      </Card>
      {order && !canRequest ? (
        <Card>
          <Text style={s.heading}>
            {status === "offered" ? "You have a test order" : "Continue your test delivery"}
          </Text>
          <Text style={s.body}>
            {order.id} · {order.paymentMethod.toUpperCase()}
          </Text>
          <Text style={s.body}>
            {order.pickup.name} → {order.drop.name}
          </Text>
          <Row label="Your test earnings" value={rupeesFromPaise(order.payoutPaise)} />
          <BrandButton
            title={status === "offered" ? "View order details" : "Resume active delivery"}
            onPress={() => navigate(status === "offered" ? "offers" : "active-job")}
          />
        </Card>
      ) : (
        <Card>
          <Text style={s.heading}>
            {status === "completed" ? "Ready for another test?" : "Choose your test order"}
          </Text>
          <View style={s.row}>
            {(["cod", "prepaid"] as PaymentMethod[]).map((method) => (
              <Pressable
                key={method}
                accessibilityRole="radio"
                accessibilityState={{ checked: paymentMethod === method }}
                onPress={() => setPaymentMethod(method)}
                style={[s.pill, paymentMethod === method && s.selected]}
              >
                <Text style={s.heading}>{method === "cod" ? "Cash on delivery" : "Prepaid"}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={s.body}>
            {!online
              ? "Go online to receive an order."
              : status === "idle"
                ? "A sample order will arrive shortly. The in-app notification works without phone permissions."
                : "Request another sample order to repeat the journey."}
          </Text>
          <BrandButton
            title={status === "completed" ? "Send next test order" : "Send test order now"}
            disabled={!online || !canTest}
            onPress={() => delivery.createOffer(paymentMethod)}
          />
        </Card>
      )}
      <Card>
        <Text style={s.heading}>Device test notifications</Text>
        <Text style={s.body}>
          In-app order alerts always work. Optionally allow local phone notifications; this does not
          connect Firebase or a backend.
        </Text>
        <BrandButton
          title={deviceAlertsEnabled ? "Device test alerts enabled" : "Enable device test alerts"}
          secondary
          disabled={deviceAlertsEnabled || enabling}
          loading={enabling}
          onPress={() => {
            setEnabling(true);
            void enableTestNotifications()
              .then((result) => {
                setDeviceAlertsEnabled(result.ok);
                setNotificationNotice(result.message);
              })
              .finally(() => setEnabling(false));
          }}
        />
        {notificationNotice ? (
          <Text accessibilityLiveRegion="polite" style={s.small}>
            {notificationNotice}
          </Text>
        ) : null}
      </Card>
      <BrandButton title="Open delivery history" onPress={() => navigate("history")} />
      <BrandButton title="Open notifications" secondary onPress={() => navigate("notifications")} />
    </>
  );
}
