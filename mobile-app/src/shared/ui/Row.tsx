import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C, type Tone } from "@/shared/theme/screenPalette";
import { Tag } from "@/shared/ui/Tag";
import { Text, View } from "react-native";
export function Row({ label, value, tone }: { label: string; value: string; tone?: Tone }) {
  return (
    <View style={styles.rowBetween}>
      <Text style={styles.bodyMuted}>{label}</Text>
      {tone ? <Tag label={value} tone={tone} /> : <Text style={styles.bodyStrong}>{value}</Text>}
    </View>
  );
}
const styles = createBrandedStyles({
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginVertical: 6,
  },
  bodyMuted: {
    fontFamily: theme.typography.family.regular,
    fontSize: 13,
    lineHeight: 20,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
  bodyStrong: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 14,
    fontWeight: "600",
    color: C.ink,
  },
});
