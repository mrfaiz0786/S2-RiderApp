import { useDelivery } from "@/features/delivery/model";
import type { DeliveryReceipt } from "@/features/delivery/model/reducer";
import { rupeesFromPaise } from "@/features/delivery/data/testScenario";
import { useNavigation } from "@/navigation/NavigationProvider";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { BrandSheet } from "@/shared/ui/BrandSheet";
import { Card } from "@/shared/ui/Card";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Tag } from "@/shared/ui/Tag";
import { useState } from "react";
import { Text, View } from "react-native";
export function HistoryScreen() {
  const { history, storageError } = useDelivery();
  const { navigate } = useNavigation();
  const [selected, setSelected] = useState<DeliveryReceipt | null>(null);
  return (
    <>
      <ScreenHero
        eyebrow="YOUR TEST DELIVERIES"
        title="Delivery history"
        subtitle="Only orders you actually finish in this simulator appear here. Saved locally on this device."
        icon="history"
      />
      {storageError ? <Text style={s.error}>{storageError}</Text> : null}
      <Text style={s.body}>
        {history.length} completed test {history.length === 1 ? "delivery" : "deliveries"}
      </Text>
      {history.length === 0 ? (
        <Card>
          <Text style={s.heading}>No completed deliveries yet</Text>
          <Text style={s.body}>
            Complete pickup, drop OTP and any COD confirmation to create your first receipt.
          </Text>
          <BrandButton title="Start a test delivery" onPress={() => navigate("home")} />
        </Card>
      ) : null}
      {history.map((receipt) => (
        <Card key={receipt.order.id}>
          <View style={s.row}>
            <Text style={s.heading}>{receipt.order.id}</Text>
            <Tag label="TEST DELIVERED" tone="green" />
          </View>
          <Text style={s.body}>
            {receipt.order.pickup.name} → {receipt.order.drop.name}
          </Text>
          <Text style={s.small}>
            {receipt.order.city} · {new Date(receipt.completedAt).toLocaleString()}
          </Text>
          <Row label="Rider earnings" value={rupeesFromPaise(receipt.order.payoutPaise)} />
          <Row
            label="Customer payment"
            value={
              receipt.order.paymentMethod === "cod" ? "COD collected (test)" : "Prepaid (test)"
            }
          />
          <Row
            label="Simulated cash collected"
            value={rupeesFromPaise(receipt.codCollectedPaise)}
          />
          <BrandButton
            title="View test receipt and timeline"
            secondary
            onPress={() => setSelected(receipt)}
          />
        </Card>
      ))}
      <BrandSheet
        visible={selected !== null}
        title={selected?.order.id || "Test receipt"}
        subtitle="Fictional delivery receipt. No real transaction occurred."
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <>
            <Text style={s.heading}>Pickup</Text>
            <Text style={s.body}>{selected.order.pickup.address}</Text>
            <Text style={s.heading}>Drop</Text>
            <Text style={s.body}>{selected.order.drop.address}</Text>
            <Row
              label="Customer order total"
              value={rupeesFromPaise(selected.order.customerTotalPaise)}
            />
            <Row label="Rider earnings" value={rupeesFromPaise(selected.order.payoutPaise)} />
            <Row label="Simulated COD" value={rupeesFromPaise(selected.codCollectedPaise)} />
            <Text style={s.heading}>Timeline</Text>
            {selected.events.map((event, index) => (
              <Text key={index} style={s.body}>
                {new Date(event.at).toLocaleTimeString()} · {event.type}
              </Text>
            ))}
          </>
        ) : null}
      </BrandSheet>
    </>
  );
}
