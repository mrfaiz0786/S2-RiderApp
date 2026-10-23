import { useNavigation } from "@/navigation/NavigationProvider";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandMark } from "@/shared/ui/BrandMark";
import { Text, TouchableOpacity, View } from "react-native";
export function AppHeader({ onOpenPreview }: { onOpenPreview: () => void }) {
  const { route, current, navigate, goBack } = useNavigation();
  if (route === "welcome") return null;
  const action = current.focusedDelivery
    ? () => navigate("safety")
    : current.showTabs
      ? () => navigate("notifications")
      : onOpenPreview;
  const label = current.focusedDelivery
    ? "Safety and assistance"
    : current.showTabs
      ? "Notifications"
      : "Open demo screen index";
  return (
    <View style={styles.bar}>
      {route === "home" ? (
        <View style={styles.back}>
          <BrandMark size={34} />
        </View>
      ) : (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={goBack}
          style={styles.back}
        >
          <AppIcon name="chevron-left" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      )}
      <View style={styles.heading}>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>BUILD YOUR MART</Text>
      </View>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={action}
        style={styles.action}
      >
        <AppIcon
          name={
            current.focusedDelivery
              ? "shield-check-outline"
              : current.showTabs
                ? "bell-outline"
                : "dots-horizontal"
          }
          size={22}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = createBrandedStyles({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minHeight: 64,
    backgroundColor: theme.colors.background,
  },
  back: { width: 46, height: 48, alignItems: "center", justifyContent: "center" },
  heading: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 15, fontWeight: "800", color: theme.colors.primary, textAlign: "center" },
  subtitle: { fontSize: 10, color: theme.colors.muted, letterSpacing: 0.7, marginTop: 2 },
  action: {
    width: 46,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
