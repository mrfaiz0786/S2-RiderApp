import type { Language } from "@/shared/i18n/translations";
import { createFeatureStore } from "@/shared/state/createFeatureStore";
import { initialProfileState, profileReducer } from "./reducer";
const { Provider, useStore } = createFeatureStore("Profile", initialProfileState, profileReducer);
export const ProfileProvider = Provider;
export function useProfile() {
  const { state, dispatch } = useStore();
  return {
    ...state,
    setName: (value: string) => dispatch({ type: "nameChanged", value }),
    setEmail: (value: string) => dispatch({ type: "emailChanged", value }),
    setDateOfBirth: (value: string) => dispatch({ type: "dateOfBirthChanged", value }),
    setLanguage: (value: Language) => dispatch({ type: "languageChanged", value }),
  };
}
