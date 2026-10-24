import { useDelivery } from "@/features/delivery/model";
import { rupeesFromPaise } from "@/features/delivery/data/testScenario";
import { useNavigation } from "@/navigation/NavigationProvider";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { Field } from "@/shared/ui/Field";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { TestHint } from "@/shared/ui/TestHint";
import { useState } from "react";
import { Pressable, Text } from "react-native";
export function CodPaymentScreen() {
  const { order, status, confirmCod } = useDelivery();
  const { navigate } = useNavigation();
  const [amount, setAmount] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  if (!order || order.paymentMethod !== "cod" || status !== "awaiting_payment")
    return (
      <Card>
        <Text style={s.body}>
          {status === "completed"
            ? "Payment already recorded. This order cannot be charged again."
            : "Verify the delivery OTP for a COD test order first."}
        </Text>
        <BrandButton title="Return to delivery" onPress={() => navigate("delivery-completion")} />
      </Card>
    );
  return (
    <>
      <ScreenHero
        eyebrow="STEP 4 · TEST COD"
        title="Cash on delivery"
        subtitle="Practice cash collection. Do not take real money or make a transfer."
        icon="cash"
      />
      <Card>
        <Text style={s.heading}>{order.id}</Text>
        <Text style={s.body}>Amount to collect from the sample customer</Text>
        <Text style={s.amount}>{rupeesFromPaise(order.codPaise)}</Text>
        {order.items.map((item) => (
          <Row key={item.name} label={item.name} value={rupeesFromPaise(item.amountPaise)} />
        ))}
        <TestHint
          title={"Enter this amount: " + (order.codPaise / 100).toFixed(2)}
          detail="This customer cash is tracked separately from your ₹86 test earnings."
        />
        <Field
          label="Simulated cash received (rupees)"
          value={amount}
          onChangeText={(value) => {
            setAmount(value.replace(/[^\d.]/g, "").slice(0, 12));
            setError("");
          }}
          keyboardType="number-pad"
          placeholder="649.00"
          maxLength={12}
        />
        <BrandButton
          title="Fill exact test amount"
          secondary
          onPress={() => setAmount((order.codPaise / 100).toFixed(2))}
        />
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel="Confirm simulated cash collection"
          accessibilityState={{ checked: confirmed }}
          style={[s.pill, confirmed && s.selected]}
          onPress={() => setConfirmed((value) => !value)}
        >
          <Text style={s.body}>
            {confirmed ? "☑" : "☐"} I confirm simulated cash collection. No real money changed
            hands.
          </Text>
        </Pressable>
        {error ? (
          <Text accessibilityLiveRegion="polite" style={s.error}>
            {error}
          </Text>
        ) : null}
        <BrandButton
          title="Confirm test cash and mark delivered"
          onPress={() => {
            if (
              !/^\d+(\.\d{1,2})?$/.test(amount) ||
              Math.round(Number(amount) * 100) !== order.codPaise
            ) {
              setError("Enter the exact test COD amount: " + rupeesFromPaise(order.codPaise) + ".");
              return;
            }
            if (!confirmed) {
              setError("Confirm the simulated cash collection checkbox first.");
              return;
            }
            confirmCod(order.codPaise, true);
            navigate("delivery-completion");
          }}
        />
      </Card>
    </>
  );
}
