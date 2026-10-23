import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { Text, View } from "react-native";
const C = theme.colors;
export function RoutePoint({
  type,
  address,
  note,
  color = C.primary,
}: {
  type: string;
  address: string;
  note?: string;
  color?: string;
}) {
  return (
    <View style={styles.routePoint}>
      <View style={[styles.routeDot, { backgroundColor: color }]} />
      <View style={styles.flexOne}>
        <Text style={styles.label}>{type}</Text>
        <Text style={styles.routeAddress}>{address}</Text>
        {note ? <Text style={styles.routeNote}>{note}</Text> : null}
      </View>
    </View>
  );
}
const styles = createBrandedStyles({
  routePoint: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  routeDot: { height: 13, width: 13, borderRadius: 7, marginTop: 5 },
  flexOne: { flex: 1, minWidth: 0 },
  label: {
    color: C.muted,
    fontSize: 11,
    fontFamily: theme.typography.family.semibold,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: theme.typography.family.semibold,
    color: C.text,
    flexShrink: 1,
  },
  routeNote: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 4 },
});
