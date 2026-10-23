import { sampleJobs } from "@/features/delivery/data/fixtures";
import { money } from "@/shared/lib/money";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon } from "@/shared/ui/AppIcon";
import { RoutePoint } from "@/shared/ui/RoutePoint";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Text, TouchableOpacity, View } from "react-native";
const C = theme.colors;
const order = sampleJobs[0];
export function DeliveryOffersView({
  jobAccepted,
  onDecline,
}: {
  jobAccepted: boolean;
  onDecline: () => void;
}) {
  return (
    <>
      <Text style={styles.eyebrow}>NEW WORK · DEMO PREVIEW</Text>
      <Text style={styles.screenTitle}>Delivery offers</Text>
      <Text style={styles.screenSubtitle}>Everything you need to know before accepting.</Text>

      <View style={styles.payoutHero}>
        <View style={styles.cardTopRow}>
          <View style={styles.payoutIcon}>
            <AppIcon name="bike" size={22} color={C.primary} />
          </View>
          <StatusPill
            label={jobAccepted ? "ACCEPTED" : "NEW OFFER"}
            tone={jobAccepted ? "green" : "blue"}
          />
        </View>
        <Text style={styles.payoutLabel}>ESTIMATED PAYOUT</Text>
        <Text style={styles.payoutAmount}>{money(order.payout)}</Text>
        <Text style={styles.payoutNote}>Sample amount · not payable</Text>
      </View>

      <View style={styles.overviewMetrics}>
        <View style={styles.overviewMetric}>
          <AppIcon name="map-marker-outline" size={22} color={C.primary} />
          <View>
            <Text style={styles.label}>DISTANCE</Text>
            <Text style={styles.overviewNumber}>{order.distance}</Text>
          </View>
        </View>
        <View style={styles.overviewMetric}>
          <AppIcon name="clock-outline" size={22} color={C.primary} />
          <View>
            <Text style={styles.label}>ESTIMATED TIME</Text>
            <Text style={styles.overviewNumber}>{order.eta}</Text>
          </View>
        </View>
      </View>

      <SectionTitle>Your route</SectionTitle>
      <View style={styles.card}>
        <View style={styles.routeTrack}>
          <RoutePoint
            type="PICKUP LOCATION"
            address={order.pickup}
            color={C.success}
            note="Collection point · sample location"
          />
          <View style={styles.routeLine} />
          <RoutePoint
            type="DELIVERY LOCATION"
            address={order.drop}
            note="Recipient address · sample location"
          />
        </View>
        <View style={styles.subtleRule} />
        <View style={styles.cardTopRow}>
          <Text style={styles.secondaryText}>Order reference</Text>
          <Text style={styles.jobId}>{order.id}</Text>
        </View>
      </View>

      <SectionTitle>Before you accept</SectionTitle>
      <View style={styles.hintCard}>
        <View style={styles.hintIcon}>
          <AppIcon name="shield-check-outline" size={22} color={C.primary} />
        </View>
        <View style={styles.flexOne}>
          <Text style={styles.hintTitle}>Confirm package details at pickup</Text>
          <Text style={styles.hintDescription}>
            Check item count, packaging and handling instructions with the merchant before leaving.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        disabled={jobAccepted}
        accessibilityState={{ disabled: jobAccepted }}
        onPress={onDecline}
        accessibilityRole="button"
        style={styles.declineButton}
      >
        <Text style={styles.declineText}>Decline this offer</Text>
      </TouchableOpacity>
      <Text style={styles.disclaimer}>
        This offer is fictional. No automatic countdown, real dispatch or live payout calculation is
        active.
      </Text>
    </>
  );
}
const styles = createBrandedStyles({
  eyebrow: {
    color: C.primary,
    fontSize: 11,
    fontFamily: theme.typography.family.bold,
    letterSpacing: 1.1,
    marginBottom: 7,
  },
  screenTitle: {
    color: C.text,
    fontSize: 27,
    lineHeight: 33,
    fontFamily: theme.typography.family.bold,
    letterSpacing: -0.6,
  },
  screenSubtitle: { color: C.muted, fontSize: 14, lineHeight: 21, marginTop: 4, marginBottom: 16 },
  payoutHero: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#F1DFC3",
    backgroundColor: theme.colors.accentSoft,
    padding: 22,
    marginBottom: 18,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  payoutIcon: {
    height: 42,
    width: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.surface,
  },
  payoutLabel: {
    color: C.primaryDeep,
    fontSize: 11,
    fontFamily: theme.typography.family.bold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  payoutAmount: {
    fontFamily: theme.typography.family.extraBold,
    color: theme.colors.primary,
    fontSize: 43,
    lineHeight: 46,
    letterSpacing: -1.2,
    fontWeight: "800",
    marginTop: 7,
  },
  payoutNote: { fontSize: 12, color: C.muted, marginTop: 4 },
  overviewMetrics: { flexDirection: "row", gap: 10, marginBottom: 7 },
  overviewMetric: {
    flex: 1,
    minWidth: 0,
    backgroundColor: C.surface,
    borderRadius: 14,
    borderColor: C.border,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  label: {
    color: C.muted,
    fontSize: 11,
    fontFamily: theme.typography.family.semibold,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  overviewNumber: { color: C.text, fontFamily: theme.typography.family.bold, fontSize: 17 },
  card: {
    backgroundColor: theme.colors.surface,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 22,
    marginBottom: 14,
  },
  routeTrack: { marginTop: 1 },
  routeLine: {
    backgroundColor: C.borderStrong,
    height: 25,
    width: 2,
    marginLeft: 5.5,
    marginVertical: 3,
  },
  subtleRule: { height: 1, backgroundColor: C.border, marginTop: 16, marginBottom: 14 },
  secondaryText: { color: C.muted, fontSize: 12 },
  jobId: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 13,
    color: C.text,
    flexShrink: 1,
  },
  hintCard: {
    backgroundColor: C.primarySoft,
    padding: 14,
    borderRadius: 15,
    flexDirection: "row",
    gap: 11,
  },
  hintIcon: {
    height: 40,
    width: 40,
    borderRadius: 12,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  flexOne: { flex: 1, minWidth: 0 },
  hintTitle: {
    fontFamily: theme.typography.family.bold,
    fontSize: 14,
    color: C.text,
    marginBottom: 5,
  },
  hintDescription: { color: C.textSecondary, fontSize: 12, lineHeight: 18 },
  declineButton: { alignItems: "center", justifyContent: "center", minHeight: 48, marginTop: 8 },
  declineText: {
    fontSize: 14,
    fontFamily: theme.typography.family.semibold,
    color: C.textSecondary,
  },
  disclaimer: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 10, marginBottom: 6 },
});
