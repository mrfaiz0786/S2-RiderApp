import { OtpScreen } from "@/features/auth/screens/OtpScreen";
import { WelcomeScreen } from "@/features/auth/screens/WelcomeScreen";
import { ActiveJobScreen } from "@/features/delivery/screens/ActiveJobScreen";
import { DeliveryCompletionScreen } from "@/features/delivery/screens/DeliveryCompletionScreen";
import { DeliveryNavigationScreen } from "@/features/delivery/screens/DeliveryNavigationScreen";
import { OffersScreen } from "@/features/delivery/screens/OffersScreen";
import { PickupScreen } from "@/features/delivery/screens/PickupScreen";
import { EarningsScreen } from "@/features/earnings/screens/EarningsScreen";
import { PayoutsScreen } from "@/features/earnings/screens/PayoutsScreen";
import { HistoryScreen } from "@/features/history/screens/HistoryScreen";
import { HomeScreen } from "@/features/home/screens/HomeScreen";
import { NotificationsScreen } from "@/features/notifications/screens/NotificationsScreen";
import { DeclarationsScreen } from "@/features/onboarding/screens/DeclarationsScreen";
import { RiderProfileScreen } from "@/features/onboarding/screens/RiderProfileScreen";
import { VehicleDocumentsScreen } from "@/features/onboarding/screens/VehicleDocumentsScreen";
import { VerificationStatusScreen } from "@/features/onboarding/screens/VerificationStatusScreen";
import { WorkCityScreen } from "@/features/onboarding/screens/WorkCityScreen";
import { WorkHubScreen } from "@/features/onboarding/screens/WorkHubScreen";
import {
  IdentityScreen,
  DocumentCheckScreen,
  SelfieBankScreen,
  TrainingScreen,
} from "@/features/onboarding/screens/VerificationSteps";
import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";
import { SafetyScreen } from "@/features/safety/screens/SafetyScreen";
import { SupportScreen } from "@/features/support/screens/SupportScreen";
import { type ComponentType } from "react";
import type { RouteName } from "./routes";
// The Record makes missing or misspelled routes a compile-time error.
export const screenRegistry: Record<RouteName, ComponentType> = {
  welcome: WelcomeScreen,
  otp: OtpScreen,
  "rider-profile": RiderProfileScreen,
  "vehicle-documents": VehicleDocumentsScreen,
  "work-city": WorkCityScreen,
  "work-hub": WorkHubScreen,
  identity: IdentityScreen,
  "document-check": DocumentCheckScreen,
  "selfie-bank": SelfieBankScreen,
  declarations: DeclarationsScreen,
  "verification-status": VerificationStatusScreen,
  training: TrainingScreen,
  home: HomeScreen,
  offers: OffersScreen,
  "active-job": ActiveJobScreen,
  pickup: PickupScreen,
  "delivery-navigation": DeliveryNavigationScreen,
  "delivery-completion": DeliveryCompletionScreen,
  earnings: EarningsScreen,
  payouts: PayoutsScreen,
  history: HistoryScreen,
  notifications: NotificationsScreen,
  support: SupportScreen,
  safety: SafetyScreen,
  profile: ProfileScreen,
};
export function ScreenRenderer({ route }: { route: RouteName }) {
  const Screen = screenRegistry[route];
  return <Screen />;
}
