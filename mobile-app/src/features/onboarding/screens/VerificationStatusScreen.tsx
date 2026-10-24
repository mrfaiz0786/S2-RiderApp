import { sampleDocuments } from "@/features/onboarding/data/fixtures";
import { vehicleDocumentIds } from "@/features/onboarding/data/vehicles";
import { workCityName } from "@/features/onboarding/data/workAreas";
import { useOnboarding } from "@/features/onboarding/model";
import { sampleReviewReady } from "@/features/onboarding/model/reducer";
import { useNavigation } from "@/navigation/NavigationProvider";
import { demoConfig } from "@/services/demo/credentials";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { TestHint } from "@/shared/ui/TestHint";
import { useEffect } from "react";
import { ActivityIndicator, Text } from "react-native";
export function VerificationStatusScreen() {
  const state = useOnboarding();
  const { navigate } = useNavigation();
  const { sampleReview, finishSampleReview } = state;
  useEffect(() => {
    if (sampleReview !== "reviewing") return;
    const timer = setTimeout(finishSampleReview, 1600);
    return () => clearTimeout(timer);
  }, [sampleReview, finishSampleReview]);
  const approved = sampleReview === "test_approved";
  return (
    <>
      <ScreenHero
        eyebrow="SAMPLE VERIFICATION"
        title={approved ? "Test rider is ready" : "Verify your test setup"}
        subtitle="A local review simulation, not government KYC or real rider approval."
        icon="shield-check-outline"
      />
      <Card>
        <TestHint
          title={
            approved ? "TEST APPROVED · simulation only" : "Sample document and vehicle review"
          }
          detail="No external verification service is contacted."
        />
        <Row label="Rider" value={demoConfig.testRiderName} />
        <Row label="Vehicle" value={state.vehicle} />
        <Row label="Registration" value={demoConfig.testVehicle} />
        <Row label="City" value={workCityName(state.workCity)} />
        {sampleDocuments
          .filter((doc) => (vehicleDocumentIds[state.vehicle] || []).includes(doc.id))
          .map((doc) => (
            <Row key={doc.id} label={doc.name} value={state.docStatus(doc.id)} />
          ))}
        <Row label="Vehicle check" value={state.vehicleChecked ? "Test passed" : "Pending"} />
        {sampleReview === "reviewing" ? (
          <>
            <ActivityIndicator />
            <Text accessibilityLiveRegion="polite" style={s.body}>
              Checking sample documents and vehicle...
            </Text>
          </>
        ) : null}
        {!approved && sampleReview !== "reviewing" ? (
          <BrandButton
            title="Run sample review"
            disabled={!sampleReviewReady(state)}
            onPress={state.startSampleReview}
          />
        ) : null}
        {approved ? (
          <BrandButton title="Continue to test rider home" onPress={() => navigate("home")} />
        ) : null}
        {!sampleReviewReady(state) ? (
          <>
            <Text style={s.error}>
              Attach all sample documents, check the vehicle, choose a city/hub, and confirm the
              test declarations.
            </Text>
            <BrandButton
              title="Review test documents"
              secondary
              onPress={() => navigate("vehicle-documents")}
            />
            <BrandButton
              title="Review city and declarations"
              secondary
              onPress={() => navigate("work-city")}
            />
          </>
        ) : null}
      </Card>
    </>
  );
}
