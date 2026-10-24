import { AppShell } from "@/app/components/AppShell";
import { DemoFeatureScope } from "@/app/providers/AppProviders";
import { useAuth } from "@/features/auth/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { DemoJourneyModeProvider } from "@/shared/state/DemoJourneyMode";
import { BrandLoadingScreen } from "@/shared/ui/BrandLoadingScreen";
import { useEffect, useRef } from "react";

function BeginRegistration({ onExit }: { onExit: () => void }) {
  const { beginSampleRegistration, testSignedIn } = useAuth();
  const { navigate } = useNavigation();
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    beginSampleRegistration();
    navigate("rider-profile");
  }, [beginSampleRegistration, navigate]);
  if (!testSignedIn) return <BrandLoadingScreen />;
  return <AppShell onExit={onExit} />;
}

/** No API requests, no AsyncStorage persistence, no external identity verification. */
export function SampleRegistrationApp({ onExit }: { onExit: () => void }) {
  return (
    <DemoJourneyModeProvider>
      <DemoFeatureScope>
        <BeginRegistration onExit={onExit} />
      </DemoFeatureScope>
    </DemoJourneyModeProvider>
  );
}
