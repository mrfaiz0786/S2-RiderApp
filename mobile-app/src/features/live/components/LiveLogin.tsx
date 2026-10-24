import { useState } from "react";
import { Keyboard, Text, TextInput } from "react-native";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Field } from "@/shared/ui/Field";
import { theme } from "@/shared/theme";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import type { LoginResponse } from "@/services/legacy/contracts";
import type { LegacyRiderApi } from "@/services/legacy/client";

type Props = {
  api: LegacyRiderApi;
  onLogin: (result: LoginResponse) => Promise<void>;
  onRegister: () => void;
};
export function LiveLogin({ api, onLogin, onRegister }: Props) {
  const [phone, setPhone] = useState("");
  const [secret, setSecret] = useState("");
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
      if (!response.ok) setError(response.error.message);
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
      if (!response.ok) setError(response.error.message);
      else await onLogin(response.data);
    } catch {
      setError("Could not save the login securely. Use a supported native device.");
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
      <Card>
        <Text style={s.heading}>Rider sign in</Text>
        <Field
          label="Registered 10-digit mobile number"
          value={phone}
          onChangeText={(value) => {
            setPhone(value.replace(/\D/g, "").slice(0, 10));
            setSecret("");
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
            <TextInput
              accessibilityLabel={method === "OTP" ? "Login OTP" : "Password"}
              value={secret}
              onChangeText={(value) =>
                setSecret(method === "OTP" ? value.replace(/\D/g, "").slice(0, 10) : value)
              }
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={method === "OTP" ? "number-pad" : "default"}
              maxLength={method === "OTP" ? 10 : 100}
              style={{
                backgroundColor: theme.colors.surfaceRaised,
                borderColor: theme.colors.borderStrong,
                borderWidth: 1,
                borderRadius: 14,
                minHeight: 52,
                paddingHorizontal: 15,
                color: theme.colors.text,
                fontSize: 16,
              }}
            />
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
        <Text style={s.heading}>New to YBM? Become a rider</Text>
        <Text style={s.body}>
          Public registration and document review are being added to the existing rider system. You
          can view the upcoming steps without creating a fake account.
        </Text>
        <BrandButton title="View public registration steps" secondary onPress={onRegister} />
      </Card>
    </>
  );
}
