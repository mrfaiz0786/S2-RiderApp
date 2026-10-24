import { VehicleSetupView } from "@/features/onboarding/components/VehicleSetupView";
import { sampleDocuments } from "@/features/onboarding/data/fixtures";
import { vehicleDocumentIds } from "@/features/onboarding/data/vehicles";
import { useOnboarding } from "@/features/onboarding/model";
import { sampleDocumentsReady } from "@/features/onboarding/model/reducer";
import { demoConfig } from "@/services/demo/credentials";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { TestHint } from "@/shared/ui/TestHint";
import { Text } from "react-native";
export function VehicleDocumentsScreen() {
  const state = useOnboarding();
  const {
    vehicle,
    setVehicle,
    docStatus,
    setDoc,
    attachSamples,
    checkSampleVehicle,
    vehicleChecked,
  } = state;
  return (
    <>
      <Card>
        <TestHint
          title="Use sample documents only"
          detail="No camera, Aadhaar, PAN, real registration number or personal document is needed. All sample cards are fictional and marked TEST."
        />
        <Text style={s.heading}>Test vehicle: {demoConfig.testVehicle}</Text>
        <Text style={s.body}>
          {vehicle} ·{" "}
          {vehicleChecked ? "Vehicle check passed (simulation)" : "Vehicle check pending"}
        </Text>
        <BrandButton
          title={
            sampleDocumentsReady(state)
              ? "Sample documents attached"
              : "Attach all sample documents"
          }
          disabled={sampleDocumentsReady(state)}
          onPress={attachSamples}
        />
        <BrandButton
          title={vehicleChecked ? "Test vehicle checked" : "Simulate vehicle verification"}
          secondary
          disabled={vehicleChecked}
          onPress={checkSampleVehicle}
        />
        <Text style={s.small}>
          Select a different vehicle below to test its document checklist. Changing the vehicle
          requires a new sample vehicle check.
        </Text>
      </Card>
      <VehicleSetupView
        vehicle={vehicle}
        onVehicleChange={setVehicle}
        documents={sampleDocuments.filter((document) =>
          (vehicleDocumentIds[vehicle] || []).includes(document.id),
        )}
        getStatus={docStatus}
        onSimulateUpload={(id) => setDoc(id, "Sample attached")}
        onPreviewDigital={attachSamples}
      />
    </>
  );
}
