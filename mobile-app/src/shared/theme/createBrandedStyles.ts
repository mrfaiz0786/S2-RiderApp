import { StyleSheet } from "react-native";
import { theme } from "./index";

// Compatibility adapter for the original demo screens. New code uses tokens directly.
const legacyColors: Record<string, string> = {
  "#F6F8FC": theme.colors.background,
  "#F5F7F8": theme.colors.background,
  "#EDF2FA": theme.colors.backgroundElevated,
  "#F9FBFF": theme.colors.surfaceRaised,
  "#172033": theme.colors.text,
  "#46536A": theme.colors.textSecondary,
  "#69758A": theme.colors.muted,
  "#8994A7": theme.colors.placeholder,
  "#9A9A95": theme.colors.placeholder,
  "#DDE5F1": theme.colors.border,
  "#C3D0E3": theme.colors.borderStrong,
  "#2459C4": theme.colors.primary,
  "#1B469E": theme.colors.primaryPressed,
  "#163777": theme.colors.primaryDeep,
  "#E4ECFF": theme.colors.primarySoft,
  "#F1F5FF": theme.colors.primaryTint,
  "#C9D9F7": theme.colors.border,
  "#CADAF9": theme.colors.border,
  "#D1E2EE": theme.colors.border,
  "#E5F0F5": theme.colors.primaryTint,
  "#E4F2E9": theme.colors.primaryTint,
  "#DDE9FF": "#DCEDE7",
  "#DEEAFF": "#DCEDE7",
  "#E8F0FF": "#E7F1EC",
  "#E7EEFF": "#E7F1EC",
  "#A9CCFF": theme.colors.primarySoft,
  "#CDD5E2": theme.colors.neutralStrong,
  "#EDF1F7": theme.colors.neutralSoft,
  "#D3DCE9": theme.colors.neutralStrong,
  "#F0D49D": "#E9D4A6",
  "#148747": theme.colors.primary,
  "#111827": theme.colors.black,
};

export function createBrandedStyles<T extends StyleSheet.NamedStyles<T>>(styles: T): T {
  const output: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(styles)) {
    const next = { ...(value as Record<string, unknown>) };
    for (const key of [
      "color",
      "backgroundColor",
      "borderColor",
      "borderTopColor",
      "borderBottomColor",
      "shadowColor",
    ]) {
      const v = next[key];
      if (typeof v === "string" && legacyColors[v.toUpperCase()])
        next[key] = legacyColors[v.toUpperCase()];
    }
    if (typeof next.fontSize === "number") {
      const size = Math.max(11, next.fontSize);
      const weight = next.fontWeight === "bold" ? 700 : Number(next.fontWeight || 400);
      const family =
        weight >= 800
          ? theme.typography.family.extraBold
          : weight >= 700
            ? theme.typography.family.bold
            : weight >= 500
              ? theme.typography.family.semibold
              : theme.typography.family.regular;
      next.fontSize = size;
      next.fontFamily = next.fontWeight ? family : next.fontFamily || family;
      next.fontWeight = "normal";
      next.lineHeight = Math.max(Number(next.lineHeight) || 0, Math.ceil(size * 1.28));
    }
    output[name] = next;
  }
  return StyleSheet.create(output as T);
}
