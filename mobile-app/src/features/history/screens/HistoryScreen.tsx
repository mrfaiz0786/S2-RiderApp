import { sampleJobs } from "@/features/delivery/data/fixtures";
import { money } from "@/shared/lib/money";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import { BrandButton as Button } from "@/shared/ui/BrandButton";
import { BrandedAlert as Alert } from "@/shared/ui/BrandDialog";
import { Card } from "@/shared/ui/Card";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Tag } from "@/shared/ui/Tag";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
export function HistoryScreen() {
  const [historyFilter, setHistoryFilter] = useState("All");
  return (
    <>
      <ScreenHero
        eyebrow={"DELIVERY RECORDS"}
        title={"Delivery history"}
        subtitle={"Review completed deliveries and sample order history."}
        icon="history"
      />
      <View style={styles.choiceRow}>
        {["All", "Completed", "Cancelled"].map((x) => (
          <TouchableOpacity
            key={x}
            accessibilityRole="button"
            accessibilityState={{ selected: historyFilter === x }}
            style={[styles.filterPill, historyFilter === x && styles.filterPillActive]}
            onPress={() => setHistoryFilter(x)}
          >
            <Text style={[styles.filterText, historyFilter === x && styles.filterTextActive]}>
              {x}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.helper}>
        {
          sampleJobs.filter(
            (j) =>
              historyFilter === "All" ||
              (historyFilter === "Completed" ? j.status === "Completed" : j.status === "Cancelled"),
          ).length
        }{" "}
        sample {historyFilter === "All" ? "jobs" : historyFilter.toLowerCase() + " jobs"}
      </Text>
      {sampleJobs
        .filter(
          (j) =>
            historyFilter === "All" ||
            (historyFilter === "Completed" ? j.status === "Completed" : j.status === "Cancelled"),
        )
        .map((j) => (
          <Card key={j.id}>
            <View style={styles.rowBetween}>
              <View style={styles.flexOne}>
                <Text style={styles.eyebrow}>JOB REFERENCE</Text>
                <Text style={styles.bodyStrong}>{j.id}</Text>
              </View>
              <Tag
                label={j.status === "Offer" ? "In progress" : j.status}
                tone={
                  j.status === "Completed" ? "green" : j.status === "Cancelled" ? "grey" : "blue"
                }
              />
            </View>
            <View style={styles.divider} />
            <Text style={styles.fieldLabel}>ROUTE</Text>
            <Text style={styles.bodyMuted}>
              {j.pickup} → {j.drop}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.flexOne}>
                <Text style={styles.eyebrow}>DISTANCE</Text>
                <Text style={styles.bodyStrong}>{j.distance}</Text>
                <Text style={styles.helper}>Sample estimate</Text>
              </View>
              <View style={styles.flexOne}>
                <Text style={styles.eyebrow}>TASK TIME</Text>
                <Text style={styles.bodyStrong}>{j.eta}</Text>
                <Text style={styles.helper}>Sample estimate</Text>
              </View>
              <View style={styles.flexOne}>
                <Text style={styles.eyebrow}>PAYOUT</Text>
                <Text style={styles.bodyStrong}>{money(j.payout)}</Text>
                <Text style={styles.helper}>Not payable</Text>
              </View>
            </View>
            <Button
              title="View sample job details"
              secondary
              onPress={() =>
                Alert.alert(
                  "Sample job details",
                  j.id +
                    "\n\nPickup: " +
                    j.pickup +
                    "\nDelivery: " +
                    j.drop +
                    "\nStatus: " +
                    j.status +
                    "\n\nFictional demo data only.",
                )
              }
            />
          </Card>
        ))}
      {sampleJobs.filter(
        (j) =>
          historyFilter === "All" ||
          (historyFilter === "Completed" ? j.status === "Completed" : j.status === "Cancelled"),
      ).length === 0 ? (
        <Card>
          <Text style={styles.cardTitle}>No sample jobs here</Text>
          <Text style={styles.bodyMuted}>
            There are no jobs for the “{historyFilter}” historyFilter in the current sample dataset.
            Select All to see the available examples.
          </Text>
          <Button title="Show all jobs" secondary onPress={() => setHistoryFilter("All")} />
        </Card>
      ) : null}
      <Text style={styles.helper}>
        History is built from fixed local sample data, not a live delivery API. Job details, dates
        and payouts are not verified records.
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
  helper: {
    fontFamily: theme.typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
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
  bodyStrong: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 14,
    fontWeight: "600",
    color: C.ink,
  },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 7 },
  fieldLabel: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginBottom: 7,
  },
  bodyMuted: {
    fontFamily: theme.typography.family.regular,
    fontSize: 13,
    lineHeight: 20,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
  statsRow: { flexDirection: "row", justifyContent: "space-between", gap: 18, marginTop: 8 },
  cardTitle: {
    fontFamily: theme.typography.family.bold,
    fontSize: 16,
    fontWeight: "700",
    color: C.ink,
    marginBottom: 2,
  },
});
