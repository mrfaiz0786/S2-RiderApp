import { previewHubs, workCityName } from "@/features/onboarding/data/workAreas";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandButton } from "@/shared/ui/BrandButton";
import { BrandMark } from "@/shared/ui/BrandMark";
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

export function WorkHubView({
  city,
  hub,
  vehicle,
  onHubChange,
  onChangeCity,
}: {
  city: string;
  hub: string;
  vehicle: string;
  onHubChange: (v: string) => void;
  onChangeCity: () => void;
}) {
  const [query, setQuery] = useState("");
  const [guide, setGuide] = useState(false);
  const hubs = useMemo(
    () =>
      previewHubs(city).filter((h) =>
        (h.name + " " + h.area + " " + h.code).toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [city, query],
  );
  return (
    <>
      <ScreenHero
        eyebrow="A GOOD PLACE TO START"
        title="Find your starting point."
        subtitle="Choose a hub preview for your work city. Live openings will need a real operations service."
        icon="storefront-outline"
      />
      <OnboardingProgress current={4} />
      <View style={styles.areaBar}>
        <View>
          <Text style={styles.smallLabel}>WORK CITY</Text>
          <Text style={styles.areaTitle}>{workCityName(city)}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onChangeCity} style={styles.changeArea}>
          <AppIcon name="pencil-outline" size={16} color={C.primary} />
          <Text style={styles.helpText}>Change</Text>
        </Pressable>
      </View>
      <SearchField
        label="Search example hubs"
        placeholder="Search hub or pickup area"
        value={query}
        onChange={setQuery}
      />
      <Pressable accessibilityRole="button" onPress={() => setGuide(true)} style={styles.guideCard}>
        <View style={styles.guideIcon}>
          <AppIcon name="map-marker-path" size={28} color={C.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.guideTitle}>What makes a good starting hub?</Text>
          <Text style={styles.bodySmall}>A short guide before you choose.</Text>
        </View>
        <AppIcon name="arrow-right" size={22} color={C.primary} />
      </Pressable>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Hub previews</Text>
        <Text style={styles.smallLabel}>{hubs.length} EXAMPLES</Text>
      </View>
      <View accessibilityRole="radiogroup" accessibilityLabel="Starting hub" style={styles.hubList}>
        {hubs.map((h) => (
          <BrandPressable
            key={h.id}
            accessibilityRole="radio"
            accessibilityLabel={h.name + ", fictional example"}
            accessibilityState={{ checked: hub === h.id }}
            onPress={() => {
              Keyboard.dismiss();
              onHubChange(h.id);
            }}
            style={[styles.hubCard, hub === h.id && styles.hubSelected]}
          >
            <View style={styles.hubTop}>
              <View style={styles.hubIcon}>
                <AppIcon name="storefront-outline" size={26} color={C.primary} />
              </View>
              <Text style={styles.hubCode}>{h.code}</Text>
              <SelectionMark selected={hub === h.id} />
            </View>
            <Text style={styles.hubTitle}>{h.name}</Text>
            <Text style={styles.body}>{h.area}</Text>
            <View style={styles.hubMeta}>
              <View style={styles.metaChip}>
                <AppIcon name="map-marker-outline" size={16} color={C.primary} />
                <Text style={styles.metaText}>{h.distance} example commute</Text>
              </View>
              <Text style={styles.hubTag}>DEMO ONLY</Text>
            </View>
          </BrandPressable>
        ))}
      </View>
      {hubs.length === 0 ? (
        <BrandNote
          title={city ? "No matching hub" : "Choose a city first"}
          body={
            city
              ? "Try a shorter search or clear the field."
              : "A city is needed before showing its sample hubs."
          }
        />
      ) : null}
      <Text style={styles.footnote}>
        These are fictional hubs and distances, not measured from your location. No branch, vacancy
        or rider assignment is confirmed. Existing delivery fixtures are separate sample data.
      </Text>
      <BrandSheet
        visible={guide}
        title="Choose a practical starting point"
        onClose={() => setGuide(false)}
      >
        <View style={styles.guideHero}>
          <BrandMark size={56} />
          <Text style={[styles.guideTitle, { flex: 1 }]}>A calmer start to your working day.</Text>
        </View>
        <BrandNote
          title="Check your journey"
          body="In a connected app, review the actual address and route before confirming a hub."
          icon="map-marker-outline"
        />
        <BrandNote
          title="Know what is available"
          body={
            "Vehicle compatibility, operating hours and available capacity need server confirmation. Selected preview: " +
            vehicle +
            "."
          }
          icon="bike"
        />
        <BrandNote
          title="Get clarity before committing"
          body="Show the operating terms and a real support route. Do not assume the shortest example distance guarantees work."
          icon="help-circle-outline"
        />
        <BrandButton title="Back to hub previews" onPress={() => setGuide(false)} />
      </BrandSheet>
    </>
  );
}
const styles = createBrandedStyles({
  areaBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 3,
    gap: 10,
  },
  smallLabel: { color: C.muted, fontSize: 10, fontWeight: "800", letterSpacing: 0.6 },
  areaTitle: { color: C.primary, fontSize: 19, fontWeight: "800", marginTop: 2 },
  changeArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: C.surface,
  },
  helpText: { color: C.primary, fontSize: 13, fontWeight: "800" },
  guideCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.accentSoft,
    padding: 15,
    borderRadius: 20,
    marginTop: 12,
  },
  guideIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.surface,
    borderRadius: 16,
  },
  guideTitle: { color: C.text, fontSize: 16, fontWeight: "800" },
  bodySmall: { color: C.muted, fontSize: 13, lineHeight: 19, marginTop: 3 },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 15,
    marginBottom: 12,
  },
  sectionTitle: { color: C.text, fontSize: 19, fontWeight: "800", flexShrink: 1 },
  hubList: { gap: 13 },
  hubCard: {
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 24,
    padding: 18,
  },
  hubSelected: { borderColor: C.primary, backgroundColor: C.primaryTint },
  hubTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 13 },
  hubIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: C.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  hubCode: { color: C.muted, fontSize: 11, fontWeight: "800", flex: 1 },
  hubTitle: { color: C.text, fontSize: 19, fontWeight: "800", marginBottom: 4 },
  body: { color: C.textSecondary, fontSize: 14, lineHeight: 21 },
  hubMeta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 9, marginTop: 14 },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: C.primarySoft,
  },
  metaText: { color: C.primary, fontSize: 11, fontWeight: "700" },
  hubTag: { color: C.muted, fontSize: 10, fontWeight: "800" },
  footnote: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 10 },
  guideHero: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 10 },
});
