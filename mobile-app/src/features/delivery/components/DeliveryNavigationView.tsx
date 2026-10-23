import { sampleJobs } from "@/features/delivery/data/fixtures";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon } from "@/shared/ui/AppIcon";
import { SectionTitle } from "@/shared/ui/SectionTitle";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Text, TouchableOpacity, View } from "react-native";
const C = theme.colors;
const order = sampleJobs[0];
export function DeliveryNavigationView({
  pickupDone,
  onDirections,
  onReportIssue,
}: {
  pickupDone: boolean;
  onDirections: () => void;
  onReportIssue: () => void;
}) {
  return (
    <>
      <Text style={styles.eyebrow}>ACTIVE DELIVERY · DEMO</Text>
      <Text style={styles.screenTitle}>On the way</Text>
      <Text style={styles.screenSubtitle}>Your route, delivery details and next step.</Text>

      <View style={styles.mapCanvas}>
        <View style={styles.roadOne} />
        <View style={styles.roadTwo} />
        <View style={styles.roadThree} />
        <View style={styles.roadFour} />
        <View style={styles.mapBike}>
          <AppIcon name="bike" size={21} color={C.white} />
        </View>
        <View style={styles.mapDestination}>
          <AppIcon name="map-marker-outline" size={24} color={C.white} />
        </View>
        <View style={styles.mapBadge}>
          <AppIcon name="navigation-variant-outline" size={17} color={C.primary} />
          <Text style={styles.mapBadgeText}>Route preview</Text>
        </View>
        <View style={styles.mapDisclaimer}>
          <Text style={styles.mapDisclaimerText}>Illustration only · GPS not connected</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <StatusPill
            label={pickupDone ? "PICKED UP" : "PICKUP PENDING"}
            tone={pickupDone ? "green" : "amber"}
          />
          <Text style={styles.secondaryText}>{order.id}</Text>
        </View>
        <Text style={styles.label}>DELIVERY DESTINATION</Text>
        <Text style={styles.destinationAddress}>{order.drop}</Text>
        <View style={styles.subtleRule} />
        <View style={styles.overviewMetrics}>
          <View style={styles.overviewMetricBare}>
            <AppIcon name="map-marker-outline" size={20} color={C.primary} />
            <View>
              <Text style={styles.label}>DISTANCE</Text>
              <Text style={styles.overviewNumber}>{order.distance}</Text>
            </View>
          </View>
          <View style={styles.overviewMetricBare}>
            <AppIcon name="clock-outline" size={20} color={C.primary} />
            <View>
              <Text style={styles.label}>ESTIMATED TIME</Text>
              <Text style={styles.overviewNumber}>{order.eta}</Text>
            </View>
          </View>
        </View>
        <View style={styles.secondaryActions}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onDirections}
            style={styles.outlineButton}
          >
            <AppIcon name="navigation-variant-outline" size={19} color={C.primary} />
            <Text style={styles.outlineButtonText}>Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onReportIssue}
            style={styles.outlineButton}
          >
            <AppIcon name="lifebuoy" size={19} color={C.primary} />
            <Text style={styles.outlineButtonText}>Report issue</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SectionTitle>Delivery progress</SectionTitle>
      <View style={styles.card}>
        <View style={styles.progressRow}>
          <View
            style={[styles.routeDot, { backgroundColor: pickupDone ? C.success : C.warning }]}
          />
          <View style={styles.flexOne}>
            <Text style={styles.label}>STEP 1 · PICKUP</Text>
            <Text style={styles.routeAddress}>{order.pickup}</Text>
          </View>
          <StatusPill
            label={pickupDone ? "DONE" : "PENDING"}
            tone={pickupDone ? "green" : "amber"}
          />
        </View>
        <View style={styles.routeLine} />
        <View style={styles.progressRow}>
          <View style={[styles.routeDot, { backgroundColor: C.primary }]} />
          <View style={styles.flexOne}>
            <Text style={styles.label}>STEP 2 · DELIVERY</Text>
            <Text style={styles.routeAddress}>{order.drop}</Text>
          </View>
          <StatusPill label="NEXT" />
        </View>
      </View>
      <Text style={styles.disclaimer}>
        Map, distance and ETA are illustrative. No GPS tracking or actual arrival verification is
        connected.
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
  mapCanvas: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 26,
    height: 266,
    overflow: "hidden",
    position: "relative",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  roadOne: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    height: 23,
    width: "150%",
    transform: [{ rotate: "-25deg" }],
  },
  roadTwo: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    height: 15,
    width: "140%",
    transform: [{ rotate: "42deg" }],
  },
  roadThree: {
    position: "absolute",
    backgroundColor: "#C8DCD6",
    height: 10,
    width: "140%",
    transform: [{ rotate: "79deg" }],
  },
  roadFour: {
    position: "absolute",
    backgroundColor: "#C8DCD6",
    height: 8,
    width: "120%",
    transform: [{ rotate: "-65deg" }],
  },
  mapBike: {
    position: "absolute",
    top: "27%",
    left: "18%",
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: C.primary,
    borderColor: C.white,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  mapDestination: {
    position: "absolute",
    right: "18%",
    bottom: "23%",
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: C.success,
    borderColor: C.white,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  mapBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: C.surface,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mapBadgeText: { fontSize: 12, color: C.primary, fontFamily: theme.typography.family.semibold },
  mapDisclaimer: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.94)",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  mapDisclaimerText: { color: C.muted, textAlign: "center", fontSize: 11 },
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
  secondaryText: { color: C.muted, fontSize: 12 },
  label: {
    color: C.muted,
    fontSize: 11,
    fontFamily: theme.typography.family.semibold,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  destinationAddress: {
    color: C.text,
    fontSize: 21,
    fontFamily: theme.typography.family.bold,
    lineHeight: 28,
  },
  subtleRule: { height: 1, backgroundColor: C.border, marginTop: 16, marginBottom: 14 },
  overviewMetrics: { flexDirection: "row", gap: 10, marginBottom: 7 },
  overviewMetricBare: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 9 },
  overviewNumber: { color: C.text, fontFamily: theme.typography.family.bold, fontSize: 17 },
  secondaryActions: { flexDirection: "row", gap: 10, marginTop: 10 },
  outlineButton: {
    flex: 1,
    borderColor: C.borderStrong,
    borderWidth: 1,
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flexDirection: "row",
  },
  outlineButtonText: {
    color: C.primary,
    fontFamily: theme.typography.family.semibold,
    fontSize: 13,
  },
  progressRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  routeDot: { height: 13, width: 13, borderRadius: 7, marginTop: 5 },
  flexOne: { flex: 1, minWidth: 0 },
  routeAddress: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: theme.typography.family.semibold,
    color: C.text,
    flexShrink: 1,
  },
  routeLine: {
    backgroundColor: C.borderStrong,
    height: 25,
    width: 2,
    marginLeft: 5.5,
    marginVertical: 3,
  },
  disclaimer: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 10, marginBottom: 6 },
});
