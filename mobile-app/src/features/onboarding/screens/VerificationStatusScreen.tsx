import { sampleDocuments } from "@/features/onboarding/data/fixtures";
import { vehicleDocumentIds } from "@/features/onboarding/data/vehicles";
import { workCityName } from "@/features/onboarding/data/workAreas";
import { useOnboarding } from "@/features/onboarding/model";
import { useProfile } from "@/features/profile/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandButton as Button } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { OnboardingProgress } from "@/shared/ui/OnboardingProgress";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Tag } from "@/shared/ui/Tag";
import { Text, View } from "react-native";

export function VerificationStatusScreen() {
  const { name } = useProfile();
  const { vehicle, workCity, bankHolder, reviewSubmitted, docStatus } = useOnboarding();
  const documentIds = vehicleDocumentIds[vehicle] || vehicleDocumentIds["Two-Wheeler"];
  const markedDocuments = sampleDocuments.filter(
    (item) => documentIds.includes(item.id) && docStatus(item.id) === "Pending review",
  ).length;
  const { navigate: go } = useNavigation();
  return (
    <>
      <ScreenHero
        eyebrow={"ACCOUNT VERIFICATION"}
        title={"Verification status"}
        subtitle={"Track your sample approval checklist and next steps."}
        icon="clock-outline"
        compact
      />
      <OnboardingProgress current={9} total={10} />
      <Card>
        <View style={styles.statusHero}>
          <AppIcon name="clock-outline" size={28} color={C.amber} />
          <Text style={styles.cardTitle}>Review pending</Text>
          <Tag label="Manual review" tone="amber" />
        </View>
        <Text style={styles.bodyMuted}>
          Your demo details are marked for review. No real reviewer or verification service is
          connected.
        </Text>
        <Row label="Profile" value={name.trim() ? "Added" : "Incomplete"} />
        <Row label="Vehicle / city" value={`${vehicle} · ${workCityName(workCity)}`} />
        <Row label="Documents" value={`${markedDocuments}/${documentIds.length} marked`} />
        <Row label="Payout details" value={bankHolder ? "Added (demo)" : "Missing"} />
        <Button
          title="Preview demo training →"
          disabled={!reviewSubmitted}
          onPress={() => go("training")}
        />
      </Card>
      <Text style={styles.helper}>
        Real orders require document approval, background clearance and training.
      </Text>
    </>
  );
}
const styles = createBrandedStyles({
  statusHero: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: theme.typography.family.bold,
    fontSize: 16,
    fontWeight: "700",
    color: C.ink,
    marginBottom: 2,
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
