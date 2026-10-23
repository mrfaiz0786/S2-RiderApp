import { useOnboarding } from "@/features/onboarding/model";
import { canSubmitDeclarations } from "@/features/onboarding/model/selectors";
import { useNavigation } from "@/navigation/NavigationProvider";
import { useFeedback } from "@/shared/state/FeedbackProvider";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandButton as Button } from "@/shared/ui/BrandButton";
import { BrandedAlert as Alert } from "@/shared/ui/BrandDialog";
import { Card } from "@/shared/ui/Card";
import { OnboardingProgress } from "@/shared/ui/OnboardingProgress";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Text, TouchableOpacity, View } from "react-native";

export function DeclarationsScreen() {
  const onboarding = useOnboarding();
  const { dataAccuracyAccepted, setDataAccuracyAccepted, termsAccepted, setTermsAccepted } =
    onboarding;
  const canSubmit = canSubmitDeclarations(onboarding);
  const { navigate: go } = useNavigation();
  const { setDemoNotice } = useFeedback();
  return (
    <>
      <ScreenHero
        eyebrow={"FINAL STEP · DECLARATIONS"}
        title={"Confirm your details"}
        subtitle={"Review your information and confirm both statements."}
        icon="file-document-outline"
        compact
      />
      <OnboardingProgress current={5} />
      <Card>
        <View style={styles.declarationHeader}>
          <View style={styles.declarationIcon}>
            <AppIcon name="file-document-outline" size={24} color={C.blue} />
          </View>
          <View style={styles.flexOne}>
            <Text style={styles.cardTitle}>Information accuracy</Text>
            <Text style={styles.bodyMuted}>Your responsibility as a rider applicant</Text>
          </View>
        </View>
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: dataAccuracyAccepted }}
          onPress={() => setDataAccuracyAccepted((v) => !v)}
          style={styles.declarationRow}
        >
          <View style={[styles.checkBox, dataAccuracyAccepted && styles.checkBoxChecked]}>
            {dataAccuracyAccepted ? <Text style={styles.checkMark}>✓</Text> : null}
          </View>
          <Text style={styles.declarationText}>
            I confirm that all information, personal details, vehicle details, documents and other
            data I have provided are true, accurate, complete and correct to the best of my
            knowledge.
          </Text>
        </TouchableOpacity>
      </Card>
      <Card>
        <View style={styles.declarationHeader}>
          <View style={[styles.declarationIcon, { backgroundColor: C.paleGreen }]}>
            <AppIcon name="shield-check-outline" size={24} color={C.green} />
          </View>
          <View style={styles.flexOne}>
            <Text style={styles.cardTitle}>Terms & conditions</Text>
            <Text style={styles.bodyMuted}>Agreement to the applicable terms</Text>
          </View>
        </View>
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: termsAccepted }}
          onPress={() => setTermsAccepted((v) => !v)}
          style={styles.declarationRow}
        >
          <View style={[styles.checkBox, termsAccepted && styles.checkBoxChecked]}>
            {termsAccepted ? <Text style={styles.checkMark}>✓</Text> : null}
          </View>
          <Text style={styles.declarationText}>
            I have read and agree to the applicable Terms and Conditions and understand that my
            application and documents may be reviewed by Build Your Mart.
          </Text>
        </TouchableOpacity>
        <Text style={styles.helper}>
          A production release should link this statement to the current, approved Terms and
          Conditions and record the accepted version and timestamp.
        </Text>
      </Card>
      <Button
        title="Submit for review →"
        disabled={!canSubmit}
        onPress={() => {
          if (!canSubmit) {
            Alert.alert(
              "Confirm both statements",
              "Choose a valid city and hub, then tick both checkboxes before continuing.",
            );
            return;
          }
          setDemoNotice(
            "Both declarations accepted in this demo session. No information was sent to a server.",
          );
          go("verification-status");
        }}
      />
      <Button title="Back to starting hub" secondary onPress={() => go("work-hub")} />
      {!dataAccuracyAccepted || !termsAccepted ? (
        <Text style={styles.helper}>Both checkboxes are required to continue.</Text>
      ) : null}
      <Text style={styles.helper}>
        Demo prototype: these confirmations are held only in the current app session and are not a
        legally recorded consent or server submission.
      </Text>
    </>
  );
}
const styles = createBrandedStyles({
  declarationHeader: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 7 },
  declarationIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.paleBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  flexOne: { flex: 1 },
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
  declarationRow: { flexDirection: "row", alignItems: "flex-start", gap: 11, paddingVertical: 10 },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: C.borderStrong,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkBoxChecked: { backgroundColor: C.blue, borderColor: C.blue },
  checkMark: { fontSize: 16, fontWeight: "900", color: "#FFFFFF", lineHeight: 19 },
  declarationText: { flex: 1, fontSize: 13, lineHeight: 20, color: C.ink },
  helper: {
    fontFamily: theme.typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
});
