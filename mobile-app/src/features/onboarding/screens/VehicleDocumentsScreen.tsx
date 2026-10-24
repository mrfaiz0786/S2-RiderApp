import { CompactOption } from "@/features/onboarding/components/CompactOption";
import { vehicles } from "@/features/onboarding/data/vehicles";
import { useOnboarding } from "@/features/onboarding/model";
import { theme } from "@/shared/theme";
import { OnboardingProgress } from "@/shared/ui/OnboardingProgress";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Text, View } from "react-native";

export function VehicleDocumentsScreen() {
  const { vehicle, setVehicle } = useOnboarding();
  return (
    <>
      <ScreenHero
        eyebrow="STEP 3 · VEHICLE"
        title="Select your vehicle"
        subtitle="The document list will match your choice."
        icon="bike"
        compact
      />
      <OnboardingProgress current={3} total={10} />
      <View accessibilityRole="radiogroup" accessibilityLabel="Vehicle type required">
        <Text style={{ color: theme.colors.text, fontWeight: "800", marginBottom: 8 }}>
          Vehicle type <Text style={{ color: theme.colors.danger }}>*</Text>
        </Text>
        {vehicles.slice(0, 3).map((item) => (
          <CompactOption
            key={item.value}
            title={item.title}
            detail={item.note}
            selected={vehicle === item.value}
            onPress={() => setVehicle(item.value)}
          />
        ))}
      </View>
      <Text style={{ color: theme.colors.muted, fontSize: 12, marginTop: 4 }}>
        Other vehicle categories can be added after their eligibility rules are defined.
      </Text>
    </>
  );
}
