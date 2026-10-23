import { useNavigation } from "@/navigation/NavigationProvider";
import { BrandActionDock } from "@/shared/ui/BrandActionDock";
import { workCityName } from "../data/workAreas";
import { useOnboarding } from "../model";
import { canContinueFromHub } from "../model/selectors";
export function OnboardingActionDock() {
  const { route, navigate } = useNavigation();
  const state = useOnboarding();
  switch (route) {
    case "vehicle-documents":
      return (
        <BrandActionDock
          title="Choose your work city"
          caption="Vehicle and documents are a local preview"
          onPress={() => navigate("work-city")}
        />
      );
    case "work-city":
      return (
        <BrandActionDock
          title="Find a starting hub"
          caption={
            state.workCity
              ? "Selected: " + workCityName(state.workCity)
              : "Select a city to continue"
          }
          disabled={!state.workCity}
          onPress={() => navigate("work-hub")}
        />
      );
    case "work-hub":
      return (
        <BrandActionDock
          title="Continue to declarations"
          caption={
            state.workHub
              ? "Sample hub selected; no real assignment"
              : "Choose a sample hub to continue"
          }
          disabled={!canContinueFromHub(state)}
          onPress={() => navigate("declarations")}
        />
      );
    default:
      return null;
  }
}
