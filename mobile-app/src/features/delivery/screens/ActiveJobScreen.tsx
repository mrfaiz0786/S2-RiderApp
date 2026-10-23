import { sampleJobs } from "@/features/delivery/data/fixtures";
import { useDelivery } from "@/features/delivery/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { money } from "@/shared/lib/money";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import { BrandButton as Button } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { DetailStrip } from "@/shared/ui/DetailStrip";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Tag } from "@/shared/ui/Tag";
import { Text, View } from "react-native";

export function ActiveJobScreen() {
  const { pickupDone } = useDelivery();
  const { navigate: go } = useNavigation();
  return (
    <>
      <ScreenHero
        eyebrow={"ACTIVE DELIVERY"}
        title={"Active job details"}
        subtitle={"Follow the pickup and drop-off steps in order."}
        icon="package-variant-closed"
      />
      <DetailStrip
        icon="package-variant-closed"
        title={pickupDone ? "Pickup confirmed" : "Next step: pickup"}
        description={
          pickupDone
            ? "Continue to the delivery route preview."
            : "Check the collection point and confirm the handover before delivery."
        }
        tone={pickupDone ? "green" : "blue"}
      />
      <Card>
        <View style={styles.rowBetween}>
          <View style={styles.flexOne}>
            <Text style={styles.eyebrow}>JOB REFERENCE</Text>
            <Text style={styles.cardTitle}>{sampleJobs[0].id}</Text>
          </View>
          <Tag
            label={pickupDone ? "PICKUP COMPLETE" : "ACCEPTED"}
            tone={pickupDone ? "green" : "blue"}
          />
        </View>
        <View style={styles.divider} />
        <Text style={styles.fieldLabel}>DELIVERY PROGRESS</Text>
        <View style={styles.timeline}>
          <View style={[styles.timelineDot, { backgroundColor: pickupDone ? C.green : C.blue }]} />
          <View style={styles.flexOne}>
            <Text style={styles.bodyStrong}>1. Pickup</Text>
            <Text style={styles.bodyMuted}>{sampleJobs[0].pickup}</Text>
            <Text style={styles.helper}>
              {pickupDone ? "Demo pickup step marked complete" : "Awaiting pickup confirmation"}
            </Text>
          </View>
          <Tag label={pickupDone ? "DONE" : "NEXT"} tone={pickupDone ? "green" : "amber"} />
        </View>
        <View style={styles.timeline}>
          <View
            style={[styles.timelineDot, { backgroundColor: pickupDone ? C.blue : "#D4D4D0" }]}
          />
          <View style={styles.flexOne}>
            <Text style={styles.bodyStrong}>2. Delivery</Text>
            <Text style={styles.bodyMuted}>{sampleJobs[0].drop}</Text>
            <Text style={styles.helper}>
              {pickupDone ? "Continue to the delivery route" : "Available after pickup step"}
            </Text>
          </View>
          <Tag label={pickupDone ? "READY" : "UP NEXT"} tone={pickupDone ? "blue" : "grey"} />
        </View>
        <View style={styles.divider} />
        <Row label="Estimated route" value={sampleJobs[0].distance} />
        <Row label="Estimated task time" value={sampleJobs[0].eta} />
        <Row label="Illustrative payout" value={money(sampleJobs[0].payout)} />
        <Button
          title={pickupDone ? "Continue to navigation →" : "Confirm pickup →"}
          onPress={() => go(pickupDone ? "delivery-navigation" : "pickup")}
        />
        <Button title="Contact support" secondary onPress={() => go("support")} />
      </Card>
      <Text style={styles.helper}>
        Locations, route estimates, payout and progress are sample data. This screen does not track
        a real rider or verify a real pickup.
      </Text>
    </>
  );
}
const styles = createBrandedStyles({
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginVertical: 6,
  },
  flexOne: { flex: 1 },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: C.blue,
    marginBottom: 7,
    marginTop: 2,
  },
  cardTitle: {
    fontFamily: theme.typography.family.bold,
    fontSize: 16,
    fontWeight: "700",
    color: C.ink,
    marginBottom: 2,
  },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 7 },
  fieldLabel: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginBottom: 7,
  },
  timeline: { flexDirection: "row", gap: 12, marginVertical: 12 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.green, marginTop: 3 },
  bodyStrong: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 14,
    fontWeight: "600",
    color: C.ink,
  },
  bodyMuted: {
    fontFamily: theme.typography.family.regular,
    fontSize: 13,
    lineHeight: 20,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
  helper: {
    fontFamily: theme.typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
});
