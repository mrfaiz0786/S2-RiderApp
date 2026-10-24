import { appConfig } from "@/config/app";
import { BrandLoadingScreen } from "@/shared/ui/BrandLoadingScreen";
import { AppShell } from "./components/AppShell";
import { IntegrationGate } from "./components/IntegrationGate";
import { useAppReady } from "./hooks/useAppReady";
import { AppProviders } from "./providers/AppProviders";

function AppBootstrap() {
  const ready = useAppReady();
  if (!ready) return <BrandLoadingScreen />;
  if (appConfig.configurationError || appConfig.dataMode !== "mock") return <IntegrationGate />;
  return <AppShell />;
}
export default function App() {
  return (
    <AppProviders>
      <AppBootstrap />
    </AppProviders>
  );
}
