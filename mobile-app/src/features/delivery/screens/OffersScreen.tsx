import { OrderSummary } from "@/features/delivery/components/OrderSummary";
import { useDelivery } from "@/features/delivery/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { useEffect, useState } from "react";
import { Text } from "react-native";
export function OffersScreen() {
  const { order, status, online, acceptOffer, declineOffer, jobAccepted } = useDelivery();
  const { navigate } = useNavigation();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const seconds = order ? Math.max(0, Math.ceil((order.expiresAt - now) / 1000)) : 0;
  return (
    <>
      <ScreenHero
        eyebrow="TEST DELIVERY OFFER"
        title={status === "offered" ? "You have an order" : "Delivery offers"}
        subtitle="Review pickup, drop, cash and your earnings before accepting."
        icon="package-variant-closed"
      />
      {order ? (
        <OrderSummary order={order} />
      ) : (
        <Card>
          <Text style={s.body}>Go online on Home to receive your first test order.</Text>
        </Card>
      )}
      {status === "offered" ? (
        <Card>
          <Text accessibilityLiveRegion="polite" style={seconds > 0 ? s.heading : s.error}>
            {seconds > 0
              ? `Offer expires in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
              : "This test offer has expired."}
          </Text>
          {!online ? <Text style={s.error}>Go online again before accepting.</Text> : null}
          <BrandButton
            title="Accept test order"
            disabled={!online || seconds === 0}
            onPress={() => {
              acceptOffer();
              navigate("active-job");
            }}
          />
          <BrandButton
            title="Decline test order"
            secondary
            onPress={() => {
              declineOffer();
              navigate("home");
            }}
          />
        </Card>
      ) : jobAccepted ? (
        <BrandButton
          title={status === "completed" ? "View delivery receipt" : "Resume accepted order"}
          onPress={() => navigate(status === "completed" ? "delivery-completion" : "active-job")}
        />
      ) : (
        <Card>
          <Text style={s.body}>
            {status === "expired"
              ? "Offer expired. Create another test offer from Home."
              : status === "declined"
                ? "Offer declined. No delivery or earnings were created."
                : "No pending offers."}
          </Text>
        </Card>
      )}
      <BrandButton title="Back to home" secondary onPress={() => navigate("home")} />
    </>
  );
}
