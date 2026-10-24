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
          title="Next: choose work city"
          caption="Select your vehicle to continue"
          disabled={!state.vehicle}
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
          title="Next: identity & address"
          caption={
            state.workHub
              ? "Sample hub selected; no real assignment"
              : "Choose a sample hub to continue"
          }
          disabled={!canContinueFromHub(state)}
          onPress={() => navigate("identity")}
        />
      );
    default:
      return null;
  }
}
