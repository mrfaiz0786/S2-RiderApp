import { demoConfig } from "@/services/demo/credentials";
export type AuthState = { phone: string; testSignedIn: boolean };
export type AuthAction =
  { type: "phoneChanged"; value: string } | { type: "verifyTestOtp"; code: string };
export const initialAuthState: AuthState = { phone: "", testSignedIn: false };
export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "phoneChanged": {
      const phone = action.value.replace(/\D/g, "").slice(0, 10);
      return { ...state, phone, testSignedIn: phone === state.phone && state.testSignedIn };
    }
    case "verifyTestOtp":
      return state.phone === demoConfig.testPhone && action.code === demoConfig.demoOtp
        ? { ...state, testSignedIn: true }
        : state;
    default:
      return state;
  }
}
