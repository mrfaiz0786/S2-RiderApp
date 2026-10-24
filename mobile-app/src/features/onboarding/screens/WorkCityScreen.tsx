import { CompactOption } from "@/features/onboarding/components/CompactOption";
import { workCities } from "@/features/onboarding/data/workAreas";
import { useOnboarding } from "@/features/onboarding/model";
import { theme } from "@/shared/theme";
import { OnboardingProgress } from "@/shared/ui/OnboardingProgress";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Text, View } from "react-native";

export function WorkCityScreen() {
  const { workCity, setWorkCity } = useOnboarding();
  return (
    <>
      <ScreenHero
        eyebrow="STEP 4 · WORK AREA"
        title="Select your city"
        subtitle="Choose where you want to begin."
        icon="map-marker-outline"
        compact
      />
      <OnboardingProgress current={4} total={10} />
      <View accessibilityRole="radiogroup" accessibilityLabel="Work city required">
        <Text style={{ color: theme.colors.text, fontWeight: "800", marginBottom: 8 }}>
          Work city <Text style={{ color: theme.colors.danger }}>*</Text>
        </Text>
        {workCities.map((item) => (
          <CompactOption
            key={item.id}
            title={item.name}
            detail={item.region}
            selected={workCity === item.id}
            onPress={() => setWorkCity(item.id)}
          />
        ))}
      </View>
      <Text style={{ color: theme.colors.muted, fontSize: 12, marginTop: 4 }}>
        Cities are demo examples, not live openings.
      </Text>
    </>
  );
}
