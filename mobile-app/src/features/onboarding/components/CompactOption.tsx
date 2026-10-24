import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { Text, TouchableOpacity, View } from "react-native";

export function CompactOption({
  title,
  detail,
  selected,
  onPress,
}: {
  title: string;
  detail?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="radio"
      accessibilityLabel={title}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.option, selected && styles.selected]}
    >
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {detail ? (
          <Text style={styles.detail} numberOfLines={1}>
            {detail}
          </Text>
        ) : null}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.dot} /> : null}
      </View>
    </TouchableOpacity>
  );
}
const styles = createBrandedStyles({
  option: {
    minHeight: 62,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  selected: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryTint },
  text: { flex: 1 },
  title: { fontSize: 15, fontWeight: "800", color: theme.colors.text },
  detail: { fontSize: 12, color: theme.colors.muted, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: theme.colors.primary },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.primary },
});
