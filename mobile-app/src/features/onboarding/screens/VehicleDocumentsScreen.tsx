import { VehicleSetupView } from "@/features/onboarding/components/VehicleSetupView";
import { sampleDocuments } from "@/features/onboarding/data/fixtures";
import { vehicleDocumentIds } from "@/features/onboarding/data/vehicles";
import { useOnboarding } from "@/features/onboarding/model";

export function VehicleDocumentsScreen() {
  const { vehicle, setVehicle, docStatus, setDoc, setDigilocker } = useOnboarding();

  return (
    <VehicleSetupView
      vehicle={vehicle}
      onVehicleChange={setVehicle}
      documents={sampleDocuments.filter((d) =>
        (vehicleDocumentIds[vehicle] || vehicleDocumentIds["Two-Wheeler"]).includes(d.id),
      )}
      getStatus={docStatus}
      onSimulateUpload={(id) => setDoc(id, "Pending review")}
      onPreviewDigital={() => {
        setDigilocker(true);
        (vehicleDocumentIds[vehicle] || []).forEach((id) => setDoc(id, "Manual review"));
      }}
    />
  );
}
