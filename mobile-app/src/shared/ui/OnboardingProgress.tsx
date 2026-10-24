import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { Text, View } from "react-native";

const C = theme.colors;

export function OnboardingProgress({ current, total = 6 }: { current: number; total?: number }) {
  const safeTotal = Math.max(1, Math.min(12, Math.floor(total)));
  const step = Math.max(1, Math.min(safeTotal, Math.floor(current)));
  const labels = ["Profile", "Vehicle", "Work city", "Starting hub", "Declarations", "Review"];
  return (
    <View
      style={styles.progressWrap}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 1,
        max: safeTotal,
        now: step,
        text: `Setup step ${step} of ${safeTotal}`,
      }}
    >
      <View style={styles.progressTextRow}>
        <Text style={styles.progressTitle}>YOUR SETUP</Text>
        <Text style={styles.progressCount}>
          {step} / {safeTotal}
          {safeTotal === 6 ? "  -  " + labels[step - 1] : ""}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        {Array.from({ length: safeTotal }, (_, index) => (
          <View
            key={index}
            style={[
              styles.progressSegment,
              index < step - 1 && styles.progressCompleted,
              index === step - 1 && styles.progressCurrent,
            ]}
          />
        ))}
      </View>
    </View>
  );
}
const styles = createBrandedStyles({
  progressWrap: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 10,
    marginBottom: 10,
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 7,
  },
  progressTitle: { color: C.muted, fontSize: 11, fontWeight: "800", letterSpacing: 0.7 },
  progressCount: { color: C.primary, fontSize: 12, fontWeight: "700" },
  progressTrack: { flexDirection: "row", gap: 6 },
  progressSegment: { height: 5, flex: 1, borderRadius: 4, backgroundColor: C.neutralSoft },
  progressCompleted: { backgroundColor: C.accent },
  progressCurrent: { backgroundColor: C.primary },
});
