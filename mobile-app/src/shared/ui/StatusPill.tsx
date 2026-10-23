import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { Text, View } from "react-native";
const C = theme.colors;
export function StatusPill({
  label,
  tone = "blue",
}: {
  label: string;
  tone?: "blue" | "green" | "amber";
}) {
  const palette =
    tone === "green"
      ? [C.successSoft, C.success]
      : tone === "amber"
        ? [C.warningSoft, C.warning]
        : [C.primarySoft, C.primary];
  return (
    <View style={[styles.statusPill, { backgroundColor: palette[0] }]}>
      <Text style={[styles.statusPillText, { color: palette[1] }]}>{label}</Text>
    </View>
  );
}
const styles = createBrandedStyles({
  statusPill: {
    alignSelf: "flex-start",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusPillText: { fontFamily: theme.typography.family.bold, fontSize: 10, letterSpacing: 0.35 },
});
