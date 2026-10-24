import { BrandLoadingScreen } from "@/shared/ui/BrandLoadingScreen";
import { AppShell } from "./components/AppShell";
import { useAppReady } from "./hooks/useAppReady";
import { AppProviders } from "./providers/AppProviders";
function AppBootstrap() {
  const ready = useAppReady();
  return ready ? <AppShell /> : <BrandLoadingScreen />;
}
export default function App() {
  return (
    <AppProviders>
      <AppBootstrap />
    </AppProviders>
  );
}
