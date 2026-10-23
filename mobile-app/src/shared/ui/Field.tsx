import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { Text, TextInput, View } from "react-native";
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
}: {
  label: string;
  value: string;
  onChangeText: (s: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "phone-pad" | "email-address" | "number-pad";
  maxLength?: number;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        keyboardType={keyboardType || "default"}
        maxLength={maxLength}
        style={styles.input}
        autoCapitalize="none"
      />
    </View>
  );
}
const styles = createBrandedStyles({
  fieldWrap: { marginBottom: 7 },
  fieldLabel: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginBottom: 7,
  },
  input: {
    minHeight: 54,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
    fontSize: 16,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text,
  },
});
