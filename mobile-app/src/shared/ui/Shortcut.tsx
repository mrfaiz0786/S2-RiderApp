import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon, type AppIconName } from "@/shared/ui/AppIcon";
import { Text, TouchableOpacity, View } from "react-native";
const C = theme.colors;
export function Shortcut({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: AppIconName;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.shortcut}
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
    >
      <View style={styles.shortcutIcon}>
        <AppIcon name={icon} size={23} color={C.primary} />
      </View>
      <Text style={styles.shortcutTitle}>{title}</Text>
      <Text style={styles.shortcutSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}
const styles = createBrandedStyles({
  shortcut: {
    width: "48%",
    flexGrow: 1,
    minWidth: 0,
    borderRadius: 20,
    borderColor: theme.colors.border,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
    padding: 16,
    alignItems: "flex-start",
    gap: 5,
    minHeight: 116,
  },
  shortcutIcon: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: 14,
    height: 42,
    width: 42,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  shortcutTitle: { color: C.text, fontFamily: theme.typography.family.bold, fontSize: 14 },
  shortcutSubtitle: { color: C.muted, fontSize: 12, lineHeight: 17 },
});
