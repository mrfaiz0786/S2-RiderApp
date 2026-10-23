import { defaultBackRoute, isRouteName, type RouteName, type TabName } from "./routes";
export type NavigationState = { route: RouteName; history: RouteName[] };
export type NavigationAction =
  | { type: "navigate"; target: RouteName }
  | { type: "selectTab"; target: TabName }
  | { type: "back" };
export const initialNavigationState: NavigationState = { route: "welcome", history: [] };
export function navigationReducer(
  state: NavigationState,
  action: NavigationAction,
): NavigationState {
  switch (action.type) {
    case "navigate":
      return !isRouteName(action.target) || state.route === action.target
        ? state
        : { route: action.target, history: [...state.history, state.route].slice(-50) };
    case "selectTab":
      return { route: action.target, history: action.target === "home" ? [] : ["home"] };
    case "back":
      return {
        route: state.history.at(-1) || defaultBackRoute(state.route),
        history: state.history.slice(0, -1),
      };
    default:
      return state;
  }
}
