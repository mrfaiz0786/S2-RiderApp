import { useNavigation } from "@/navigation/NavigationProvider";
import { tabs } from "@/navigation/routes";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon } from "@/shared/ui/AppIcon";
import { Text, TouchableOpacity, View } from "react-native";
export function BottomTabs() {
  const { current, selectTab } = useNavigation();
  if (!current.showTabs) return null;
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => {
        const selected = current.tab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected }}
            onPress={() => selectTab(tab.name)}
            style={[styles.tab, selected && styles.selected]}
          >
            <AppIcon
              name={tab.icon}
              size={22}
              color={selected ? theme.colors.primary : theme.colors.muted}
            />
            <Text style={[styles.label, selected && styles.activeLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const styles = createBrandedStyles({
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  tab: {
    flex: 1,
    minHeight: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 18,
    paddingVertical: 8,
    marginHorizontal: 2,
  },
  selected: { backgroundColor: theme.colors.primarySoft, borderRadius: 14 },
  label: { fontSize: 11, fontWeight: "700", color: theme.colors.muted },
  activeLabel: { color: theme.colors.primary },
});
