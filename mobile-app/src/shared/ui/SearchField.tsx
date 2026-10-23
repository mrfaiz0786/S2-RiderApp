import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon } from "@/shared/ui/AppIcon";
import { Pressable, TextInput, View } from "react-native";
const C = theme.colors;
export function SearchField({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder: string;
}) {
  return (
    <View style={styles.search}>
      <AppIcon name="magnify" size={23} color={C.primary} />
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        style={styles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={() => onChange("")}
          style={styles.clearSearch}
        >
          <AppIcon name="close-circle-outline" size={21} color={C.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}
const styles = createBrandedStyles({
  search: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 18,
    paddingLeft: 15,
    paddingRight: 5,
    gap: 10,
    marginBottom: 6,
  },
  searchInput: { flex: 1, minWidth: 0, minHeight: 54, color: C.text, fontSize: 15 },
  clearSearch: { width: 44, height: 48, alignItems: "center", justifyContent: "center" },
});
