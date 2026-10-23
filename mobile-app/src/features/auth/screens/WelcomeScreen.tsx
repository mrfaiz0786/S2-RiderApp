import { WelcomeView } from "@/features/auth/components/WelcomeView";
import { useAuth } from "@/features/auth/model";
import { useProfile } from "@/features/profile/model";
import { useNavigation } from "@/navigation/NavigationProvider";

export function WelcomeScreen() {
  const { phone, setPhone } = useAuth();
  const { language, setLanguage } = useProfile();
  const { navigate: go } = useNavigation();
  return (
    <WelcomeView
      phone={phone}
      onPhoneChange={setPhone}
      language={language}
      onLanguageChange={setLanguage}
      onContinue={() => go("otp")}
    />
  );
}
