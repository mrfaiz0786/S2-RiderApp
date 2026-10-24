import { previewHubs, workCities } from "../data/workAreas";
export type OnboardingState = {
  vehicle: string;
  workCity: string;
  workHub: string;
  docStates: Record<string, string>;
  digilocker: boolean;
  dataAccuracyAccepted: boolean;
  termsAccepted: boolean;
  identityMethod: string;
  identityConsent: boolean;
  address: string;
  selfieReady: boolean;
  bankHolder: string;
  bankAccount: string;
  bankIfsc: string;
  verificationConsent: boolean;
  reviewSubmitted: boolean;
  trainingCompleted: boolean;
};
export type BooleanUpdate = boolean | ((previous: boolean) => boolean);
export type OnboardingAction =
  | { type: "vehicleChanged" | "cityChanged" | "hubChanged"; value: string }
  | { type: "documentChanged"; id: string; status: string }
  | { type: "digitalPreviewed" | "accuracyChanged" | "termsChanged"; value: BooleanUpdate }
  | {
      type: "fieldChanged";
      field: "identityMethod" | "address" | "bankHolder" | "bankAccount" | "bankIfsc";
      value: string;
    }
  | {
      type: "flagChanged";
      field:
        | "identityConsent"
        | "selfieReady"
        | "verificationConsent"
        | "reviewSubmitted"
        | "trainingCompleted";
      value: boolean;
    };
export const initialOnboardingState: OnboardingState = {
  vehicle: "",
  workCity: "",
  workHub: "",
  docStates: {},
  digilocker: false,
  dataAccuracyAccepted: false,
  termsAccepted: false,
  identityMethod: "",
  identityConsent: false,
  address: "",
  selfieReady: false,
  bankHolder: "",
  bankAccount: "",
  bankIfsc: "",
  verificationConsent: false,
  reviewSubmitted: false,
  trainingCompleted: false,
};
const resolve = (value: BooleanUpdate, previous: boolean) =>
  typeof value === "function" ? value(previous) : value;
export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction,
): OnboardingState {
  switch (action.type) {
    case "vehicleChanged":
      return { ...state, vehicle: action.value };
    case "cityChanged":
      if (action.value && !workCities.some((city) => city.id === action.value)) return state;
      return action.value === state.workCity
        ? state
        : { ...state, workCity: action.value, workHub: "" };
    case "hubChanged":
      return !action.value || previewHubs(state.workCity).some((hub) => hub.id === action.value)
        ? { ...state, workHub: action.value }
        : state;
    case "documentChanged":
      return { ...state, docStates: { ...state.docStates, [action.id]: action.status } };
    case "digitalPreviewed":
      return { ...state, digilocker: resolve(action.value, state.digilocker) };
    case "accuracyChanged":
      return { ...state, dataAccuracyAccepted: resolve(action.value, state.dataAccuracyAccepted) };
    case "termsChanged":
      return { ...state, termsAccepted: resolve(action.value, state.termsAccepted) };
    case "fieldChanged":
      return { ...state, [action.field]: action.value };
    case "flagChanged":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}
