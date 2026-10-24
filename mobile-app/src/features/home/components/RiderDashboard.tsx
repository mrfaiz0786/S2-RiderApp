import { sampleJobs } from "@/features/delivery/data/fixtures";
import type { RouteName } from "@/navigation/routes";
import { money } from "@/shared/lib/money";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandButton } from "@/shared/ui/BrandButton";
import { BrandMark } from "@/shared/ui/BrandMark";
import { RoutePoint } from "@/shared/ui/RoutePoint";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Switch, Text, View } from "react-native";
const C = theme.colors;
const order = sampleJobs[0];
export function RiderDashboard({
  name,
  online,
  jobAccepted,
  pickupDone,
  deliveryDone,
  demoNotice,
  onToggleOnline,
  onNavigate,
}: {
  name: string;
  online: boolean;
  jobAccepted: boolean;
  pickupDone: boolean;
  deliveryDone: boolean;
  demoNotice: string;
  onToggleOnline: (value: boolean) => void;
  onNavigate: (screenId: RouteName) => void;
}) {
  const nextStep = !jobAccepted
    ? {
        number: 1,
        title: "Choose an order",
        detail: "Review an available delivery offer",
        route: "offers" as const,
        action: "See orders",
      }
    : !pickupDone
      ? {
          number: 2,
          title: "Pick up the order",
          detail: "Confirm the handover at the store",
          route: "active-job" as const,
          action: "Continue pickup",
        }
      : !deliveryDone
        ? {
            number: 3,
            title: "Deliver the order",
            detail: "Follow the route and confirm delivery",
            route: "delivery-navigation" as const,
            action: "Continue delivery",
          }
        : {
            number: 4,
            title: "Delivery complete",
            detail: "Check your earnings and order history",
            route: "earnings" as const,
            action: "View earnings",
          };
  return (
    <>
      <View style={styles.homeHero}>
        <View style={styles.heroHeading}>
          <View style={styles.flexOne}>
            <Text style={styles.heroEyebrow}>YOUR DELIVERY DAY</Text>
            <Text style={styles.heroTitle}>Hello, {name.trim().split(" ")[0] || "Rider"}!</Text>
            <Text style={styles.heroDescription}>Your day, your deliveries.</Text>
          </View>
          <BrandMark size={42} inverse />
        </View>
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityStatus}>
            <View style={[styles.onlineDot, { backgroundColor: online ? C.success : C.muted }]} />
          </View>
          <View style={styles.flexOne}>
            <Text style={styles.availabilityTitle}>
              {online ? "You're online" : "You're offline"}
            </Text>
            <Text style={styles.availabilityDetail}>
              {online ? "Sample availability is on" : "Tap to preview going online"}
            </Text>
          </View>
          <Switch
            value={online}
            accessibilityLabel="Toggle demo availability"
            accessibilityHint="Demo only; does not receive real orders"
            onValueChange={onToggleOnline}
            trackColor={{ false: C.neutralStrong, true: C.primarySoft }}
            thumbColor={online ? C.primary : C.white}
          />
        </View>
      </View>

      {demoNotice ? <Text style={styles.demoNotice}>{demoNotice}</Text> : null}

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: C.primarySoft }]}>
            <AppIcon name="wallet-outline" size={21} color={C.primary} />
          </View>
          <Text style={styles.metricLabel}>TODAY'S EARNINGS</Text>
          <Text style={styles.metricAmount}>{money(206)}</Text>
          <Text style={styles.metricHelper}>Illustrative total</Text>
        </View>
        <View style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: C.successSoft }]}>
            <AppIcon name="check-circle-outline" size={21} color={C.success} />
          </View>
          <Text style={styles.metricLabel}>COMPLETED JOBS</Text>
          <Text style={styles.metricAmount}>2</Text>
          <Text style={styles.metricHelper}>Sample deliveries</Text>
        </View>
      </View>

      <SectionTitle right={`Step ${nextStep.number} of 4`}>Next step</SectionTitle>
      <View style={styles.stepCard}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepNumber}>{nextStep.number}</Text>
        </View>
        <View style={styles.flexOne}>
          <Text style={styles.stepTitle}>{nextStep.title}</Text>
          <Text style={styles.stepDetail}>{nextStep.detail}</Text>
        </View>
        <AppIcon name="chevron-right" size={22} color={C.primary} />
      </View>
      <BrandButton title={nextStep.action} onPress={() => onNavigate(nextStep.route)} />

      <SectionTitle right={jobAccepted ? "In progress" : "No active job"}>
        Current delivery
      </SectionTitle>
      <View style={styles.card}>
        {jobAccepted ? (
          <>
            <View style={styles.cardTopRow}>
              <Text style={styles.jobId}>{order.id}</Text>
              <StatusPill
                label={deliveryDone ? "COMPLETED" : pickupDone ? "PICKED UP" : "ACCEPTED"}
                tone={deliveryDone || pickupDone ? "green" : "blue"}
              />
            </View>
            <View style={styles.routeTrack}>
              <RoutePoint type="PICKUP" address={order.pickup} color={C.success} />
              <View style={styles.routeLine} />
              <RoutePoint type="DROP OFF" address={order.drop} />
            </View>
            <View style={styles.orderSummaryRow}>
              <Text style={styles.orderSummaryText}>
                {order.distance} · {order.eta}
              </Text>
              <Text style={styles.orderSummaryPrice}>{money(order.payout)}</Text>
            </View>
            <BrandButton
              title={deliveryDone ? "View earnings" : "View active delivery"}
              onPress={() => onNavigate(deliveryDone ? "earnings" : "active-job")}
            />
          </>
        ) : (
          <>
            <View style={styles.emptyIcon}>
              <AppIcon name="package-variant-closed" size={30} color={C.primary} />
            </View>
            <Text style={styles.emptyHeading}>No active deliveries</Text>
            <Text style={styles.emptyText}>
              Explore a sample order to preview how the rider journey works.
            </Text>
            <BrandButton title="View delivery offers" onPress={() => onNavigate("offers")} />
          </>
        )}
      </View>

      <Text style={styles.disclaimer}>
        Demo only: availability, orders and earnings are fictional. No live dispatch is connected.
      </Text>
    </>
  );
}
const styles = createBrandedStyles({
  homeHero: {
    backgroundColor: theme.colors.primary,
    borderRadius: 26,
    padding: 20,
    marginBottom: 18,
    elevation: 1,
    shadowColor: C.primary,
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  heroHeading: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 18 },
  flexOne: { flex: 1, minWidth: 0 },
  heroEyebrow: {
    fontSize: 10,
    letterSpacing: 1.2,
    color: "#DEEAFF",
    fontFamily: theme.typography.family.bold,
    marginBottom: 9,
  },
  heroTitle: {
    fontFamily: theme.typography.family.extraBold,
    fontSize: 27,
    lineHeight: 33,
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  heroDescription: { fontSize: 13, color: "#E8F0FF", marginTop: 4 },
  availabilityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 13,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  availabilityStatus: {
    width: 35,
    height: 35,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.neutralSoft,
  },
  onlineDot: { height: 12, width: 12, borderRadius: 6 },
  availabilityTitle: { color: C.text, fontFamily: theme.typography.family.bold, fontSize: 15 },
  availabilityDetail: { color: C.muted, fontSize: 12, marginTop: 3 },
  demoNotice: {
    padding: 12,
    borderRadius: 11,
    backgroundColor: C.warningSoft,
    color: C.warning,
    fontSize: 12,
    marginBottom: 12,
  },
  metricsRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  metricCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 21,
    padding: 16,
    gap: 5,
  },
  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    letterSpacing: 0.35,
    fontFamily: theme.typography.family.semibold,
    color: C.muted,
  },
  metricAmount: {
    fontFamily: theme.typography.family.extraBold,
    fontSize: 27,
    lineHeight: 32,
    color: theme.colors.primary,
    fontWeight: "800",
    marginTop: 8,
  },
  metricHelper: { fontSize: 12, color: C.muted },
  card: {
    backgroundColor: theme.colors.surface,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 22,
    marginBottom: 14,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  jobId: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 13,
    color: C.text,
    flexShrink: 1,
  },
  routeTrack: { marginTop: 1 },
  routeLine: {
    backgroundColor: C.borderStrong,
    height: 25,
    width: 2,
    marginLeft: 5.5,
    marginVertical: 3,
  },
  orderSummaryRow: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    marginTop: 16,
    paddingTop: 13,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderSummaryText: { color: C.muted, fontSize: 13 },
  orderSummaryPrice: { color: C.text, fontFamily: theme.typography.family.bold, fontSize: 18 },
  emptyIcon: {
    height: 55,
    width: 55,
    borderRadius: 18,
    backgroundColor: C.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyHeading: {
    fontFamily: theme.typography.family.bold,
    fontSize: 17,
    color: C.text,
    marginBottom: 6,
  },
  emptyText: { fontSize: 14, color: C.muted, lineHeight: 20, marginBottom: 14 },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.primarySoft,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: { color: C.white, fontFamily: theme.typography.family.bold, fontSize: 16 },
  stepTitle: { color: C.text, fontFamily: theme.typography.family.bold, fontSize: 16 },
  stepDetail: { color: C.muted, fontSize: 12, marginTop: 3 },
  disclaimer: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 10, marginBottom: 6 },
});
