import { theme } from "./index";
// Semantic source tokens; aliases preserve the established screen appearance.
export const C = {
  bg: theme.colors.background,
  card: theme.colors.surface,
  ink: theme.colors.text,
  muted: theme.colors.muted,
  line: theme.colors.border,
  borderStrong: theme.colors.borderStrong,
  blue: theme.colors.primary,
  paleBlue: theme.colors.primarySoft,
  green: theme.colors.success,
  paleGreen: theme.colors.successSoft,
  amber: theme.colors.warning,
  paleAmber: theme.colors.warningSoft,
  red: theme.colors.danger,
  paleRed: theme.colors.dangerSoft,
  soft: theme.colors.neutralSoft,
};
export type Tone = "blue" | "green" | "amber" | "red" | "grey";
