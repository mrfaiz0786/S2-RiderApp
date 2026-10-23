import { sampleTransactions } from "@/features/earnings/data/fixtures";
import { alertDemo } from "@/shared/lib/demoFeedback";
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
import { Text, View } from "react-native";
export function PayoutsScreen() {
  return (
    <>
      <ScreenHero
        eyebrow={"PAYOUTS & TRANSACTIONS"}
        title={"Payouts & transactions"}
        subtitle={"Review sample payment records and settlement status."}
        icon="cash"
      />
      <View style={styles.financeBalancePanel}>
        <View style={styles.rowBetween}>
          <View style={styles.flexOne}>
            <Text style={styles.eyebrow}>SAMPLE BALANCE</Text>
            <Text style={styles.earningsTotal}>{money(206)}</Text>
          </View>
          <Tag label="NOT WITHDRAWABLE" tone="amber" />
        </View>
        <Text style={styles.bodyMuted}>
          This is a static demo balance, not verified available funds.
        </Text>
        <View style={styles.divider} />
        <Row label="Bank account" value="Not connected" tone="grey" />
        <Row label="Payout provider" value="Not connected" tone="grey" />
        <Button
          title="Simulate payout request"
          onPress={() => alertDemo("Payout request (demo only; no payment initiated)")}
        />
        <Text style={styles.helper}>
          The action only shows a demo notice. It does not create a payout request or transfer
          money.
        </Text>
      </View>
      <Section title="Transaction history" right={sampleTransactions.length + " sample records"}>
        {sampleTransactions.map((t) => (
          <Card key={t.id}>
            <View style={styles.rowBetween}>
              <View style={styles.flexOne}>
                <Text style={styles.bodyStrong}>{t.title}</Text>
                <Text style={styles.helper}>{t.date}</Text>
                <Text style={styles.helper}>Reference: {t.id}</Text>
              </View>
              <View style={styles.alignEnd}>
                <Text style={styles.bodyStrong}>{money(t.amount)}</Text>
                <Tag
                  label={t.status}
                  tone={t.status === "Paid" ? "green" : t.status === "Pending" ? "amber" : "grey"}
                />
              </View>
            </View>
          </Card>
        ))}
      </Section>
      <Card>
        <Text style={styles.cardTitle}>About these records</Text>
        <Text style={styles.bodyMuted}>
          Transaction dates, amounts and statuses are sample data. Live settlement status, bank
          details, fees and payout timelines are not connected to a financial service.
        </Text>
      </Card>
    </>
  );
}
const styles = createBrandedStyles({
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
  flexOne: { flex: 1 },
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
  helper: {
    fontFamily: theme.typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
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
  alignEnd: { alignItems: "flex-end", gap: 5 },
  cardTitle: {
    fontFamily: theme.typography.family.bold,
    fontSize: 16,
    fontWeight: "700",
    color: C.ink,
    marginBottom: 2,
  },
});
