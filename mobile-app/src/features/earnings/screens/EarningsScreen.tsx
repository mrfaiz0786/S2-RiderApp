import { useDelivery } from "@/features/delivery/model";
import { rupeesFromPaise } from "@/features/delivery/data/testScenario";
import { useNavigation } from "@/navigation/NavigationProvider";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Text } from "react-native";
export function EarningsScreen() {
  const { earnedPaise, codHeldPaise, completed, history } = useDelivery();
  const { navigate } = useNavigation();
  return (
    <>
      <ScreenHero
        eyebrow="SIMULATED EARNINGS"
        title="Your test earnings"
        subtitle="Calculated from completed simulator deliveries, not fixed sample totals."
        icon="wallet-outline"
      />
      <Card>
        <Text style={s.small}>ALL SAVED TEST DELIVERIES</Text>
        <Text style={s.amount}>{rupeesFromPaise(earnedPaise)}</Text>
        <Row label="Completed deliveries" value={String(completed)} />
        <Row
          label="Base pay"
          value={rupeesFromPaise(history.reduce((sum, item) => sum + item.order.basePayPaise, 0))}
        />
        <Row
          label="Distance pay"
          value={rupeesFromPaise(
            history.reduce((sum, item) => sum + item.order.distancePayPaise, 0),
          )}
        />
        <Row
          label="Test bonuses"
          value={rupeesFromPaise(history.reduce((sum, item) => sum + item.order.bonusPaise, 0))}
        />
        <Text style={s.small}>
          Simulation only. These earnings are not payable or withdrawable.
        </Text>
      </Card>
      <Card>
        <Text style={s.heading}>Customer cash is not your earnings</Text>
        <Row label="Simulated COD held" value={rupeesFromPaise(codHeldPaise)} />
        <Text style={s.body}>
          This is a separate practice cash balance. No real collection, remittance or settlement
          occurred.
        </Text>
      </Card>
      <BrandButton title="View test transactions" onPress={() => navigate("payouts")} />
      <BrandButton
        title="View completed deliveries"
        secondary
        onPress={() => navigate("history")}
      />
    </>
  );
}
