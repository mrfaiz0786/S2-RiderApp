import { sampleDocuments } from "@/features/onboarding/data/fixtures";
import { vehicleDocumentIds } from "@/features/onboarding/data/vehicles";
import { previewHubs, workCityName } from "@/features/onboarding/data/workAreas";
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
import { Section } from "@/shared/ui/Section";
import { Tag } from "@/shared/ui/Tag";
import { Text, View } from "react-native";

export function VerificationStatusScreen() {
  const { name } = useProfile();
  const { vehicle, workCity, workHub, docStatus, docTone } = useOnboarding();
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
      <OnboardingProgress current={6} />
      <Card>
        <View style={styles.statusHero}>
          <AppIcon name="clock-outline" size={28} color={C.amber} />
          <Text style={styles.cardTitle}>Review pending</Text>
          <Tag label="Manual review" tone="amber" />
        </View>
        <Text style={styles.bodyMuted}>
          This is a local preview of the review queue. No reviewer or verification service is
          connected, and this screen does not approve your account.
        </Text>
      </Card>
      <Section title="Verification checklist">
        <Card>
          <Row
            label="Rider profile"
            value={name.trim() ? "Details added" : "Incomplete"}
            tone={name.trim() ? "green" : "amber"}
          />
          <Row label="Selected vehicle" value={vehicle} />
          <Row label="Work city (preview)" value={workCityName(workCity)} />
          <Row
            label="Starting hub (preview)"
            value={previewHubs(workCity).find((h) => h.id === workHub)?.name || "Not selected"}
          />
          {sampleDocuments
            .filter((d) =>
              (vehicleDocumentIds[vehicle] || vehicleDocumentIds["Two-Wheeler"]).includes(d.id),
            )
            .map((d) => (
              <Row
                key={d.id}
                label={d.name}
                value={docStatus(d.id)}
                tone={docTone(docStatus(d.id))}
              />
            ))}
          <Row label="Payout setup" value="Not started" tone="grey" />
        </Card>
      </Section>
      <Card>
        <Text style={styles.cardTitle}>What happens next?</Text>
        <Text style={styles.bodyMuted}>
          In production, Build Your Mart must validate each required document and vehicle
          eligibility before enabling rider availability. The demo cannot perform these checks.
        </Text>
        <Button title="Continue to demo home →" onPress={() => go("home")} />
      </Card>
      <Text style={styles.helper}>
        Demo only: reaching the home screen does not mean your rider account is approved for real
        deliveries.
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
