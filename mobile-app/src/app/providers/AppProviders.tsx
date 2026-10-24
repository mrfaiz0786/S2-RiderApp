import { appConfig } from "@/config/app";
import { AuthProvider } from "@/features/auth/model";
import { DeliveryProvider } from "@/features/delivery/model";
import { NotificationsProvider } from "@/features/notifications/model";
import { OnboardingProvider } from "@/features/onboarding/model";
import { ProfileProvider } from "@/features/profile/model";
import { NavigationProvider } from "@/navigation/NavigationProvider";
import { FeedbackProvider } from "@/shared/state/FeedbackProvider";
import { SessionResetProvider, useSessionLifecycle } from "@/shared/state/SessionResetProvider";
import { BrandDialogProvider } from "@/shared/ui/BrandDialog";
import { BrandMotionProvider } from "@/shared/ui/BrandMotion";
import { type ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppErrorBoundary } from "../components/AppErrorBoundary";
function FeatureProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <OnboardingProvider>
          <DeliveryProvider>
            <NotificationsProvider>
              <FeedbackProvider>
                <NavigationProvider>
                  <BrandDialogProvider>{children}</BrandDialogProvider>
                </NavigationProvider>
              </FeedbackProvider>
            </NotificationsProvider>
          </DeliveryProvider>
        </OnboardingProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
function SessionScope({ children }: { children: ReactNode }) {
  const { epoch } = useSessionLifecycle();
  return <FeatureProviders key={epoch}>{children}</FeatureProviders>;
}
/** Fresh demo state is scoped to the registration walkthrough, never the real rider session. */
export function DemoFeatureScope({ children }: { children: ReactNode }) {
  return (
    <SessionResetProvider>
      <SessionScope>{children}</SessionScope>
    </SessionResetProvider>
  );
}
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <BrandMotionProvider>
          {appConfig.dataMode === "api" ? (
            children
          ) : (
            <DemoFeatureScope>{children}</DemoFeatureScope>
          )}
        </BrandMotionProvider>
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}
