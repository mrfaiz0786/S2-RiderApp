import { useProfile } from "@/features/profile/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { translations } from "@/shared/i18n/translations";
import { useFeedback } from "@/shared/state/FeedbackProvider";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import { BrandButton as Button } from "@/shared/ui/BrandButton";
import { BrandedAlert as Alert } from "@/shared/ui/BrandDialog";
import { Card } from "@/shared/ui/Card";
import { Field } from "@/shared/ui/Field";
import { OnboardingProgress } from "@/shared/ui/OnboardingProgress";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Text, TouchableOpacity, View } from "react-native";
export function RiderProfileScreen() {
  const { name, setName, email, setEmail, language, setLanguage } = useProfile();
  const { navigate: go } = useNavigation();
  const { demoNotice, setDemoNotice } = useFeedback();
  const tr = translations[language];
  return (
    <>
      <ScreenHero
        eyebrow={"RIDER ONBOARDING"}
        title={tr.profile}
        subtitle={tr.profileIntro}
        icon="account"
        compact
      />
      <OnboardingProgress current={1} />
      <Card>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitial}>{name.trim().charAt(0) || "R"}</Text>
        </View>
        <Text style={styles.bodyMuted}>Personal details</Text>
        <Field
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
        />
        <Field
          label="Email (optional)"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
        />
        <Text style={styles.fieldLabel}>{tr.preferred}</Text>
        <View style={styles.choiceRow}>
          {[
            { label: "English", value: "English" },
            { label: "हिन्दी", value: "Hindi" },
            { label: "ಕನ್ನಡ", value: "Kannada" },
          ].map((l) => (
            <TouchableOpacity
              key={l.value}
              onPress={() => {
                setLanguage(l.value as "English" | "Hindi" | "Kannada");
                setDemoNotice("App language changed to " + l.label + ".");
              }}
              style={[styles.choice, language === l.value && styles.choiceSelected]}
            >
              <Text style={[styles.choiceText, language === l.value && styles.choiceTextSelected]}>
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.divider} />
        <Text style={styles.helper}>
          Your information is sample data stored only in this demo session. Your selected language
          updates the welcome and profile screens immediately.
        </Text>
        <Button
          title={tr.save}
          onPress={() =>
            name.trim()
              ? go("vehicle-documents")
              : Alert.alert("Name required", "Enter your full name to continue.")
          }
        />
      </Card>
      {demoNotice ? <Text style={styles.notice}>{demoNotice}</Text> : null}
    </>
  );
}
const styles = createBrandedStyles({
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
  bodyMuted: {
    fontFamily: theme.typography.family.regular,
    fontSize: 13,
    lineHeight: 20,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
  fieldLabel: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginBottom: 7,
  },
  choiceRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  choice: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 48,
    justifyContent: "center",
  },
  choiceSelected: { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary },
  choiceText: { fontSize: 13, color: C.muted, fontWeight: "600" },
  choiceTextSelected: { color: C.blue },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 7 },
  helper: {
    fontFamily: theme.typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
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
