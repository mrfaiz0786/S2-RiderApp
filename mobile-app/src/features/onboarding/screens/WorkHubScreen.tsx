import { WorkHubView } from "@/features/onboarding/components/WorkHubView";
import { useOnboarding } from "@/features/onboarding/model";
import { useNavigation } from "@/navigation/NavigationProvider";

export function WorkHubScreen() {
  const { vehicle, workCity, workHub, setWorkHub } = useOnboarding();
  const { navigate: go } = useNavigation();
  return (
    <WorkHubView
      city={workCity}
      hub={workHub}
      vehicle={vehicle}
      onHubChange={setWorkHub}
      onChangeCity={() => go("work-city")}
    />
  );
}
