import { useNavigation } from "@/navigation/NavigationProvider";
import { money } from "@/shared/lib/money";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import { BrandButton as Button } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Section } from "@/shared/ui/Section";
import { Tag } from "@/shared/ui/Tag";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
export function EarningsScreen() {
  const [earningsPeriod, setEarningsPeriod] = useState("Today");
  const { navigate: go } = useNavigation();
  return (
    <>
      <ScreenHero
        eyebrow={"RIDER FINANCES"}
        title={"Your earnings"}
        subtitle={"Track sample earnings, completed jobs and payouts."}
        icon="wallet-outline"
      />
      <View style={styles.choiceRow}>
        {["Today", "Week", "Month"].map((x) => (
          <TouchableOpacity
            key={x}
            accessibilityRole="button"
            accessibilityState={{ selected: earningsPeriod === x }}
            style={[styles.filterPill, earningsPeriod === x && styles.filterPillActive]}
            onPress={() => setEarningsPeriod(x)}
          >
            <Text style={[styles.filterText, earningsPeriod === x && styles.filterTextActive]}>
              {x}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.financeBalancePanel}>
        <View style={styles.rowBetween}>
          <Text style={styles.eyebrow}>{earningsPeriod.toUpperCase()} · SAMPLE TOTAL</Text>
          <Tag label="DEMO DATA" tone="amber" />
        </View>
        <Text style={styles.earningsTotal}>
          {money(earningsPeriod === "Today" ? 206 : earningsPeriod === "Week" ? 1248 : 4860)}
        </Text>
        <Text style={styles.bodyMuted}>Illustrative earnings · not withdrawable</Text>
        <View style={styles.divider} />
        <View style={styles.statsRow}>
          <View style={styles.flexOne}>
            <Text style={styles.eyebrow}>COMPLETED JOBS</Text>
            <Text style={styles.statValue}>
              {earningsPeriod === "Today" ? "2" : earningsPeriod === "Week" ? "14" : "58"}
            </Text>
            <Text style={styles.helper}>Sample activity count</Text>
          </View>
          <View style={styles.flexOne}>
            <Text style={styles.eyebrow}>ADJUSTMENTS</Text>
            <Text style={styles.statValue}>{money(0)}</Text>
            <Text style={styles.helper}>Illustrative only</Text>
          </View>
        </View>
      </View>
      <Section title="Earnings breakdown">
        <Card>
          <Text style={styles.bodyMuted}>
            Example breakdown for today; not recalculated for week or month.
          </Text>
          <Row label="Base pay" value={money(160)} />
          <Row label="Distance component" value={money(36)} />
          <Row label="Incentive / tip" value={money(10)} />
          <Row label="Deductions" value={money(0)} />
          <View style={styles.divider} />
          <Row label="Example total" value={money(206)} tone="green" />
        </Card>
      </Section>
      <Card>
        <Text style={styles.cardTitle}>Payout status</Text>
        <Text style={styles.bodyMuted}>
          These figures do not represent cleared funds. No bank account, payment provider or live
          earnings API is connected.
        </Text>
        <Button title="View payouts & transactions →" onPress={() => go("payouts")} />
      </Card>
      <Text style={styles.helper}>
        Period totals are fixed sample values. This screen does not calculate real wages, fees,
        taxes or settlements.
      </Text>
    </>
  );
}
const styles = createBrandedStyles({
  choiceRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  filterPill: {
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 16,
    backgroundColor: theme.colors.neutralSoft,
    minHeight: 46,
    justifyContent: "center",
  },
  filterPillActive: { backgroundColor: theme.colors.primary },
  filterText: { fontSize: 13, fontWeight: "600", color: C.muted },
  filterTextActive: { color: "#FFFFFF" },
  financeBalancePanel: {
    backgroundColor: theme.colors.primaryTint,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    gap: 12,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginVertical: 6,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: C.blue,
    marginBottom: 7,
    marginTop: 2,
  },
  earningsTotal: {
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1.1,
    color: theme.colors.primary,
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
  divider: { height: 1, backgroundColor: C.line, marginVertical: 7 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", gap: 18, marginTop: 8 },
  flexOne: { flex: 1 },
  statValue: {
    fontSize: 23,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: C.ink,
    marginBottom: 2,
  },
  helper: {
    fontFamily: theme.typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
  cardTitle: {
    fontFamily: theme.typography.family.bold,
    fontSize: 16,
    fontWeight: "700",
    color: C.ink,
    marginBottom: 2,
  },
});
