import "react-native-url-polyfill/auto";
import { appConfig } from "@/config/app";
import { LiveRiderApp } from "@/features/live/LiveRiderApp";
import { BrandLoadingScreen } from "@/shared/ui/BrandLoadingScreen";
import { AppShell } from "./components/AppShell";
import { IntegrationGate } from "./components/IntegrationGate";
import { useAppReady } from "./hooks/useAppReady";
import { AppProviders } from "./providers/AppProviders";

function AppBootstrap() {
  const ready = useAppReady();
  if (!ready) return <BrandLoadingScreen />;
  if (appConfig.configurationError) return <IntegrationGate />;
  if (appConfig.dataMode === "api") return <LiveRiderApp />;
  return <AppShell />;
}
export default function App() {
  return (
    <AppProviders>
      <AppBootstrap />
    </AppProviders>
  );
}
