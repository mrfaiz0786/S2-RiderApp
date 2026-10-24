import { useState } from "react";
import { Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Field } from "@/shared/ui/Field";
import { theme } from "@/shared/theme";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import type { LoginResponse } from "@/services/legacy/contracts";
import type { LegacyRiderApi } from "@/services/legacy/client";
import { explainLegacyError } from "@/services/legacy/errors";

type Props = {
  api: LegacyRiderApi;
  onLogin: (result: LoginResponse) => Promise<void>;
  onRegister: () => void;
};
export function LiveLogin({ api, onLogin, onRegister }: Props) {
  const [phone, setPhone] = useState("");
  const [secret, setSecret] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [method, setMethod] = useState<"PASSWORD" | "OTP">("PASSWORD");
  const [requested, setRequested] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const validPhone = /^[0-9]{10}$/.test(phone.trim());

  async function requestOtp() {
    if (!validPhone || working) return;
    setWorking(true);
    setError("");
    setNotice("");
    try {
      const response = await api.requestOtp(phone.trim());
      if (!response.ok) setError(explainLegacyError(response.error, Platform.OS === "web"));
      else {
        setRequested(true);
        setNotice("OTP requested. Enter the code sent by the authentication service.");
      }
    } catch {
      setError("Unable to request an OTP. Try again.");
    } finally {
      setWorking(false);
    }
  }
  async function signIn() {
    if (!validPhone || !secret.trim() || working || (method === "OTP" && !requested)) return;
    Keyboard.dismiss();
    setWorking(true);
    setError("");
    setNotice("");
    try {
      const response =
        method === "PASSWORD"
          ? await api.loginPassword(phone.trim(), secret)
          : await api.loginOtp(phone.trim(), secret.trim());
      if (!response.ok) setError(explainLegacyError(response.error, Platform.OS === "web"));
      else await onLogin(response.data);
    } catch {
      setError(
        "The sign-in response was received but the session could not be started. Please try again.",
      );
    } finally {
      setWorking(false);
    }
  }
  return (
    <>
      <ScreenHero
        eyebrow="YBM RIDER · CONNECTED MODE"
        title="Welcome back"
        subtitle="Existing riders: use the credentials provided by your operations team. No test OTP works here."
        icon="account-check-outline"
      />
      {Platform.OS === "web" ? (
        <Card tone="amber">
          <Text style={s.heading}>Browser testing notice</Text>
          <Text style={s.body}>
            This app is running from your local web origin. The test backend currently allows the
            old admin website but rejects localhost:8081 during CORS preflight. Only the backend
            team can allow your development origin.
          </Text>
          <Text style={s.small}>
            Web test sessions are kept in memory only. Refreshing the page signs you out; real
            Android/iOS sessions use secure device storage.
          </Text>
        </Card>
      ) : null}
      <Card>
        <Text style={s.heading}>Rider sign in</Text>
        <Field
          label="Registered 10-digit mobile number"
          value={phone}
          onChangeText={(value) => {
            setPhone(value.replace(/\D/g, "").slice(0, 10));
            setSecret("");
            setShowPassword(false);
            setRequested(false);
            setError("");
            setNotice("");
          }}
          keyboardType="phone-pad"
          maxLength={10}
          placeholder="Mobile registered with operations"
        />
        <BrandButton
          title={method === "PASSWORD" ? "Use OTP instead" : "Use password instead"}
          secondary
          onPress={() => {
            setMethod(method === "PASSWORD" ? "OTP" : "PASSWORD");
            setSecret("");
            setShowPassword(false);
            setRequested(false);
            setError("");
            setNotice("");
          }}
        />
        {method === "OTP" ? (
          <BrandButton
            title={requested ? "Request another OTP" : "Request login OTP"}
            secondary
            disabled={!validPhone || working}
            loading={working}
            onPress={() => void requestOtp()}
          />
        ) : null}
        {method === "PASSWORD" || requested ? (
          <>
            <Text style={s.small}>
              {method === "OTP" ? "Enter the OTP from your SMS" : "Password"}
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                accessibilityLabel={method === "OTP" ? "Login OTP" : "Password"}
                value={secret}
                onChangeText={(value) =>
                  setSecret(method === "OTP" ? value.replace(/\D/g, "").slice(0, 10) : value)
                }
                secureTextEntry={method === "OTP" || !showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={method === "OTP" ? "number-pad" : "default"}
                maxLength={method === "OTP" ? 10 : 100}
                style={[styles.passwordInput, method === "PASSWORD" && styles.passwordInputWithEye]}
              />
              {method === "PASSWORD" ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  accessibilityHint="Toggles password visibility"
                  onPress={() => setShowPassword((visible) => !visible)}
                  hitSlop={8}
                  style={styles.eyeButton}
                >
                  <AppIcon
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={23}
                    color={theme.colors.primary}
                  />
                </Pressable>
              ) : null}
            </View>
          </>
        ) : null}
        {error ? (
          <Text accessibilityRole="alert" style={s.error}>
            {error}
          </Text>
        ) : null}
        {notice ? (
          <Text accessibilityLiveRegion="polite" style={s.success}>
            {notice}
          </Text>
        ) : null}
        <BrandButton
          title="Sign in"
          loading={working}
          disabled={!validPhone || !secret.trim() || (method === "OTP" && !requested)}
          onPress={() => void signIn()}
        />
        <Text style={s.small}>
          Only accounts with the server-issued ROLE_RIDER role can access assignments.
        </Text>
      </Card>
      <Card tone="amber">
        <Text style={s.heading}>New to YBM? Preview registration</Text>
        <Text style={s.body}>
          Try the old sample rider onboarding with fictional documents, vehicle checks, and practice
          orders. Nothing is submitted or saved and this does not create a real rider account.
        </Text>
        <BrandButton title="Try sample registration" secondary onPress={onRegister} />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.borderStrong,
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 15,
    color: theme.colors.text,
    fontSize: 16,
  },
  passwordInputWithEye: {
    paddingRight: 62,
  },
  eyeButton: {
    position: "absolute",
    right: 4,
    width: 48,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
});
