import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RiderLandingProps = {
  onLogin: () => void;
  onRegister: () => void;
};

const colors = {
  ink: "#173A3E",
  teal: "#044B51",
  deep: "#03373C",
  orange: "#FF8506",
  orangeSoft: "#FFF0DC",
  surface: "#FFFFFF",
  muted: "#5B7474",
  border: "#DCE5E1",
  cream: "#F8F7F3",
  tint: "#E7F2EC",
};

function Story() {
  return (
    <View style={styles.story}>
      <View style={styles.pretitle}>
        <Ionicons name="sparkles-outline" size={15} color={colors.teal} />
        <Text style={styles.pretitleText}>YOUR DAY. YOUR DELIVERIES.</Text>
      </View>
      <Text accessibilityRole="header" style={styles.headline}>
        Every ride,{"\n"}
        <Text style={styles.headlineAccent}>made simple.</Text>
      </Text>
      <Text style={styles.description}>
        Get an order, pick it up, and deliver it — one clear step at a time.
      </Text>
    </View>
  );
}

function JourneyIllustration({ compact }: { compact: boolean }) {
  return (
    <View style={[styles.illustration, compact && styles.illustrationCompact]}>
      <View style={styles.glowLarge} />
      <View style={styles.glowSmall} />
      <View style={styles.illustrationTop}>
        <View style={styles.illustrationStatusDot} />
        <Text style={styles.illustrationCaption}>A SIMPLE DELIVERY JOURNEY</Text>
      </View>

      <View style={[styles.bikeCircle, compact && styles.bikeCircleCompact]}>
        <MaterialCommunityIcons
          name="moped"
          size={compact ? 83 : 116}
          color={colors.orange}
          accessibilityLabel="Delivery rider illustration"
        />
      </View>

      <View style={styles.travelRow}>
        <View style={styles.travelPoint}>
          <Ionicons name="cube" size={17} color={colors.teal} />
          <View>
            <Text style={styles.travelLabel}>PICK UP</Text>
            <Text style={styles.travelDetail}>Get parcel</Text>
          </View>
        </View>
        <View style={styles.travelLine}>
          <View style={styles.travelDash} />
          <Ionicons name="arrow-forward-circle" size={28} color="#FFC76D" />
          <View style={styles.travelDash} />
        </View>
        <View style={styles.travelPoint}>
          <Ionicons name="location" size={18} color={colors.orange} />
          <View>
            <Text style={styles.travelLabel}>DELIVER</Text>
            <Text style={styles.travelDetail}>Finish trip</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function ActionTile({
  variant,
  icon,
  title,
  helper,
  hindi,
  onPress,
}: {
  variant: "primary" | "secondary";
  icon: "log-in-outline" | "person-add-outline";
  title: string;
  helper: string;
  hindi: string;
  onPress: () => void;
}) {
  const primary = variant === "primary";
  return (
    <TouchableOpacity
      accessible
      accessibilityRole="button"
      accessibilityLabel={title + ". " + helper}
      accessibilityHint={primary ? "Open the rider login page" : "Open new rider registration"}
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.actionTile, primary ? styles.actionPrimary : styles.actionSecondary]}
      testID={primary ? "landing-login" : "landing-register"}
    >
      <View
        style={[styles.actionIcon, primary ? styles.actionIconPrimary : styles.actionIconSecondary]}
      >
        <Ionicons name={icon} size={28} color={primary ? colors.deep : colors.teal} />
      </View>
      <View style={styles.actionTextBlock}>
        <Text style={[styles.actionTitle, primary && styles.actionTitlePrimary]}>{title}</Text>
        <Text style={[styles.actionHelper, primary && styles.actionHelperPrimary]}>
          {helper} · {hindi}
        </Text>
      </View>
      <Ionicons name="arrow-forward-circle" size={29} color={primary ? "#FFAF45" : colors.teal} />
    </TouchableOpacity>
  );
}

function Actions({ onLogin, onRegister }: RiderLandingProps) {
  return (
    <View style={styles.actions}>
      <Text style={styles.actionsEyebrow}>GET STARTED</Text>
      <Text style={styles.actionsTitle}>What would you like to do?</Text>
      <ActionTile
        variant="primary"
        icon="log-in-outline"
        title="Log in"
        helper="Already a rider"
        hindi="लॉग इन"
        onPress={onLogin}
      />
      <ActionTile
        variant="secondary"
        icon="person-add-outline"
        title="Register as a rider"
        helper="I'm new here"
        hindi="नया रजिस्ट्रेशन"
        onPress={onRegister}
      />
      <View style={styles.demoCard}>
        <View style={styles.demoCardHeader}>
          <View style={styles.demoIcon}>
            <Ionicons name="flask-outline" size={18} color={colors.teal} />
          </View>
          <View style={styles.demoHeadingBlock}>
            <Text style={styles.demoTitle}>Practice mode</Text>
            <Text style={styles.demoSub}>Try the app without a real SMS</Text>
          </View>
        </View>
        <View style={styles.credentials}>
          <View style={styles.credential}>
            <Text style={styles.credentialLabel}>TEST NUMBER</Text>
            <Text selectable style={styles.credentialValue}>
              9999999999
            </Text>
          </View>
          <View style={styles.credentialsDivider} />
          <View style={styles.credential}>
            <Text style={styles.credentialLabel}>TEST OTP</Text>
            <Text selectable style={styles.credentialValue}>
              123456
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function RiderLanding({ onLogin, onRegister }: RiderLandingProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 820;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.mark}>
            <Image
              source={require("../../../../assets/brand/ybm-mark.png")}
              resizeMode="contain"
              style={styles.markImage}
              accessibilityLabel="YourBuildMart logo"
            />
          </View>
          <View style={styles.brandText}>
            <Text style={styles.brandName}>YOURBUILDMART</Text>
            <Text style={styles.brandCaption}>RIDER PARTNER</Text>
          </View>
        </View>
        <View style={styles.regionBadge}>
          <Ionicons name="location-sharp" size={13} color={colors.teal} />
          <Text style={styles.regionBadgeText}>DELHI NCR</Text>
        </View>
      </View>

      <View style={[styles.columns, wide && styles.columnsWide]}>
        <View style={[styles.storyColumn, wide && styles.storyColumnWide]}>
          <Story />
          {wide && <JourneyIllustration compact={false} />}
        </View>
        <View style={[styles.actionsColumn, wide && styles.actionsColumnWide]}>
          <Actions onLogin={onLogin} onRegister={onRegister} />
        </View>
        {!wide && <JourneyIllustration compact />}
      </View>

      <View style={styles.footer}>
        <Ionicons name="shield-checkmark-outline" size={18} color={colors.muted} />
        <Text style={styles.footerText}>
          This is a test experience. No real orders, documents or payments are required.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    paddingTop: 4,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 11 },
  mark: {
    width: 49,
    height: 49,
    borderRadius: 15,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  markImage: { width: 41, height: 41 },
  brandText: { gap: 2 },
  brandName: { fontSize: 17, fontWeight: "900", letterSpacing: 0.3, color: colors.ink },
  brandCaption: { fontSize: 11, fontWeight: "800", letterSpacing: 1.8, color: colors.muted },
  regionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.tint,
    paddingVertical: 9,
    paddingHorizontal: 12,
    gap: 5,
    borderRadius: 50,
  },
  regionBadgeText: { fontSize: 11, fontWeight: "900", color: colors.teal, letterSpacing: 0.5 },
  columns: { gap: 10, paddingTop: 23 },
  columnsWide: { flexDirection: "row", alignItems: "stretch", gap: 30, paddingTop: 38 },
  storyColumn: { gap: 17 },
  storyColumnWide: { flex: 1.13 },
  story: { paddingVertical: 4 },
  pretitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 13,
  },
  pretitleText: { fontSize: 11, fontWeight: "900", letterSpacing: 1.4, color: colors.teal },
  headline: {
    fontSize: 39,
    lineHeight: 44,
    letterSpacing: -1.5,
    fontWeight: "900",
    color: colors.ink,
    marginBottom: 13,
  },
  headlineAccent: { color: "#A84C00" },
  description: {
    maxWidth: 430,
    fontSize: 16,
    lineHeight: 25,
    fontWeight: "500",
    color: colors.muted,
  },
  actionsColumn: { width: "100%" },
  actionsColumnWide: { flex: 0.95, maxWidth: 430 },
  actions: {
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 19,
  },
  actionsEyebrow: { fontSize: 11, fontWeight: "900", letterSpacing: 1.3, color: "#A84C00" },
  actionsTitle: {
    fontSize: 23,
    lineHeight: 30,
    fontWeight: "900",
    color: colors.ink,
    marginBottom: 3,
  },
  actionTile: {
    minHeight: 94,
    borderRadius: 17,
    paddingVertical: 15,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  actionPrimary: { backgroundColor: colors.teal },
  actionSecondary: { backgroundColor: "#F8FCFA", borderColor: "#BAD1C8", borderWidth: 1 },
  actionIcon: {
    height: 49,
    width: 49,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIconPrimary: { backgroundColor: "#FFB74D" },
  actionIconSecondary: { backgroundColor: "#E0EFE8" },
  actionTextBlock: { flex: 1, gap: 4 },
  actionTitle: { fontSize: 18, fontWeight: "900", color: colors.ink },
  actionTitlePrimary: { color: colors.surface },
  actionHelper: { fontSize: 12, fontWeight: "600", lineHeight: 18, color: colors.muted },
  actionHelperPrimary: { color: "#E0EFE8" },
  demoCard: {
    marginTop: 4,
    backgroundColor: colors.orangeSoft,
    borderWidth: 1,
    borderColor: "#F5DFC0",
    borderRadius: 16,
    padding: 14,
  },
  demoCardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  demoIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  demoHeadingBlock: { gap: 3, flex: 1 },
  demoTitle: { fontSize: 15, fontWeight: "900", color: colors.ink },
  demoSub: { fontSize: 12, color: colors.muted, fontWeight: "600" },
  credentials: {
    marginTop: 12,
    borderRadius: 12,
    flexDirection: "row",
    backgroundColor: colors.surface,
    paddingVertical: 13,
    paddingHorizontal: 10,
  },
  credential: { flex: 1, gap: 4, alignItems: "center" },
  credentialLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 0.7, color: colors.muted },
  credentialValue: { fontWeight: "900", fontSize: 16, color: colors.teal, letterSpacing: 0.5 },
  credentialsDivider: { width: 1, height: 35, backgroundColor: colors.border, alignSelf: "center" },
  illustration: {
    marginTop: 12,
    backgroundColor: colors.deep,
    borderRadius: 26,
    padding: 22,
    height: 286,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  illustrationCompact: { height: 218, padding: 17 },
  glowLarge: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    right: -110,
    top: -108,
    backgroundColor: "#0D5B60",
  },
  glowSmall: {
    position: "absolute",
    width: 175,
    height: 175,
    borderRadius: 88,
    left: -75,
    bottom: -100,
    backgroundColor: "#165F5F",
  },
  illustrationTop: { flexDirection: "row", alignItems: "center", gap: 7 },
  illustrationStatusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFC164" },
  illustrationCaption: { color: "#E6F8EF", fontSize: 11, letterSpacing: 1, fontWeight: "900" },
  bikeCircle: {
    width: 154,
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#326F71",
    borderRadius: 80,
    backgroundColor: "#164F53",
  },
  bikeCircleCompact: { width: 125, height: 92 },
  travelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 9,
  },
  travelPoint: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  travelLabel: { fontSize: 10, fontWeight: "900", color: colors.ink },
  travelDetail: { fontSize: 9, fontWeight: "700", color: colors.muted, marginTop: 3 },
  travelLine: {
    flex: 1,
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  travelDash: { height: 1, flex: 1, backgroundColor: "#E6F8EF" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 4,
    marginTop: 25,
    marginBottom: 14,
  },
  footerText: { flex: 1, fontSize: 12, lineHeight: 18, fontWeight: "600", color: colors.muted },
});
