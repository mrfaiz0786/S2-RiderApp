import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon, type AppIconName } from "@/shared/ui/AppIcon";
import { Text, View } from "react-native";

const C = theme.colors;
type ScreenHeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: AppIconName;
  compact?: boolean;
  emphasis?: "primary" | "success" | "warning";
};
export function ScreenHero({
  eyebrow,
  title,
  subtitle,
  icon,
  compact = false,
  emphasis = "primary",
}: ScreenHeroProps) {
  const accent =
    emphasis === "success" ? C.success : emphasis === "warning" ? C.warning : C.primary;
  return (
    <View style={[styles.hero, compact && styles.compact]}>
      <View style={styles.headingRow}>
        <View style={styles.heading}>
          <View style={styles.eyebrowRow}>
            <View style={styles.brandDash} />
            <Text style={styles.eyebrow}>{eyebrow}</Text>
          </View>
          <Text accessibilityRole="header" style={[styles.title, compact && styles.titleCompact]}>
            {title}
          </Text>
        </View>
        <View style={styles.iconTile}>
          <AppIcon name={icon} size={25} color={accent} />
        </View>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}
const styles = createBrandedStyles({
  hero: { paddingTop: 8, paddingBottom: 12, marginBottom: 12 },
  compact: { paddingTop: 3, paddingBottom: 6 },
  headingRow: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  heading: { flex: 1, minWidth: 0 },
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 10 },
  brandDash: { height: 5, width: 23, borderRadius: 4, backgroundColor: C.accent },
  eyebrow: { color: C.primary, fontSize: 11, fontWeight: "800", letterSpacing: 0.9, flexShrink: 1 },
  title: { color: C.text, fontSize: 29, lineHeight: 35, fontWeight: "800", letterSpacing: -0.65 },
  titleCompact: { fontSize: 26, lineHeight: 32 },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: C.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  subtitle: { color: C.textSecondary, fontSize: 14, lineHeight: 21, marginTop: 10 },
});
