import { sampleJobs } from "@/features/delivery/data/fixtures";
import { useDelivery } from "@/features/delivery/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { demoConfig } from "@/services/demo/credentials";
import { useFeedback } from "@/shared/state/FeedbackProvider";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandButton as Button } from "@/shared/ui/BrandButton";
import { BrandedAlert as Alert } from "@/shared/ui/BrandDialog";
import { Card } from "@/shared/ui/Card";
import { Field } from "@/shared/ui/Field";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Tag } from "@/shared/ui/Tag";
import { useState } from "react";
import { Text, View } from "react-native";

export function DeliveryCompletionScreen() {
  const { pickupDone, deliveryDone, completeDelivery } = useDelivery();
  const [pin, setPin] = useState("");
  const { navigate: go } = useNavigation();
  const { setDemoNotice } = useFeedback();
  return (
    <>
      <ScreenHero
        eyebrow={"DELIVERY CONFIRMATION"}
        title={deliveryDone ? "Delivery completed" : "Complete delivery"}
        subtitle={
          deliveryDone
            ? "Your sample delivery is marked complete."
            : "Confirm the handover using the recipient PIN."
        }
        icon="check-circle-outline"
      />
      <Card>
        <View style={styles.rowBetween}>
          <View style={styles.flexOne}>
            <Text style={styles.eyebrow}>JOB REFERENCE</Text>
            <Text style={styles.cardTitle}>{sampleJobs[0].id}</Text>
          </View>
          <Tag
            label={deliveryDone ? "DEMO COMPLETE" : "AWAITING PIN"}
            tone={deliveryDone ? "green" : "amber"}
          />
        </View>
        <View style={styles.divider} />
        {deliveryDone ? (
          <>
            <View style={styles.statusHero}>
              <AppIcon name="check-circle-outline" size={28} color={C.green} />
              <Text style={styles.cardTitle}>Sample delivery completed</Text>
            </View>
            <Text style={styles.bodyMuted}>
              This is a local success state only. No recipient was contacted and no backend delivery
              record was created.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.fieldLabel}>RECIPIENT OTP / PIN</Text>
            <Field
              label="6-digit test PIN"
              value={pin}
              onChangeText={(v) => setPin(v.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter recipient PIN"
              keyboardType="number-pad"
              maxLength={6}
            />
            <Text style={styles.helper}>Demo PIN: 654321 · This is not a real customer code.</Text>
            <Button
              disabled={!pickupDone || deliveryDone}
              title="Verify PIN & complete demo"
              onPress={() => {
                if (pin.length !== 6) {
                  Alert.alert("Enter the full PIN", "Please enter all 6 digits before continuing.");
                  return;
                }
                if (pin === demoConfig.deliveryPin && pickupDone) {
                  completeDelivery();
                  setPin("");
                  setDemoNotice(
                    "Demo delivery completed locally. No server-side PIN verification occurred.",
                  );
                } else {
                  Alert.alert(
                    "PIN not accepted",
                    "The entered PIN does not match the local demo PIN. No delivery status was changed.",
                  );
                }
              }}
            />
          </>
        )}
        <Button title="Report recipient unavailable" secondary onPress={() => go("support")} />
        <Text style={styles.helper}>
          Production requires server-side PIN validation and any required proof-of-delivery checks
          before completing a real order.
        </Text>
      </Card>
      {deliveryDone ? (
        <>
          <Card>
            <Text style={styles.cardTitle}>What’s next?</Text>
            <Text style={styles.bodyMuted}>
              Review the illustrative earnings summary for this sample job.
            </Text>
            <Button title="View earnings →" onPress={() => go("earnings")} />
            <Button title="Back to rider home" secondary onPress={() => go("home")} />
          </Card>
        </>
      ) : null}
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
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: C.blue,
    marginBottom: 7,
    marginTop: 2,
  },
  cardTitle: {
    fontFamily: theme.typography.family.bold,
    fontSize: 16,
    fontWeight: "700",
    color: C.ink,
    marginBottom: 2,
  },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 7 },
  statusHero: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
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
  helper: {
    fontFamily: theme.typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
});
