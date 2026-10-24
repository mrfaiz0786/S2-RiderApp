import { useDelivery } from "@/features/delivery/model";
import { rupeesFromPaise } from "@/features/delivery/data/testScenario";
import { useNavigation } from "@/navigation/NavigationProvider";
import { demoConfig } from "@/services/demo/credentials";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { Field } from "@/shared/ui/Field";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { TestHint } from "@/shared/ui/TestHint";
import { useState } from "react";
import { Text } from "react-native";
export function DeliveryCompletionScreen() {
  const { order, status, verifyDelivery, history } = useDelivery();
  const { navigate } = useNavigation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  if (!order)
    return (
      <Card>
        <Text style={s.body}>There is no active test order.</Text>
        <BrandButton title="Go home" onPress={() => navigate("home")} />
      </Card>
    );
  const receipt = history.find((item) => item.order.id === order.id);
  const completed = status === "completed" && Boolean(receipt);
  return (
    <>
      <ScreenHero
        eyebrow={completed ? "TEST DELIVERY COMPLETE" : "STEP 3 · HANDOVER"}
        title={completed ? "Delivered successfully" : "Enter this delivery OTP"}
        subtitle={
          completed
            ? "Your simulated receipt, history and earnings have been updated."
            : "Verify the sample recipient code after reaching the drop."
        }
        icon="check-circle-outline"
      />
      {completed ? (
        <Card>
          <Text style={s.heading}>{order.id}</Text>
          <Text style={s.success}>DELIVERED · SIMULATION</Text>
          <Row label="Test rider earnings" value={rupeesFromPaise(order.payoutPaise)} />
          <Row
            label="Payment"
            value={
              order.paymentMethod === "cod" ? "Simulated cash collected" : "Test order prepaid"
            }
          />
          <Row label="Customer amount" value={rupeesFromPaise(order.customerTotalPaise)} />
          <Text style={s.body}>
            {receipt ? new Date(receipt.completedAt).toLocaleString() : ""}
          </Text>
          <Text style={s.small}>
            No real delivery, transfer, cash collection or payout occurred.
          </Text>
          <BrandButton title="View this delivery in history" onPress={() => navigate("history")} />
          <BrandButton title="View test earnings" secondary onPress={() => navigate("earnings")} />
          <BrandButton title="Back to rider home" secondary onPress={() => navigate("home")} />
        </Card>
      ) : status === "awaiting_payment" ? (
        <Card>
          <Text style={s.success}>Sample OTP verified. COD confirmation is still required.</Text>
          <BrandButton title="Continue to COD payment" onPress={() => navigate("cod-payment")} />
        </Card>
      ) : (
        <Card>
          <Text style={s.heading}>
            {order.drop.name} · {order.id}
          </Text>
          <Text style={s.body}>{order.drop.address}</Text>
          <TestHint
            title={"Enter this OTP: " + demoConfig.deliveryPin}
            detail="Public test code only. Real recipient OTPs must come from the backend and must not be shown to riders."
          />
          <Field
            label="Test delivery OTP"
            value={code}
            onChangeText={(value) => {
              setCode(value.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            placeholder="654321"
            keyboardType="number-pad"
            maxLength={6}
          />
          {error ? (
            <Text accessibilityLiveRegion="polite" style={s.error}>
              {error}
            </Text>
          ) : null}
          <BrandButton
            title={
              order.paymentMethod === "cod"
                ? "Verify OTP and open COD payment"
                : "Verify OTP and finish prepaid delivery"
            }
            disabled={status !== "at_dropoff"}
            onPress={() => {
              if (code !== demoConfig.deliveryPin) {
                setError("Incorrect delivery OTP. Enter " + demoConfig.deliveryPin + ".");
                return;
              }
              verifyDelivery(code);
              setCode("");
              if (order.paymentMethod === "cod") navigate("cod-payment");
            }}
          />
          <BrandButton
            title="Fill delivery OTP"
            secondary
            onPress={() => setCode(demoConfig.deliveryPin)}
          />
          {status !== "at_dropoff" ? (
            <>
              <Text style={s.error}>Complete the pickup and simulated drop route first.</Text>
              <BrandButton
                title="Return to drop route"
                secondary
                onPress={() => navigate("delivery-navigation")}
              />
            </>
          ) : null}
        </Card>
      )}
    </>
  );
}
