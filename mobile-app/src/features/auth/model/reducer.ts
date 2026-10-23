export type AuthState = { phone: string };
export type AuthAction = { type: "phoneChanged"; value: string };
export const initialAuthState: AuthState = { phone: "" };
export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "phoneChanged":
      return { ...state, phone: action.value.replace(/\D/g, "").slice(0, 10) };
    default:
      return state;
  }
}
