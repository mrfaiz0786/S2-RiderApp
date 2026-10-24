import { RouteSimulation } from "@/features/delivery/components/RouteSimulation";
import { useDelivery } from "@/features/delivery/model";
import { rupeesFromPaise } from "@/features/delivery/data/testScenario";
import { useNavigation } from "@/navigation/NavigationProvider";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Text } from "react-native";
export function DeliveryNavigationScreen() {
  const { order, status, pickupDone } = useDelivery();
  const { navigate } = useNavigation();
  if (!order || !pickupDone)
    return (
      <Card>
        <Text style={s.body}>Verify the sample pickup before starting the drop route.</Text>
        <BrandButton title="Go to pickup" onPress={() => navigate("pickup")} />
      </Card>
    );
  return (
    <>
      <ScreenHero
        eyebrow="STEP 2 · DROP"
        title="Deliver the sample order"
        subtitle={order.drop.address}
        icon="navigation-variant-outline"
      />
      <RouteSimulation leg="drop" />
      <Card>
        <Text style={s.heading}>{order.drop.name}</Text>
        <Text style={s.body}>{order.drop.instructions}</Text>
        <Row
          label="Cash on delivery"
          value={
            order.paymentMethod === "cod"
              ? rupeesFromPaise(order.codPaise) + " · simulated"
              : "Prepaid · collect nothing"
          }
        />
        <BrandButton
          title={
            status === "completed"
              ? "View completed delivery"
              : status === "awaiting_payment"
                ? "Continue COD payment"
                : "Enter delivery OTP"
          }
          disabled={status === "picked_up"}
          onPress={() =>
            navigate(status === "awaiting_payment" ? "cod-payment" : "delivery-completion")
          }
        />
        {status === "picked_up" ? (
          <Text style={s.small}>Finish the simulated route before verifying the delivery OTP.</Text>
        ) : null}
      </Card>
    </>
  );
}
