import { WorkCityView } from "@/features/onboarding/components/WorkCityView";
import { useOnboarding } from "@/features/onboarding/model";

export function WorkCityScreen() {
  const { workCity, setWorkCity, setWorkHub } = useOnboarding();

  return (
    <WorkCityView
      city={workCity}
      onCityChange={(id) => {
        if (id !== workCity) {
          setWorkCity(id);
          setWorkHub("");
        }
      }}
    />
  );
}
