import { useDelivery } from "@/features/delivery/model";
import { rupeesFromPaise } from "@/features/delivery/data/testScenario";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { Card } from "@/shared/ui/Card";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Text } from "react-native";
export function PayoutsScreen() {
  const { history, earnedPaise, codHeldPaise } = useDelivery();
  return (
    <>
      <ScreenHero
        eyebrow="TEST TRANSACTIONS"
        title="Earnings and cash ledger"
        subtitle="One simulated earnings entry per completed delivery. No bank or payout API is used."
        icon="cash"
      />
      <Card>
        <Row label="Total test earnings" value={rupeesFromPaise(earnedPaise)} />
        <Row label="Simulated COD held" value={rupeesFromPaise(codHeldPaise)} />
        <Text style={s.body}>
          Withdrawals are unavailable in test mode. Customer cash is not added to rider income.
        </Text>
      </Card>
      {history.length === 0 ? (
        <Card>
          <Text style={s.body}>Finish a test delivery to see its earnings entry.</Text>
        </Card>
      ) : null}
      {history.map((receipt) => (
        <Card key={receipt.order.id}>
          <Text style={s.heading}>{receipt.order.id}</Text>
          <Text style={s.small}>{new Date(receipt.completedAt).toLocaleString()}</Text>
          <Row
            label="Rider earnings credit (test)"
            value={rupeesFromPaise(receipt.order.payoutPaise)}
          />
          <Row
            label="Customer cash collected (test)"
            value={rupeesFromPaise(receipt.codCollectedPaise)}
          />
          <Text style={s.small}>Reference: SIM-{receipt.order.id} · not a financial receipt</Text>
        </Card>
      ))}
    </>
  );
}
