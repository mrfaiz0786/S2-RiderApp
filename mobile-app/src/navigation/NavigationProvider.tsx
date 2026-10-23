import { useFeedback } from "@/shared/state/FeedbackProvider";
import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import { initialNavigationState, navigationReducer } from "./reducer";
import { getRoute, type RouteName, type TabName } from "./routes";
type Navigation = {
  route: RouteName;
  current: ReturnType<typeof getRoute>;
  navigate: (target: RouteName) => void;
  selectTab: (target: TabName) => void;
  goBack: () => void;
};
const Context = createContext<Navigation | null>(null);
export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(navigationReducer, initialNavigationState);
  const { setDemoNotice } = useFeedback();
  const navigate = useCallback(
    (target: RouteName) => {
      setDemoNotice("");
      dispatch({ type: "navigate", target });
    },
    [setDemoNotice],
  );
  const selectTab = useCallback(
    (target: TabName) => {
      setDemoNotice("");
      dispatch({ type: "selectTab", target });
    },
    [setDemoNotice],
  );
  const goBack = useCallback(() => {
    setDemoNotice("");
    dispatch({ type: "back" });
  }, [setDemoNotice]);
  const value = useMemo(
    () => ({ route: state.route, current: getRoute(state.route), navigate, selectTab, goBack }),
    [state.route, navigate, selectTab, goBack],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useNavigation(): Navigation {
  const value = useContext(Context);
  if (!value) throw new Error("Navigation provider is missing");
  return value;
}
