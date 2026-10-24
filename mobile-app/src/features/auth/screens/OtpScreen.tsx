import { useAuth } from "@/features/auth/model";
import { sampleRider } from "@/features/profile/data/fixtures";
import { useNavigation } from "@/navigation/NavigationProvider";
import { demoConfig } from "@/services/demo/credentials";
import { alertDemo } from "@/shared/lib/demoFeedback";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { C } from "@/shared/theme/screenPalette";
import { BrandButton as Button } from "@/shared/ui/BrandButton";
import { BrandedAlert as Alert } from "@/shared/ui/BrandDialog";
import { Card } from "@/shared/ui/Card";
import { Field } from "@/shared/ui/Field";
import { OnboardingProgress } from "@/shared/ui/OnboardingProgress";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { useState } from "react";
import { Text } from "react-native";

export function OtpScreen() {
  const { phone } = useAuth();
  const [otp, setOtp] = useState("");
  const { navigate: go } = useNavigation();
  return (
    <>
      <ScreenHero
        eyebrow={"SECURE SIGN IN"}
        title={"Verify your number"}
        subtitle={
          "Enter the 6-digit code for " +
          (phone ? "+91 ******" + phone.replace(/\D/g, "").slice(-4) : sampleRider.phone) +
          "."
        }
        icon="shield-check-outline"
        compact
      />
      <OnboardingProgress current={1} total={10} />
      <Card>
        <Text style={styles.cardTitle}>Check your code</Text>
        <Text style={styles.bodyMuted}>
          Type the 6-digit demo code to continue to your rider profile.
        </Text>
        <Field
          label="One-time password"
          required
          value={otp}
          onChangeText={(s) => setOtp(s.replace(/[^0-9]/g, "").slice(0, 6))}
          placeholder="Enter 6-digit code"
          keyboardType="number-pad"
          maxLength={6}
        />
        <Text style={styles.helper}>
          {otp.length}/6 digits · Demo code: use the test OTP in mobile-app/README.md.
        </Text>
        <Button
          title="Verify and continue →"
          onPress={() => {
            if (otp.length !== 6) {
              Alert.alert("Code incomplete", "Enter all 6 digits of the demo code.");
              return;
            }
            if (otp === demoConfig.demoOtp) {
              go("rider-profile");
              setOtp("");
            } else
              Alert.alert(
                "Code not accepted",
                "The code does not match the local demo OTP. Check mobile-app/README.md and try again.",
              );
          }}
        />
        <Button
          title="Resend code"
          secondary
          onPress={() => {
            setOtp("");
            alertDemo("OTP resend");
          }}
        />
        <Text style={styles.helper}>
          Never share an OTP with anyone. Real SMS delivery is not connected.
        </Text>
      </Card>
    </>
  );
}
const styles = createBrandedStyles({
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
  helper: {
    fontFamily: theme.typography.family.regular,
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    marginTop: 2,
    flexShrink: 1,
  },
});
