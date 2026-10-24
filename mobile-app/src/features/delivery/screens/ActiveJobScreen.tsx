import { OrderSummary } from "@/features/delivery/components/OrderSummary";
import { useDelivery } from "@/features/delivery/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Text } from "react-native";
export function ActiveJobScreen() {
  const { order, status, jobAccepted, pickupDone, events } = useDelivery();
  const { navigate } = useNavigation();
  if (!order || !jobAccepted)
    return (
      <Card>
        <Text style={s.body}>Accept an offer before starting a delivery.</Text>
        <BrandButton title="View offers" onPress={() => navigate("offers")} />
      </Card>
    );
  const target =
    status === "completed"
      ? "delivery-completion"
      : status === "awaiting_payment"
        ? "cod-payment"
        : pickupDone
          ? "delivery-navigation"
          : "pickup";
  return (
    <>
      <ScreenHero
        eyebrow="ACCEPTED TEST ORDER"
        title="Your delivery, step by step"
        subtitle="Move through the map simulation, verify handover, then finish payment where required."
        icon="package-variant-closed"
      />
      <Card>
        <Text style={s.heading}>{status.replace(/_/g, " ").toUpperCase()}</Text>
        <BrandButton
          title={
            status === "completed"
              ? "View receipt"
              : status === "awaiting_payment"
                ? "Continue to COD payment"
                : pickupDone
                  ? "Open drop map simulation"
                  : "Open pickup map simulation"
          }
          onPress={() => navigate(target)}
        />
      </Card>
      <OrderSummary order={order} />
      <Card>
        <Text style={s.heading}>Order timeline</Text>
        {events.map((event, index) => (
          <Text key={index} style={s.body}>
            {new Date(event.at).toLocaleTimeString()} · {event.type}
          </Text>
        ))}
      </Card>
    </>
  );
}
