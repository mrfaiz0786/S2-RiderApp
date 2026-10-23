import { workCities } from "@/features/onboarding/data/workAreas";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandButton } from "@/shared/ui/BrandButton";
import { BrandPressable } from "@/shared/ui/BrandMotion";
import { BrandNote } from "@/shared/ui/BrandNote";
import { BrandSheet } from "@/shared/ui/BrandSheet";
import { OnboardingProgress } from "@/shared/ui/OnboardingProgress";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { SearchField } from "@/shared/ui/SearchField";
import { SelectionMark } from "@/shared/ui/SelectionMark";
import { useMemo, useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";

const C = theme.colors;

export function WorkCityView({
  city,
  onCityChange,
}: {
  city: string;
  onCityChange: (v: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [help, setHelp] = useState(false);
  const found = useMemo(
    () =>
      workCities.filter((c) =>
        (c.name + " " + c.region + " " + c.aliases)
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [query],
  );
  return (
    <>
      <ScreenHero
        eyebrow="CHOOSE YOUR WORK AREA"
        title="Where will your day begin?"
        subtitle="Pick a work city first. Your starting hub comes next."
        icon="map-marker-outline"
      />
      <OnboardingProgress current={3} />
      <SearchField
        label="Search work cities"
        placeholder="Search by city name"
        value={query}
        onChange={setQuery}
      />
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Explore work cities</Text>
        <Text style={styles.smallLabel}>PREVIEW</Text>
      </View>
      <View accessibilityRole="radiogroup" accessibilityLabel="Work city" style={styles.cityList}>
        {found.map((c) => (
          <BrandPressable
            key={c.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: city === c.id }}
            accessibilityLabel={c.name + ", " + c.region}
            onPress={() => {
              Keyboard.dismiss();
              onCityChange(c.id);
            }}
            style={[styles.cityRow, city === c.id && styles.citySelected]}
          >
            <View style={[styles.cityIcon, city === c.id && { backgroundColor: C.primary }]}>
              <AppIcon
                name="map-marker-outline"
                size={23}
                color={city === c.id ? C.white : C.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cityTitle}>{c.name}</Text>
              <Text style={styles.bodySmall}>{c.region}</Text>
            </View>
            <SelectionMark selected={city === c.id} />
          </BrandPressable>
        ))}
      </View>
      {found.length === 0 ? (
        <BrandNote
          title="No matching preview city"
          body="Try Delhi, Gurugram, Noida or Bengaluru. Live service availability is not connected."
          icon="map-search-outline"
        />
      ) : null}
      <BrandNote
        title="Choose manually, stay in control"
        body="These are sample choices, not a list of live service openings. We are not using your device location."
        icon="map-marker-radius-outline"
      />
      <Pressable accessibilityRole="button" onPress={() => setHelp(true)} style={styles.helpLink}>
        <AppIcon name="information-outline" size={18} color={C.primary} />
        <Text style={styles.helpText}>How location will be used</Text>
      </Pressable>
      <BrandSheet
        visible={help}
        title="Location, only when it helps"
        onClose={() => setHelp(false)}
      >
        <BrandNote
          title="No location access requested here"
          body="You can select a city manually. A real nearby-hub or active-navigation feature should explain its purpose before showing the operating system's permission dialog."
          icon="map-marker-outline"
        />
        <Text style={styles.body}>
          The native permission dialog stays controlled by Android or iOS. Your choice, including
          denial, must be respected. This preview does not track your position.
        </Text>
        <BrandButton title="Continue with city search" onPress={() => setHelp(false)} />
      </BrandSheet>
    </>
  );
}
const styles = createBrandedStyles({
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 15,
    marginBottom: 12,
  },
  sectionTitle: { color: C.text, fontSize: 19, fontWeight: "800", flexShrink: 1 },
  smallLabel: { color: C.muted, fontSize: 10, fontWeight: "800", letterSpacing: 0.6 },
  cityList: { gap: 10 },
  cityRow: {
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 20,
    padding: 15,
    minHeight: 85,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  citySelected: { backgroundColor: C.primaryTint, borderColor: C.primary },
  cityIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: C.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  cityTitle: { color: C.text, fontSize: 17, fontWeight: "800" },
  bodySmall: { color: C.muted, fontSize: 13, lineHeight: 19, marginTop: 3 },
  helpLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    minHeight: 48,
    marginTop: 10,
    marginBottom: 5,
  },
  helpText: { color: C.primary, fontSize: 13, fontWeight: "800" },
  body: { color: C.textSecondary, fontSize: 14, lineHeight: 21 },
});
