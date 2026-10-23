import type { Language } from "@/shared/i18n/translations";
import { sampleRider } from "../data/fixtures";
export type ProfileState = { name: string; email: string; language: Language };
export type ProfileAction =
  | { type: "nameChanged" | "emailChanged"; value: string }
  | { type: "languageChanged"; value: Language };
export const initialProfileState: ProfileState = {
  name: sampleRider.name,
  email: sampleRider.email,
  language: "English",
};
export function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case "nameChanged":
      return { ...state, name: action.value };
    case "emailChanged":
      return { ...state, email: action.value };
    case "languageChanged":
      return { ...state, language: action.value };
    default:
      return state;
  }
}
