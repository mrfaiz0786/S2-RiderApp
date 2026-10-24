import { createFeatureStore } from "@/shared/state/createFeatureStore";
import type { BooleanUpdate } from "./reducer";
import { initialOnboardingState, onboardingReducer } from "./reducer";
import { documentStatus, documentTone } from "./selectors";
const { Provider, useStore } = createFeatureStore(
  "Onboarding",
  initialOnboardingState,
  onboardingReducer,
);
export const OnboardingProvider = Provider;
export function useOnboarding() {
  const { state, dispatch } = useStore();
  return {
    ...state,
    setVehicle: (value: string) => dispatch({ type: "vehicleChanged", value }),
    setWorkCity: (value: string) => dispatch({ type: "cityChanged", value }),
    setWorkHub: (value: string) => dispatch({ type: "hubChanged", value }),
    setDoc: (id: string, status: string) => dispatch({ type: "documentChanged", id, status }),
    setDigilocker: (value: BooleanUpdate) => dispatch({ type: "digitalPreviewed", value }),
    setDataAccuracyAccepted: (value: BooleanUpdate) => dispatch({ type: "accuracyChanged", value }),
    setTermsAccepted: (value: BooleanUpdate) => dispatch({ type: "termsChanged", value }),
    setField: (
      field: "identityMethod" | "address" | "bankHolder" | "bankAccount" | "bankIfsc",
      value: string,
    ) => dispatch({ type: "fieldChanged", field, value }),
    setFlag: (
      field:
        | "identityConsent"
        | "selfieReady"
        | "verificationConsent"
        | "reviewSubmitted"
        | "trainingCompleted",
      value: boolean,
    ) => dispatch({ type: "flagChanged", field, value }),
    docStatus: (id: string) => documentStatus(state, id),
    docTone: documentTone,
  };
}
