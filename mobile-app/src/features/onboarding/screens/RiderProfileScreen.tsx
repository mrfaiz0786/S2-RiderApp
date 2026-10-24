import { useProfile } from "@/features/profile/model";
import { isAdult } from "@/features/onboarding/model/eligibility";
import { DateOfBirthPicker } from "@/features/onboarding/components/DateOfBirthPicker";
import { useNavigation } from "@/navigation/NavigationProvider";
import { translations } from "@/shared/i18n/translations";
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
  const { name, setName, email, setEmail, dateOfBirth, setDateOfBirth, language, setLanguage } =
    useProfile();
  const { navigate: go } = useNavigation();
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
      <OnboardingProgress current={2} total={10} />
      <Card>
        <Field
          label="Full name"
          required
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
        />
        <DateOfBirthPicker value={dateOfBirth} onChange={setDateOfBirth} />
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
              }}
              style={[styles.choice, language === l.value && styles.choiceSelected]}
            >
              <Text style={[styles.choiceText, language === l.value && styles.choiceTextSelected]}>
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          title={tr.save}
          onPress={() =>
            name.trim() && isAdult(dateOfBirth)
              ? go("vehicle-documents")
              : Alert.alert(
                  "Check your details",
                  "Enter your full name and a valid date of birth. Riders must be at least 18.",
                )
          }
        />
      </Card>
    </>
  );
}
const styles = createBrandedStyles({
  fieldLabel: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginBottom: 7,
  },
  choiceRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  choice: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingVertical: 7,
    paddingHorizontal: 12,
    minHeight: 40,
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
