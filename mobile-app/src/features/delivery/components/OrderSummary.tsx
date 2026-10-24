import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { Card } from "@/shared/ui/Card";
import { Row } from "@/shared/ui/Row";
import { Tag } from "@/shared/ui/Tag";
import { Text, View } from "react-native";
import { rupeesFromPaise, type TestOrder } from "../data/testScenario";
import { routeDistanceMeters } from "../model/mapGeometry";
export function OrderSummary({ order, full = true }: { order: TestOrder; full?: boolean }) {
  return (
    <Card>
      <View style={s.row}>
        <Text style={s.heading}>{order.id}</Text>
        <Tag
          label={order.paymentMethod === "cod" ? "TEST COD" : "TEST PREPAID"}
          tone={order.paymentMethod === "cod" ? "amber" : "green"}
        />
      </View>
      <Text style={s.small}>PICK UP FROM</Text>
      <Text style={s.heading}>{order.pickup.name}</Text>
      <Text style={s.body}>{order.pickup.address}</Text>
      {full ? (
        <Text style={s.small}>
          {order.pickup.contact} · {order.pickup.instructions}
        </Text>
      ) : null}
      <View style={s.divider} />
      <Text style={s.small}>DROP TO</Text>
      <Text style={s.heading}>{order.drop.name}</Text>
      <Text style={s.body}>{order.drop.address}</Text>
      {full ? (
        <Text style={s.small}>
          {order.drop.contact} · {order.drop.instructions}
        </Text>
      ) : null}
      <Row
        label="Scripted pickup + drop path"
        value={
          (
            (routeDistanceMeters(order.pickupRoute) + routeDistanceMeters(order.dropRoute)) /
            1000
          ).toFixed(2) + " km"
        }
      />
      <Row label="Illustrative task time" value={order.estimatedMinutes + " min (not live ETA)"} />
      <Row label="Your test earnings" value={rupeesFromPaise(order.payoutPaise)} />
      <Row label="Customer order total" value={rupeesFromPaise(order.customerTotalPaise)} />
      <Row
        label="Cash to collect"
        value={order.paymentMethod === "cod" ? rupeesFromPaise(order.codPaise) : "None · prepaid"}
      />
      {full ? (
        <>
          <View style={s.divider} />
          <Text style={s.heading}>Sample order items</Text>
          {order.items.map((item) => (
            <Row
              key={item.name}
              label={`${item.quantity} × ${item.name}`}
              value={rupeesFromPaise(item.amountPaise)}
            />
          ))}
          <View style={s.divider} />
          <Text style={s.heading}>Rider payout breakdown</Text>
          <Row label="Base pay" value={rupeesFromPaise(order.basePayPaise)} />
          <Row label="Distance component" value={rupeesFromPaise(order.distancePayPaise)} />
          <Row label="Test bonus" value={rupeesFromPaise(order.bonusPaise)} />
        </>
      ) : null}
      <Text style={s.small}>
        All order, recipient, cash and earnings details are fictional. Customer cash is not rider
        income.
      </Text>
    </Card>
  );
}
