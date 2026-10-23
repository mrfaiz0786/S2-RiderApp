import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import React from "react";
import { View } from "react-native";
export function Card({ children, tone }: { children: React.ReactNode; tone?: "blue" | "amber" }) {
  return (
    <View
      style={[
        styles.card,
        tone === "blue" && styles.cardBlue,
        tone === "amber" && styles.cardAmber,
      ]}
    >
      {children}
    </View>
  );
}
const styles = createBrandedStyles({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    marginBottom: 14,
    gap: 10,
  },
  cardBlue: { backgroundColor: theme.colors.primaryTint, borderColor: theme.colors.border },
  cardAmber: { backgroundColor: theme.colors.warningSoft, borderColor: "#E9D4A6" },
});
