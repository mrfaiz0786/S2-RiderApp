import { sampleSupportCases } from "@/features/support/data/fixtures";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import { BrandButton as Button } from "@/shared/ui/BrandButton";
import { BrandedAlert as Alert } from "@/shared/ui/BrandDialog";
import { Card } from "@/shared/ui/Card";
import { DetailStrip } from "@/shared/ui/DetailStrip";
import { Field } from "@/shared/ui/Field";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Section } from "@/shared/ui/Section";
import { Tag } from "@/shared/ui/Tag";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function SupportScreen() {
  const [supportQuery, setSupportQuery] = useState("");
  const [supportIssue, setSupportIssue] = useState("");

  return (
    <>
      <ScreenHero
        eyebrow={"HELP CENTER"}
        title={"Help & support"}
        subtitle={"Find answers, review cases or report an issue."}
        icon="lifebuoy"
      />
      <DetailStrip
        icon="lifebuoy"
        title="Support when you need it"
        description="Find common help topics or preview a support request."
      />
      <Field
        label="Search help topics"
        value={supportQuery}
        onChangeText={setSupportQuery}
        placeholder="Try “payment” or “address”"
      />
      <Section title="Common topics">
        {[
          "Delivery not received",
          "Wrong address or recipient unavailable",
          "Payment or COD mismatch",
          "App or network issue",
          "Document verification",
        ]
          .filter((x) => !supportQuery || x.toLowerCase().includes(supportQuery.toLowerCase()))
          .map((x) => (
            <TouchableOpacity
              key={x}
              accessibilityRole="button"
              onPress={() =>
                Alert.alert(
                  x,
                  "This is a demo help article. A real support knowledge base is not connected.",
                )
              }
            >
              <Card>
                <View style={styles.rowBetween}>
                  <View style={styles.flexOne}>
                    <Text style={styles.bodyStrong}>{x}</Text>
                    <Text style={styles.helper}>Sample help article</Text>
                  </View>
                  <Text style={styles.smallBlue}>View ›</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        {[
          "Delivery not received",
          "Wrong address or recipient unavailable",
          "Payment or COD mismatch",
          "App or network issue",
          "Document verification",
        ].filter((x) => !supportQuery || x.toLowerCase().includes(supportQuery.toLowerCase()))
          .length === 0 ? (
          <Card>
            <Text style={styles.cardTitle}>No matching topics</Text>
            <Text style={styles.bodyMuted}>
              Try a shorter search, such as “delivery”, “payment” or “app”.
            </Text>
            <Button title="Clear search" secondary onPress={() => setSupportQuery("")} />
          </Card>
        ) : null}
      </Section>
      <Section title="Sample support cases" right={sampleSupportCases.length + " records"}>
        {sampleSupportCases.map((c) => (
          <Card key={c.id}>
            <View style={styles.rowBetween}>
              <View style={styles.flexOne}>
                <Text style={styles.bodyStrong}>{c.title}</Text>
                <Text style={styles.helper}>Reference: {c.id}</Text>
                <Text style={styles.helper}>Last updated: {c.updated}</Text>
              </View>
              <Tag
                label={c.status}
                tone={c.status === "Resolved" ? "green" : c.status === "Open" ? "amber" : "grey"}
              />
            </View>
          </Card>
        ))}
      </Section>
      <Card>
        <Text style={styles.cardTitle}>Create a support ticket</Text>
        <Text style={styles.bodyMuted}>
          Describe the issue you need help with. This demo will not send the ticket to a support
          team.
        </Text>
        <Field
          label="Issue description"
          value={supportIssue}
          onChangeText={setSupportIssue}
          placeholder="Describe the problem or include a job reference"
        />
        <Button
          title="Submit sample ticket"
          onPress={() => {
            if (!supportIssue.trim()) {
              Alert.alert(
                "Describe your issue",
                "Enter a short description before submitting the sample ticket.",
              );
              return;
            }
            Alert.alert(
              "Demo ticket preview",
              "Your description was not sent or saved to a support system. A real support ticket was not created.",
            );
            setSupportIssue("");
          }}
        />
        <Text style={styles.helper}>
          Ticket creation, case updates and live support are not connected.
        </Text>
      </Card>
    </>
  );
}
const styles = createBrandedStyles({
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginVertical: 6,
  },
  flexOne: { flex: 1 },
  bodyStrong: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 14,
    fontWeight: "600",
    color: C.ink,
  },
  helper: {
    fontFamily: theme.typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
  smallBlue: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 13,
    fontWeight: "700",
    color: C.blue,
  },
  cardTitle: {
    fontFamily: theme.typography.family.bold,
    fontSize: 16,
    fontWeight: "700",
    color: C.ink,
    marginBottom: 2,
  },
  bodyMuted: {
    fontFamily: theme.typography.family.regular,
    fontSize: 13,
    lineHeight: 20,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
});
