import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon, type AppIconName } from "@/shared/ui/AppIcon";
import { Text, View } from "react-native";

const C = theme.colors;

export function DetailStrip({
  icon,
  title,
  description,
  tone = "blue",
}: {
  icon: AppIconName;
  title: string;
  description: string;
  tone?: "blue" | "green" | "amber" | "red";
}) {
  const palette =
    tone === "green"
      ? [C.successSoft, C.success]
      : tone === "amber"
        ? [C.warningSoft, C.warning]
        : tone === "red"
          ? [C.dangerSoft, C.danger]
          : [C.primarySoft, C.primary];
  return (
    <View style={styles.strip}>
      <View style={[styles.stripIcon, { backgroundColor: palette[0] }]}>
        <AppIcon name={icon} color={palette[1]} size={23} />
      </View>
      <View style={styles.stripContent}>
        <Text style={styles.stripTitle}>{title}</Text>
        <Text style={styles.stripDescription}>{description}</Text>
      </View>
    </View>
  );
}
const styles = createBrandedStyles({
  strip: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    padding: 16,
    alignItems: "flex-start",
    marginBottom: 14,
  },
  stripIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  stripContent: { flex: 1, minWidth: 0 },
  stripTitle: { fontSize: 15, fontWeight: "800", color: C.text, marginBottom: 4 },
  stripDescription: { fontSize: 14, lineHeight: 20, color: C.textSecondary },
});
