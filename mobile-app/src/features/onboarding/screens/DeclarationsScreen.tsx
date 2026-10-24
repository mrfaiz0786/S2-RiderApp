import { useOnboarding } from "@/features/onboarding/model";
import { canSubmitDeclarations } from "@/features/onboarding/model/selectors";
import { useNavigation } from "@/navigation/NavigationProvider";
import { useFeedback } from "@/shared/state/FeedbackProvider";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
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
        eyebrow={"STEP 8 · CONSENT"}
        title={"Confirm your details"}
        subtitle={"Review your information and confirm both statements."}
        icon="file-document-outline"
        compact
      />
      <OnboardingProgress current={8} total={10} />
      <Card>
        <Text style={styles.cardTitle}>
          Information accuracy <Text style={styles.required}>*</Text>
        </Text>
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
            I confirm that the personal, vehicle and document details I provided are accurate.
          </Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <Text style={styles.cardTitle}>
          Terms & conditions <Text style={styles.required}>*</Text>
        </Text>
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
            I agree to the Terms and Conditions for this rider application.
          </Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <Text style={styles.cardTitle}>
          Verification consent <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: onboarding.verificationConsent }}
          onPress={() => onboarding.setFlag("verificationConsent", !onboarding.verificationConsent)}
          style={styles.declarationRow}
        >
          <View style={[styles.checkBox, onboarding.verificationConsent && styles.checkBoxChecked]}>
            {onboarding.verificationConsent ? <Text style={styles.checkMark}>✓</Text> : null}
          </View>
          <Text style={styles.declarationText}>
            I agree to the stated document and background review for my rider application.
          </Text>
        </TouchableOpacity>
      </Card>
      <Button
        title="Submit for review →"
        disabled={!canSubmit || !onboarding.verificationConsent}
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
          onboarding.setFlag("reviewSubmitted", true);
          go("verification-status");
        }}
      />
      <Text style={styles.helper}>Demo only: no information is sent for real verification.</Text>
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
  required: { color: theme.colors.danger },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 9 },
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
