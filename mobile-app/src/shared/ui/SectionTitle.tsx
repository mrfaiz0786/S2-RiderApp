import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import React from "react";
import { Text, View } from "react-native";
const C = theme.colors;
export function SectionTitle({ children, right }: { children: React.ReactNode; right?: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {right ? <Text style={styles.sectionRight}>{right}</Text> : null}
    </View>
  );
}
const styles = createBrandedStyles({
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 15,
    marginBottom: 9,
  },
  sectionTitle: { fontFamily: theme.typography.family.bold, fontSize: 17, color: C.text },
  sectionRight: { color: C.muted, fontSize: 12 },
});
