import { useOnboarding } from "@/features/onboarding/model";
import { sampleReviewReady } from "@/features/onboarding/model/reducer";
import { useNavigation } from "@/navigation/NavigationProvider";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { OnboardingProgress } from "@/shared/ui/OnboardingProgress";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Pressable, Text } from "react-native";
export function DeclarationsScreen() {
  const state = useOnboarding();
  const { navigate } = useNavigation();
  const ready = sampleReviewReady(state);
  return (
    <>
      <ScreenHero
        eyebrow="TEST SETUP · FINAL STEP"
        title="Confirm this is a test"
        subtitle="These are simulator confirmations, not a real legal declaration or KYC submission."
        icon="file-document-outline"
      />
      <OnboardingProgress current={5} />
      <Card>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel="Confirm fictional sample information"
          accessibilityState={{ checked: state.dataAccuracyAccepted }}
          style={[s.pill, state.dataAccuracyAccepted && s.selected]}
          onPress={() => state.setDataAccuracyAccepted((value) => !value)}
        >
          <Text style={s.body}>
            {state.dataAccuracyAccepted ? "☑" : "☐"} I am using fictional sample information and
            sample documents, not a real person's identity.
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel="Confirm simulation only"
          accessibilityState={{ checked: state.termsAccepted }}
          style={[s.pill, state.termsAccepted && s.selected]}
          onPress={() => state.setTermsAccepted((value) => !value)}
        >
          <Text style={s.body}>
            {state.termsAccepted ? "☑" : "☐"} I understand verification, orders, payments and
            earnings are simulated. No real service is requested.
          </Text>
        </Pressable>
        <BrandButton
          title="Submit sample setup for test verification"
          disabled={!ready}
          onPress={() => {
            state.startSampleReview();
            navigate("verification-status");
          }}
        />
        {!ready ? (
          <Text style={s.small}>
            Attach the required sample documents, check your vehicle, select a city/hub and tick
            both confirmations.
          </Text>
        ) : null}
        <BrandButton
          title="Review sample documents"
          secondary
          onPress={() => navigate("vehicle-documents")}
        />
        <BrandButton title="Review starting hub" secondary onPress={() => navigate("work-hub")} />
      </Card>
    </>
  );
}
