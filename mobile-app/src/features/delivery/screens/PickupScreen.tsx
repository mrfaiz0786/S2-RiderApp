import { RouteSimulation } from "@/features/delivery/components/RouteSimulation";
import { useDelivery } from "@/features/delivery/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { demoConfig } from "@/services/demo/credentials";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { Field } from "@/shared/ui/Field";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { TestHint } from "@/shared/ui/TestHint";
import { useState } from "react";
import { Text } from "react-native";
export function PickupScreen() {
  const { order, status, pickupDone, confirmPickup, jobAccepted } = useDelivery();
  const { navigate } = useNavigation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  if (!order || !jobAccepted)
    return (
      <Card>
        <Text style={s.body}>Accept a test order first.</Text>
        <BrandButton title="View offers" onPress={() => navigate("offers")} />
      </Card>
    );
  return (
    <>
      <ScreenHero
        eyebrow="STEP 1 · PICKUP"
        title="Collect the sample order"
        subtitle={order.pickup.address}
        icon="map-marker-outline"
      />
      <RouteSimulation leg="pickup" />
      <Card>
        <Text style={s.heading}>{order.pickup.name}</Text>
        <Text style={s.body}>{order.pickup.instructions}</Text>
        <Text style={s.body}>
          Order {order.id} · {order.items.length} sealed sample items
        </Text>
        {pickupDone ? (
          <>
            <Text style={s.success}>Sample pickup verified.</Text>
            <BrandButton
              title="Continue to drop map"
              onPress={() => navigate("delivery-navigation")}
            />
          </>
        ) : (
          <>
            <TestHint
              title={"Enter this pickup PIN: " + demoConfig.pickupPin}
              detail="Reach the sample pickup using playback, step or jump controls first."
            />
            <Field
              label="Test pickup PIN"
              value={code}
              onChangeText={(value) => {
                setCode(value.replace(/\D/g, "").slice(0, 6));
                setError("");
              }}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="112233"
            />
            {error ? (
              <Text accessibilityLiveRegion="polite" style={s.error}>
                {error}
              </Text>
            ) : null}
            <BrandButton
              title="Verify pickup and collect order"
              disabled={status !== "at_pickup"}
              onPress={() => {
                if (code !== demoConfig.pickupPin) {
                  setError("Incorrect pickup PIN. Enter " + demoConfig.pickupPin + ".");
                  return;
                }
                confirmPickup(code);
                setCode("");
                navigate("delivery-navigation");
              }}
            />
            <BrandButton
              title="Fill pickup PIN"
              secondary
              onPress={() => setCode(demoConfig.pickupPin)}
            />
          </>
        )}
      </Card>
    </>
  );
}
