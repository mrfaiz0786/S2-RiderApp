import type { Tone } from "@/shared/theme/screenPalette";
import { sampleDocuments } from "../data/fixtures";
import { vehicleDocumentIds } from "../data/vehicles";
import { previewHubs } from "../data/workAreas";
import type { OnboardingState } from "./reducer";
export function requiredDocuments(vehicle: string) {
  return sampleDocuments.filter((document) =>
    (vehicleDocumentIds[vehicle] || vehicleDocumentIds["Two-Wheeler"]).includes(document.id),
  );
}
export function documentStatus(state: OnboardingState, id: string): string {
  return (
    state.docStates[id] ||
    sampleDocuments.find((document) => document.id === id)?.status ||
    "Not started"
  );
}
export function documentTone(status: string): Tone {
  return status === "Verified" || status === "Approved"
    ? "green"
    : status === "Rejected" || status === "Failed"
      ? "red"
      : ["Pending review", "Processing", "Manual review"].includes(status)
        ? "amber"
        : "grey";
}
export function canContinueFromHub(state: OnboardingState): boolean {
  return Boolean(
    state.workCity && previewHubs(state.workCity).some((hub) => hub.id === state.workHub),
  );
}
export function canSubmitDeclarations(state: OnboardingState): boolean {
  return canContinueFromHub(state) && state.dataAccuracyAccepted && state.termsAccepted;
}
