import { demoConfig } from "@/services/demo/credentials";
import { TestHint } from "@/shared/ui/TestHint";
import type { Language } from "@/shared/i18n/translations";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandButton } from "@/shared/ui/BrandButton";
import { BrandMark } from "@/shared/ui/BrandMark";
import { BrandNote } from "@/shared/ui/BrandNote";
import { BrandSheet } from "@/shared/ui/BrandSheet";
import { SelectionMark } from "@/shared/ui/SelectionMark";
import { VehicleIllustration } from "@/shared/ui/VehicleIllustration";
import { useState } from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

const C = theme.colors;

export function WelcomeView({
  phone,
  onPhoneChange,
  language,
  onLanguageChange,
  onContinue,
}: {
  phone: string;
  onPhoneChange: (v: string) => void;
  language: Language;
  onLanguageChange: (v: Language) => void;
  onContinue: () => void;
}) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [error, setError] = useState("");
  return (
    <>
      <View style={styles.welcomeBrand}>
        <View style={styles.brandWordmark}>
          <BrandMark size={49} />
          <View>
            <Text style={styles.brandName}>Build Your Mart</Text>
            <Text style={styles.brandRole}>RIDER PARTNER</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Choose app language"
          onPress={() => setLanguageOpen(true)}
          style={styles.languageButton}
        >
          <AppIcon name="translate" size={17} color={C.primary} />
          <Text style={styles.languageLabel}>
            {language === "English" ? "EN" : language === "Hindi" ? "HI" : "KN"}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.welcomeEyebrow}>MAKE YOUR NEXT MOVE</Text>
      <Text accessibilityRole="header" style={styles.welcomeTitle}>
        Your city.{"\n"}Your next chapter.
      </Text>
      <Text style={styles.welcomeSubtitle}>
        One place for your deliveries, earnings and the details that matter.
      </Text>
      <View style={styles.welcomeArt}>
        <View style={styles.welcomeArtCircle} />
        <VehicleIllustration kind="motorcycle" large />
        <View style={styles.welcomeArtBadge}>
          <AppIcon name="package-variant-closed" size={19} color={C.primary} />
          <Text style={styles.welcomeArtText}>Ready for the road.</Text>
        </View>
        <View style={styles.welcomeAccent} />
      </View>
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Start with your number</Text>
        <Text style={styles.body}>We will guide you through your rider setup.</Text>
        <TestHint
          title={"Enter this number: " + demoConfig.testPhone}
          detail="Test rider only. No SMS, phone call or real account will be created."
        />
        <BrandButton
          title="Fill test rider number"
          secondary
          onPress={() => {
            onPhoneChange(demoConfig.testPhone);
            setError("");
          }}
        />
        <Text style={styles.label}>Mobile number</Text>
        <View style={[styles.phoneInput, error ? styles.inputError : null]}>
          <Text style={styles.countryCode}>+91</Text>
          <View style={styles.phoneDivider} />
          <TextInput
            accessibilityLabel="Ten digit mobile number"
            value={phone}
            maxLength={10}
            onChangeText={(v) => {
              onPhoneChange(v.replace(/\D/g, "").slice(0, 10));
              setError("");
            }}
            keyboardType="phone-pad"
            autoComplete="tel"
            placeholder="Enter mobile number"
            placeholderTextColor={C.placeholder}
            style={styles.phoneText}
          />
        </View>
        {error ? (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {error}
          </Text>
        ) : null}
        <BrandButton
          title="Get started"
          onPress={() => {
            if (phone !== demoConfig.testPhone) {
              setError("Enter the displayed test number: " + demoConfig.testPhone + ".");
              return;
            }
            Keyboard.dismiss();
            onContinue();
          }}
        />
        <Text style={styles.footnote}>
          Demo preview. No SMS is sent and no real account is created.
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => setHelpOpen(true)}
        style={styles.helpLink}
      >
        <AppIcon name="help-circle-outline" size={18} color={C.primary} />
        <Text style={styles.helpText}>A little help getting started</Text>
      </Pressable>
      <BrandSheet
        visible={languageOpen}
        title="Make yourself at home"
        subtitle="Choose a language. Some prototype content is still in English."
        onClose={() => setLanguageOpen(false)}
      >
        {(["English", "Hindi", "Kannada"] as Language[]).map((v) => (
          <Pressable
            key={v}
            accessibilityRole="radio"
            accessibilityState={{ checked: language === v }}
            style={styles.choiceRow}
            onPress={() => {
              onLanguageChange(v);
              setLanguageOpen(false);
            }}
          >
            <Text style={styles.choiceTitle}>
              {v === "Hindi" ? "हिन्दी" : v === "Kannada" ? "ಕನ್ನಡ" : "English"}
            </Text>
            <SelectionMark selected={language === v} />
          </Pressable>
        ))}
      </BrandSheet>
      <BrandSheet
        visible={helpOpen}
        title="Your setup, one step at a time"
        onClose={() => setHelpOpen(false)}
      >
        <BrandNote
          title="Explore with fictional details"
          body="This preview walks through profile, vehicle, city, hub and review. Verification and live work are not connected."
          icon="shield-check-outline"
        />
        <Text style={styles.body}>
          The local sign-in test code is documented in mobile-app/README.md. Use test information
          only.
        </Text>
        <BrandButton title="Back to sign in" onPress={() => setHelpOpen(false)} />
      </BrandSheet>
    </>
  );
}
const styles = createBrandedStyles({
  welcomeBrand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 3,
    marginBottom: 24,
  },
  brandWordmark: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  brandName: { fontSize: 20, fontWeight: "800", color: C.primary, letterSpacing: -0.5 },
  brandRole: { fontSize: 10, fontWeight: "800", color: C.muted, letterSpacing: 1.4, marginTop: 2 },
  languageButton: {
    minWidth: 60,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  languageLabel: { fontSize: 12, fontWeight: "800", color: C.primary },
  welcomeEyebrow: {
    color: C.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  welcomeTitle: {
    color: C.text,
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
    letterSpacing: -1.1,
  },
  welcomeSubtitle: {
    color: C.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 11,
    maxWidth: 340,
  },
  welcomeArt: {
    height: 164,
    marginTop: 20,
    marginBottom: 22,
    backgroundColor: C.primarySoft,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  welcomeArtCircle: {
    position: "absolute",
    width: 156,
    height: 156,
    borderRadius: 78,
    backgroundColor: "#D1E4DB",
    right: -36,
    top: -30,
  },
  welcomeArtBadge: {
    position: "absolute",
    left: 14,
    bottom: 13,
    backgroundColor: C.surface,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  welcomeArtText: { color: C.primary, fontSize: 11, fontWeight: "800" },
  welcomeAccent: {
    position: "absolute",
    height: 7,
    width: 50,
    backgroundColor: C.accent,
    borderRadius: 7,
    top: 23,
    left: 17,
    transform: [{ rotate: "-22deg" }],
  },
  formCard: {
    backgroundColor: C.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    gap: 8,
  },
  sectionTitle: { color: C.text, fontSize: 19, fontWeight: "800", flexShrink: 1 },
  body: { color: C.textSecondary, fontSize: 14, lineHeight: 21 },
  label: { color: C.text, fontSize: 13, fontWeight: "700", marginTop: 12, marginBottom: 2 },
  phoneInput: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: C.borderStrong,
    backgroundColor: C.surfaceRaised,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  inputError: { borderColor: C.danger },
  countryCode: { color: C.primary, fontSize: 15, fontWeight: "800" },
  phoneDivider: { height: 24, width: 1, backgroundColor: C.borderStrong, marginHorizontal: 12 },
  phoneText: { flex: 1, minWidth: 0, minHeight: 54, fontSize: 16, color: C.text },
  error: { color: C.danger, fontSize: 13, marginBottom: 2 },
  footnote: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 10 },
  helpLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    minHeight: 48,
    marginTop: 10,
    marginBottom: 5,
  },
  helpText: { color: C.primary, fontSize: 13, fontWeight: "800" },
  choiceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  choiceTitle: { color: C.text, fontSize: 16, fontWeight: "700" },
});
