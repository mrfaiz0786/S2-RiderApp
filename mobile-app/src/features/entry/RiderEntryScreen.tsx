import { theme } from "@/shared/theme";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandMark } from "@/shared/ui/BrandMark";
import { VehicleIllustration } from "@/shared/ui/VehicleIllustration";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = { onLogin: () => void; onRegister: () => void; registrationEnabled: boolean };
export function RiderEntryScreen({ onLogin, onRegister, registrationEnabled }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.brand}>
          <BrandMark size={45} />
          <View>
            <Text style={styles.brandName}>Build Your Mart</Text>
            <Text style={styles.brandTag}>RIDER PARTNER</Text>
          </View>
        </View>
        <View style={styles.hero}>
          <View style={styles.pill}>
            <View style={styles.pillDot} />
            <Text style={styles.pillLabel}>YBM DELIVERY PARTNERS</Text>
          </View>
          <Text accessibilityRole="header" style={styles.title}>
            Deliver with confidence.{"\n"}Grow with YBM.
          </Text>
          <Text style={styles.subtitle}>
            All your assigned deliveries, pickup details and routes in one place. Choose how you
            want to get started.
          </Text>
          <View style={styles.art}>
            <VehicleIllustration kind="motorcycle" large />
            <View style={styles.artNote}>
              <AppIcon name="map-marker-check-outline" size={19} color={theme.colors.primary} />
              <Text style={styles.artNoteText}>From pickup to drop-off</Text>
            </View>
          </View>
        </View>
        <View style={styles.options}>
          <Text style={styles.sectionHeading}>Get started</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Login as existing rider"
            onPress={onLogin}
            style={({ pressed }) => [styles.option, styles.loginOption, pressed && styles.pressed]}
          >
            <View style={styles.optionIcon}>
              <AppIcon name="account-key-outline" size={26} color={theme.colors.white} />
            </View>
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitleLight}>Login as a Rider</Text>
              <Text style={styles.optionSubtitleLight}>
                Have an account? Sign in with your rider credentials and view your real assigned
                orders.
              </Text>
            </View>
            <AppIcon name="arrow-right" size={23} color={theme.colors.white} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Register yourself as a rider"
            accessibilityState={{ disabled: !registrationEnabled }}
            disabled={!registrationEnabled}
            onPress={onRegister}
            style={({ pressed }) => [
              styles.option,
              styles.registerOption,
              pressed && styles.pressed,
              !registrationEnabled && styles.disabled,
            ]}
          >
            <View style={styles.optionIconSoft}>
              <AppIcon name="account-plus-outline" size={26} color={theme.colors.primary} />
            </View>
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitle}>Register yourself as a Rider</Text>
              <Text style={styles.optionSubtitle}>
                Explore sample profile, documents, vehicle verification, work area and practice
                deliveries.
              </Text>
            </View>
            <AppIcon name="arrow-right" size={23} color={theme.colors.primary} />
          </Pressable>
          <View style={styles.demoNotice}>
            <AppIcon name="information-outline" size={21} color={theme.colors.warning} />
            <Text style={styles.demoText}>
              {registrationEnabled
                ? "Registration is a TEST SIMULATION. Nothing is submitted or saved, and no real account is created. Login is the live API path."
                : "Public registration preview is unavailable in production until real registration and approval APIs are implemented."}
            </Text>
          </View>
        </View>
        <Text style={styles.footer}>Built for riders, powered by Build Your Mart.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const C = theme.colors;
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.background },
  page: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 42,
    gap: 22,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandName: { color: C.primary, fontSize: 21, fontWeight: "800", letterSpacing: -0.45 },
  brandTag: { color: C.muted, fontWeight: "800", fontSize: 10, letterSpacing: 1.55, marginTop: 3 },
  hero: { gap: 15, paddingTop: 12 },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: C.primarySoft,
    borderRadius: 30,
    paddingVertical: 9,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pillDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.success },
  pillLabel: { color: C.primary, fontSize: 10, fontWeight: "800", letterSpacing: 1.05 },
  title: { color: C.text, fontSize: 34, lineHeight: 41, fontWeight: "800", letterSpacing: -1.1 },
  subtitle: { color: C.textSecondary, lineHeight: 23, fontSize: 15, maxWidth: 430 },
  art: {
    minHeight: 161,
    borderRadius: 25,
    backgroundColor: C.primaryTint,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 14,
    gap: 5,
  },
  artNote: {
    flex: 1,
    maxWidth: 160,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 8,
  },
  artNoteText: {
    color: C.primary,
    fontWeight: "800",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  options: { gap: 13 },
  sectionHeading: { fontSize: 18, color: C.text, fontWeight: "800", marginBottom: 2 },
  option: {
    flexDirection: "row",
    gap: 11,
    alignItems: "center",
    borderRadius: 21,
    paddingVertical: 18,
    paddingHorizontal: 15,
    minHeight: 112,
    borderWidth: 1,
  },
  loginOption: { backgroundColor: C.primary, borderColor: C.primary },
  registerOption: { backgroundColor: C.surface, borderColor: C.borderStrong },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.primaryDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  optionIconSoft: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  optionCopy: { flex: 1, gap: 5 },
  optionTitleLight: { color: C.white, fontSize: 16, fontWeight: "800" },
  optionSubtitleLight: { color: "#E5F3EE", fontSize: 12, lineHeight: 18 },
  optionTitle: { color: C.primary, fontSize: 16, fontWeight: "800" },
  optionSubtitle: { color: C.textSecondary, fontSize: 12, lineHeight: 18 },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.6 },
  demoNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    padding: 14,
    borderRadius: 15,
    backgroundColor: C.warningSoft,
  },
  demoText: { color: C.textSecondary, fontSize: 12, lineHeight: 19, flex: 1 },
  footer: { color: C.muted, textAlign: "center", fontSize: 11, marginTop: 5 },
});
