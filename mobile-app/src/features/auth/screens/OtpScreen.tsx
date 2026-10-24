import { useAuth } from "@/features/auth/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { demoConfig } from "@/services/demo/credentials";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { Field } from "@/shared/ui/Field";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { TestHint } from "@/shared/ui/TestHint";
import { useState } from "react";
import { Text } from "react-native";
export function OtpScreen() {
  const { phone, verifyTestOtp } = useAuth();
  const { navigate } = useNavigation();
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState("");
  return (
    <>
      <ScreenHero
        eyebrow="TEST RIDER LOGIN"
        title="Enter this OTP"
        subtitle={"Practice sign-in for +91 " + phone + ". No SMS is sent."}
        icon="shield-check-outline"
      />
      <Card>
        <TestHint
          title={"Enter this OTP: " + demoConfig.demoOtp}
          detail="This public code works only in the local test journey, never with the real API."
        />
        <Field
          label="Test login OTP"
          value={code}
          onChangeText={(value) => {
            setCode(value.replace(/\D/g, "").slice(0, 6));
            setNotice("");
          }}
          placeholder="Enter 123456"
          keyboardType="number-pad"
          maxLength={6}
        />
        {notice ? (
          <Text accessibilityLiveRegion="polite" style={s.error}>
            {notice}
          </Text>
        ) : null}
        <BrandButton
          title="Verify test OTP and continue"
          onPress={() => {
            if (phone !== demoConfig.testPhone) {
              setNotice("Use the displayed test number before verifying this OTP.");
              return;
            }
            if (code !== demoConfig.demoOtp) {
              setNotice("Incorrect test OTP. Enter " + demoConfig.demoOtp + ".");
              return;
            }
            verifyTestOtp(code);
            setCode("");
            navigate("rider-profile");
          }}
        />
        <BrandButton
          title="Fill test OTP"
          secondary
          onPress={() => {
            setCode(demoConfig.demoOtp);
            setNotice("");
          }}
        />
        <BrandButton
          title="Show test OTP again"
          secondary
          onPress={() =>
            setNotice("Test OTP: " + demoConfig.demoOtp + ". No SMS has been requested.")
          }
        />
      </Card>
      <BrandButton title="Change number" secondary onPress={() => navigate("welcome")} />
    </>
  );
}
