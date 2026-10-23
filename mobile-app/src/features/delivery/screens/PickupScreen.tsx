import { sampleJobs } from "@/features/delivery/data/fixtures";
import { useDelivery } from "@/features/delivery/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { useFeedback } from "@/shared/state/FeedbackProvider";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandButton as Button } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { DetailStrip } from "@/shared/ui/DetailStrip";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Tag } from "@/shared/ui/Tag";
import { Text, View } from "react-native";

export function PickupScreen() {
  const { jobAccepted, pickupDone, confirmPickup } = useDelivery();
  const { navigate: go } = useNavigation();
  const { demoNotice, setDemoNotice } = useFeedback();
  return (
    <>
      <ScreenHero
        eyebrow={"PICKUP CONFIRMATION"}
        title={"Confirm pickup"}
        subtitle={"Check the collection point and confirm the handover."}
        icon="map-marker-outline"
      />
      <DetailStrip
        icon="shield-check-outline"
        title="Pickup checklist"
        description="Check the order reference, packaging and item count with the sender."
      />
      <Card>
        <View style={styles.rowBetween}>
          <Text style={styles.eyebrow}>JOB REFERENCE</Text>
          <Tag label="DEMO JOB" tone="amber" />
        </View>
        <Text style={styles.cardTitle}>{sampleJobs[0].id}</Text>
        <View style={styles.mapPlaceholder}>
          <AppIcon name="map-marker-outline" size={30} color={C.green} />
          <Text style={styles.mapLabel}>{sampleJobs[0].pickup}</Text>
          <Text style={styles.helper}>Pickup location preview · no live map or GPS</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.fieldLabel}>PICKUP VERIFICATION</Text>
        <View style={styles.rowBetween}>
          <View style={styles.flexOne}>
            <Text style={styles.bodyStrong}>
              {pickupDone ? "Pickup marked complete" : "Awaiting pickup check"}
            </Text>
            <Text style={styles.helper}>
              {pickupDone
                ? "Local demo state updated"
                : "Use the demo action to preview the next step"}
            </Text>
          </View>
          <Tag label={pickupDone ? "COMPLETE" : "PENDING"} tone={pickupDone ? "green" : "amber"} />
        </View>
        <Button
          disabled={!jobAccepted || pickupDone}
          title={pickupDone ? "Pickup marked complete" : "Simulate pickup verification"}
          onPress={() => {
            confirmPickup();
            setDemoNotice(
              "Pickup marked complete in local demo state only. No PIN, barcode or backend validation occurred.",
            );
          }}
        />
        <Text style={styles.helper}>
          Production must validate the configured pickup PIN or barcode with the backend before
          confirming a real handover.
        </Text>
        <Button title="Report a pickup issue" secondary onPress={() => go("support")} />
      </Card>
      {demoNotice ? <Text style={styles.notice}>{demoNotice}</Text> : null}
      <Button
        disabled={!pickupDone}
        title="Continue to delivery →"
        onPress={() => go("delivery-navigation")}
      />
      <Text style={styles.helper}>
        Accept the sample offer and confirm pickup before continuing. This remains a local preview.
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
  mapPlaceholder: {
    minHeight: 164,
    backgroundColor: "#E5F0F5",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#D1E2EE",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    marginBottom: 10,
  },
  mapLabel: { fontSize: 14, fontWeight: "700", color: C.ink, marginTop: 5 },
  helper: {
    fontFamily: theme.typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 7 },
  fieldLabel: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginBottom: 7,
  },
  flexOne: { flex: 1 },
  bodyStrong: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 14,
    fontWeight: "600",
    color: C.ink,
  },
  notice: {
    padding: 12,
    backgroundColor: C.paleAmber,
    borderRadius: 10,
    color: C.amber,
    fontSize: 12,
    marginTop: 10,
  },
});
