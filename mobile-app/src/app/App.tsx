import "react-native-url-polyfill/auto";
import { appConfig } from "@/config/app";
import { RiderEntryScreen } from "@/features/entry/RiderEntryScreen";
import { SampleRegistrationApp } from "./components/SampleRegistrationApp";
import { LiveRiderApp } from "@/features/live/LiveRiderApp";
import { BrandLoadingScreen } from "@/shared/ui/BrandLoadingScreen";
import { useState } from "react";
import { AppShell } from "./components/AppShell";
import { IntegrationGate } from "./components/IntegrationGate";
import { useAppReady } from "./hooks/useAppReady";
import { AppProviders } from "./providers/AppProviders";

type Entry = "landing" | "login" | "sample-registration";
export function ConnectedEntry() {
  const [entry, setEntry] = useState<Entry>("landing");
  const registrationEnabled = appConfig.environment !== "production";
  if (entry === "login") {
    return (
      <LiveRiderApp
        onBack={() => setEntry("landing")}
        onRegister={() => setEntry(registrationEnabled ? "sample-registration" : "landing")}
      />
    );
  }
  if (entry === "sample-registration" && registrationEnabled) {
    // Unmounting this scope discards every sample profile, document, job and receipt.
    return <SampleRegistrationApp onExit={() => setEntry("landing")} />;
  }
  return (
    <RiderEntryScreen
      onLogin={() => setEntry("login")}
      onRegister={() => setEntry("sample-registration")}
      registrationEnabled={registrationEnabled}
    />
  );
}
function AppBootstrap() {
  const ready = useAppReady();
  if (!ready) return <BrandLoadingScreen />;
  if (appConfig.configurationError) return <IntegrationGate />;
  if (appConfig.dataMode === "api") return <ConnectedEntry />;
  return <AppShell />;
}
export default function App() {
  return (
    <AppProviders>
      <AppBootstrap />
    </AppProviders>
  );
}
