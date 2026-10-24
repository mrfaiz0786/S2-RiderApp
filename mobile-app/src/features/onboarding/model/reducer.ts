import { previewHubs, workCities } from "../data/workAreas";
import { vehicleDocumentIds } from "../data/vehicles";
export type OnboardingState = {
  vehicle: string;
  workCity: string;
  workHub: string;
  docStates: Record<string, string>;
  digilocker: boolean;
  dataAccuracyAccepted: boolean;
  termsAccepted: boolean;
  sampleReview: "not_started" | "reviewing" | "test_approved";
  vehicleChecked: boolean;
};
export type BooleanUpdate = boolean | ((previous: boolean) => boolean);
export type OnboardingAction =
  | { type: "vehicleChanged" | "cityChanged" | "hubChanged"; value: string }
  | { type: "documentChanged"; id: string; status: string }
  | { type: "digitalPreviewed" | "accuracyChanged" | "termsChanged"; value: BooleanUpdate }
  | {
      type:
        "attachSampleDocuments" | "checkSampleVehicle" | "startSampleReview" | "finishSampleReview";
    };
export const initialOnboardingState: OnboardingState = {
  vehicle: "Two-Wheeler",
  workCity: "",
  workHub: "",
  docStates: {},
  digilocker: false,
  dataAccuracyAccepted: false,
  termsAccepted: false,
  sampleReview: "not_started",
  vehicleChecked: false,
};
const resolve = (value: BooleanUpdate, previous: boolean) =>
  typeof value === "function" ? value(previous) : value;
export function sampleDocumentsReady(state: OnboardingState): boolean {
  const ids = vehicleDocumentIds[state.vehicle];
  return Boolean(
    ids?.length &&
    ids.every((id) => ["Sample attached", "Test verified"].includes(state.docStates[id])),
  );
}
export function sampleReviewReady(state: OnboardingState): boolean {
  return (
    sampleDocumentsReady(state) &&
    state.vehicleChecked &&
    state.dataAccuracyAccepted &&
    state.termsAccepted &&
    previewHubs(state.workCity).some((hub) => hub.id === state.workHub)
  );
}
export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction,
): OnboardingState {
  switch (action.type) {
    case "vehicleChanged":
      if (!vehicleDocumentIds[action.value] || action.value === state.vehicle) return state;
      return {
        ...state,
        vehicle: action.value,
        vehicleChecked: false,
        sampleReview: "not_started",
      };
    case "cityChanged":
      if (action.value && !workCities.some((city) => city.id === action.value)) return state;
      return action.value === state.workCity
        ? state
        : { ...state, workCity: action.value, workHub: "", sampleReview: "not_started" };
    case "hubChanged":
      return !action.value || previewHubs(state.workCity).some((hub) => hub.id === action.value)
        ? {
            ...state,
            workHub: action.value,
            sampleReview: action.value === state.workHub ? state.sampleReview : "not_started",
          }
        : state;
    case "documentChanged":
      return {
        ...state,
        docStates: { ...state.docStates, [action.id]: action.status },
        sampleReview: "not_started",
      };
    case "digitalPreviewed":
      return { ...state, digilocker: resolve(action.value, state.digilocker) };
    case "accuracyChanged":
      return {
        ...state,
        dataAccuracyAccepted: resolve(action.value, state.dataAccuracyAccepted),
        sampleReview: "not_started",
      };
    case "termsChanged":
      return {
        ...state,
        termsAccepted: resolve(action.value, state.termsAccepted),
        sampleReview: "not_started",
      };
    case "attachSampleDocuments":
      return {
        ...state,
        docStates: {
          ...state.docStates,
          ...Object.fromEntries(
            (vehicleDocumentIds[state.vehicle] || []).map((id) => [id, "Sample attached"]),
          ),
        },
        sampleReview: "not_started",
      };
    case "checkSampleVehicle":
      return { ...state, vehicleChecked: true, sampleReview: "not_started" };
    case "startSampleReview":
      return sampleReviewReady(state) ? { ...state, sampleReview: "reviewing" } : state;
    case "finishSampleReview":
      return state.sampleReview === "reviewing" && sampleReviewReady(state)
        ? {
            ...state,
            sampleReview: "test_approved",
            docStates: {
              ...state.docStates,
              ...Object.fromEntries(
                (vehicleDocumentIds[state.vehicle] || []).map((id) => [id, "Test verified"]),
              ),
            },
          }
        : state;
    default:
      return state;
  }
}
