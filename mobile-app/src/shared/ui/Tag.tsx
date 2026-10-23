import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C, type Tone } from "@/shared/theme/screenPalette";
import { Text, View } from "react-native";
export function Tag({ label, tone = "grey" }: { label: string; tone?: Tone }) {
  const map: Record<Tone, readonly [string, string]> = {
    blue: [C.paleBlue, C.blue],
    green: [C.paleGreen, C.green],
    amber: [C.paleAmber, C.amber],
    red: [C.paleRed, C.red],
    grey: [C.soft, C.muted],
  };
  return (
    <View style={[styles.tag, { backgroundColor: map[tone][0] }]}>
      <Text style={[styles.tagText, { color: map[tone][1] }]}>{label}</Text>
    </View>
  );
}
const styles = createBrandedStyles({
  tag: { alignSelf: "flex-start", borderRadius: 30, paddingHorizontal: 9, paddingVertical: 5 },
  tagText: { fontFamily: theme.typography.family.bold, fontSize: 10, fontWeight: "700" },
});
