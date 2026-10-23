import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import React from "react";
import { Text, View } from "react-native";
export function Section({
  title,
  right,
  children,
}: {
  title: string;
  right?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {right ? <Text style={styles.smallMuted}>{right}</Text> : null}
      </View>
      {children}
    </View>
  );
}
const styles = createBrandedStyles({
  section: { marginTop: 14, marginBottom: 6 },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: theme.typography.family.bold,
    fontSize: 17,
    fontWeight: "700",
    color: C.ink,
  },
  smallMuted: { fontSize: 12, fontWeight: "600", color: C.muted },
});
