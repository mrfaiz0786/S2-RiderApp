import { useAuth } from "@/features/auth/model";
import { previewHubs, workCityName } from "@/features/onboarding/data/workAreas";
import { useOnboarding } from "@/features/onboarding/model";
import { sampleRider } from "@/features/profile/data/fixtures";
import { useProfile } from "@/features/profile/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { alertDemo } from "@/shared/lib/demoFeedback";
import { useSessionReset } from "@/shared/state/SessionResetProvider";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import { BrandButton as Button } from "@/shared/ui/BrandButton";
import { BrandedAlert as Alert } from "@/shared/ui/BrandDialog";
import { Card } from "@/shared/ui/Card";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Section } from "@/shared/ui/Section";
import { Tag } from "@/shared/ui/Tag";
import { Text, TouchableOpacity, View } from "react-native";
export function ProfileScreen() {
  const { phone } = useAuth();
  const { name, email, language } = useProfile();
  const { vehicle, workCity, workHub } = useOnboarding();
  const { navigate: go } = useNavigation();
  const resetSession = useSessionReset();
  return (
    <>
      <ScreenHero
        eyebrow="YOUR ACCOUNT"
        title="Profile & settings"
        subtitle="Manage your rider information and preferences."
        icon="cog-outline"
      />
      <Card>
        <View style={styles.rowBetween}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>{name.trim().charAt(0) || "R"}</Text>
          </View>
          <Tag label="REVIEW PENDING" tone="amber" />
        </View>
        <Text style={styles.cardTitle}>{name.trim() || "Rider name not set"}</Text>
        <Text style={styles.bodyMuted}>{phone || sampleRider.phone}</Text>
        <Text style={styles.helper}>{email.trim() || "No email added"}</Text>
        <View style={styles.divider} />
        <Text style={styles.bodyMuted}>
          This profile uses local demo state and is not a verified rider account.
        </Text>
        <Button title="Edit profile details →" secondary onPress={() => go("rider-profile")} />
      </Card>
      <Section title="Preferences">
        <Card>
          <Row label="Preferred language" value={language + " (demo)"} />
          <Row label="Vehicle category" value={vehicle} />
          <Row label="Work city (preview)" value={workCityName(workCity)} />
          <Row
            label="Starting hub (preview)"
            value={previewHubs(workCity).find((h) => h.id === workHub)?.name || "Not selected"}
          />
          <Row label="Notifications" value="Enabled (sample)" tone="green" />
          <Row label="Location services" value="Not connected" tone="grey" />
          <Text style={styles.helper}>
            These preference rows are informational. Language, push notifications and location
            services are not connected to system or account settings.
          </Text>
        </Card>
      </Section>
      <Section title="Account & privacy">
        <Card>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => alertDemo("Privacy policy and data controls")}
          >
            <Text style={styles.linkRow}>Privacy policy & data controls ›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => alertDemo("Terms and conditions")}
          >
            <Text style={styles.linkRow}>Terms and conditions ›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity accessibilityRole="button" onPress={() => go("support")}>
            <Text style={styles.linkRow}>Help & support ›</Text>
          </TouchableOpacity>
        </Card>
      </Section>
      <Card>
        <Text style={styles.cardTitle}>Reset demo progress</Text>
        <Text style={styles.bodyMuted}>
          Reset the local onboarding, job and verification state to try the prototype again. This
          does not delete a real account or server data.
        </Text>
        <Button
          title="Reset demo progress"
          secondary
          onPress={() =>
            Alert.alert(
              "Reset demo progress?",
              "This returns the prototype to the welcome screen and clears local workflow progress.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Reset demo", style: "destructive", onPress: resetSession },
              ],
            )
          }
        />
      </Card>
      <Text style={styles.helper}>
        Prototype settings only. Privacy policy and terms links display demo notices; no legal pages
        or account-management services are connected.
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
  profileAvatar: {
    width: 68,
    height: 68,
    borderRadius: 23,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  profileInitial: { fontSize: 27, fontWeight: "800", color: theme.colors.primary },
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
  divider: { height: 1, backgroundColor: C.line, marginVertical: 7 },
  linkRow: {
    fontSize: 14,
    fontWeight: "600",
    color: C.ink,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
});
