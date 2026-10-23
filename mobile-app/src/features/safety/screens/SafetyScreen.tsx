import { useFeedback } from "@/shared/state/FeedbackProvider";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandButton as Button } from "@/shared/ui/BrandButton";
import { BrandedAlert as Alert } from "@/shared/ui/BrandDialog";
import { Card } from "@/shared/ui/Card";
import { DetailStrip } from "@/shared/ui/DetailStrip";
import { Field } from "@/shared/ui/Field";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
export function SafetyScreen() {
  const [incidentText, setIncidentText] = useState("");
  const [incidentCategory, setIncidentCategory] = useState("Road safety");
  const { demoNotice, setDemoNotice } = useFeedback();
  return (
    <>
      <ScreenHero
        eyebrow={"RIDER SAFETY"}
        title={"Safety & incidents"}
        subtitle={"Get guidance and preview incident reporting tools."}
        icon="alert-outline"
      />
      <DetailStrip
        icon="alert-outline"
        title="Emergency support is not connected"
        description="If you are in immediate danger, contact local emergency services directly."
        tone="red"
      />
      <Card tone="amber">
        <View style={styles.sosCircle}>
          <AppIcon name="alert-outline" size={38} color={C.red} />
        </View>
        <Text style={styles.cardTitle}>Emergency assistance</Text>
        <Text style={styles.bodyMuted}>
          If you are in immediate danger, contact local emergency services directly. This prototype
          cannot call for help, share your location, or alert Build Your Mart operations.
        </Text>
        <Button
          title="Test SOS interaction (demo only)"
          danger
          onPress={() =>
            Alert.alert("SOS demo only", "No call, location share, or dispatch has occurred.", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Acknowledge demo",
                onPress: () =>
                  setDemoNotice(
                    "SOS interaction tested locally only. No emergency alert was sent.",
                  ),
              },
            ])
          }
        />
      </Card>
      <Card>
        <Text style={styles.cardTitle}>Report an incident</Text>
        <Text style={styles.bodyMuted}>
          Choose the category that best describes the issue, then provide a short description.
        </Text>
        <Text style={styles.fieldLabel}>INCIDENT CATEGORY</Text>
        <View style={styles.choiceWrap}>
          {["Road safety", "Customer issue", "Vehicle problem", "Other"].map((x) => (
            <TouchableOpacity
              key={x}
              accessibilityRole="button"
              accessibilityState={{ selected: incidentCategory === x }}
              style={[styles.choice, incidentCategory === x && styles.choiceSelected]}
              onPress={() => setIncidentCategory(x)}
            >
              <Text
                style={[styles.choiceText, incidentCategory === x && styles.choiceTextSelected]}
              >
                {incidentCategory === x ? "✓  " : ""}
                {x}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Field
          label="Incident description"
          value={incidentText}
          onChangeText={setIncidentText}
          placeholder="What happened? Avoid including unnecessary sensitive details."
        />
        <Button
          title="Save sample incident report"
          onPress={() => {
            if (!incidentText.trim()) {
              Alert.alert(
                "Describe the incident",
                "Enter a short description before saving the demo report.",
              );
              return;
            }
            Alert.alert(
              "Demo report preview",
              "Your incident description was not sent to or saved by an operations team.",
            );
            setDemoNotice("Incident report previewed locally. No real report was submitted.");
            setIncidentText("");
          }}
        />
        <Text style={styles.helper}>
          Incident category and description are not uploaded or saved to a backend.
        </Text>
      </Card>
      {demoNotice ? <Text style={styles.notice}>{demoNotice}</Text> : null}
    </>
  );
}
const styles = createBrandedStyles({
  sosCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: C.paleRed,
    borderWidth: 2,
    borderColor: C.red,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 8,
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
  fieldLabel: {
    fontFamily: theme.typography.family.semibold,
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginBottom: 7,
  },
  choiceWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  choice: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 48,
    justifyContent: "center",
  },
  choiceSelected: { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.primary },
  choiceText: { fontSize: 13, color: C.muted, fontWeight: "600" },
  choiceTextSelected: { color: C.blue },
  helper: {
    fontFamily: theme.typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
  notice: {
    padding: 12,
    backgroundColor: C.paleAmber,
    borderRadius: 10,
    color: C.amber,
    fontSize: 12,
    marginTop: 10,
  },
});
