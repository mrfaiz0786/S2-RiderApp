import { useFeedback } from "@/shared/state/FeedbackProvider";
import { useOnboarding } from "@/features/onboarding/model";
import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import { initialNavigationState, navigationReducer } from "./reducer";
import { getRoute, routes, type RouteName, type TabName } from "./routes";
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
  const { trainingCompleted, reviewSubmitted } = useOnboarding();
  const navigate = useCallback(
    (target: RouteName) => {
      const currentIndex = routes.findIndex((item) => item.name === state.route);
      const targetIndex = routes.findIndex((item) => item.name === target);
      const onboardingEnd = routes.findIndex((item) => item.name === "training");
      if (!trainingCompleted && targetIndex > onboardingEnd && target !== "home") return;
      if (!trainingCompleted && target === "home" && state.route !== "training") return;
      if (!trainingCompleted && targetIndex <= onboardingEnd && targetIndex > currentIndex + 1)
        return;
      if (target === "training" && !reviewSubmitted) return;
      setDemoNotice("");
      dispatch({ type: "navigate", target });
    },
    [setDemoNotice, state.route, trainingCompleted, reviewSubmitted],
  );
  const selectTab = useCallback(
    (target: TabName) => {
      if (!trainingCompleted) return;
      setDemoNotice("");
      dispatch({ type: "selectTab", target });
    },
    [setDemoNotice, trainingCompleted],
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
