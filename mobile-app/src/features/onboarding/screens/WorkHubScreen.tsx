import { CompactOption } from "@/features/onboarding/components/CompactOption";
import { previewHubs, workCityName } from "@/features/onboarding/data/workAreas";
import { useOnboarding } from "@/features/onboarding/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { theme } from "@/shared/theme";
import { OnboardingProgress } from "@/shared/ui/OnboardingProgress";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Text, TouchableOpacity, View } from "react-native";

export function WorkHubScreen() {
  const { workCity, workHub, setWorkHub } = useOnboarding();
  const { navigate } = useNavigation();
  return (
    <>
      <ScreenHero
        eyebrow="STEP 4 · STARTING STORE"
        title="Select starting store"
        subtitle={`City: ${workCityName(workCity)}`}
        icon="storefront-outline"
        compact
      />
      <OnboardingProgress current={4} total={10} />
      <View accessibilityRole="radiogroup" accessibilityLabel="Starting store required">
        <Text style={{ color: theme.colors.text, fontWeight: "800", marginBottom: 8 }}>
          Starting store <Text style={{ color: theme.colors.danger }}>*</Text>
        </Text>
        {previewHubs(workCity).map((item) => (
          <CompactOption
            key={item.id}
            title={item.name}
            detail={item.area}
            selected={workHub === item.id}
            onPress={() => setWorkHub(item.id)}
          />
        ))}
      </View>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => navigate("work-city")}
        style={{ paddingVertical: 10 }}
      >
        <Text style={{ color: theme.colors.primary, fontWeight: "800" }}>Change city</Text>
      </TouchableOpacity>
      <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
        Stores are fictional demo choices; no rider assignment is confirmed.
      </Text>
    </>
  );
}
