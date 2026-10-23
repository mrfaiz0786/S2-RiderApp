import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon, type AppIconName } from "@/shared/ui/AppIcon";
import { BrandPressable } from "@/shared/ui/BrandMotion";
import { ActivityIndicator, Text } from "react-native";
const C = theme.colors;
export function BrandButton({
  title,
  onPress,
  secondary = false,
  danger = false,
  disabled = false,
  loading = false,
  icon,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: AppIconName;
}) {
  const foreground = secondary ? C.primary : C.white;
  const label = title.replace(/\s*[\u2192\u203a]\s*$/, "").replace(/^\s*\u2190\s*/, "");
  const leadingIcon = icon || (secondary && /^\s*\u2190/.test(title) ? "arrow-left" : undefined);
  return (
    <BrandPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        secondary && styles.buttonSecondary,
        danger && styles.buttonDanger,
        (disabled || loading) && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={foreground} />
      ) : leadingIcon ? (
        <AppIcon name={leadingIcon} size={21} color={foreground} />
      ) : null}
      <Text style={[styles.buttonText, { color: foreground }]}>{label}</Text>
      {!secondary && !danger && !loading ? (
        <AppIcon name="arrow-right" size={20} color={foreground} />
      ) : null}
    </BrandPressable>
  );
}
const styles = createBrandedStyles({
  button: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: C.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 10,
    marginTop: 5,
  },
  buttonSecondary: { backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.borderStrong },
  buttonDanger: { backgroundColor: C.danger },
  buttonDisabled: { opacity: 0.48 },
  buttonText: { fontSize: 15, fontWeight: "800", textAlign: "center", flexShrink: 1 },
});
