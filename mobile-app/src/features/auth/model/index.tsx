import { createFeatureStore } from "@/shared/state/createFeatureStore";
import { authReducer, initialAuthState } from "./reducer";

const { Provider, useStore } = createFeatureStore("Auth", initialAuthState, authReducer);
export const AuthProvider = Provider;
export function useAuth() {
  const { state, dispatch } = useStore();
  return { ...state, setPhone: (value: string) => dispatch({ type: "phoneChanged", value }) };
}
