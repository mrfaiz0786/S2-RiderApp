import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon, type AppIconName } from "@/shared/ui/AppIcon";
import { BrandMark } from "@/shared/ui/BrandMark";
import { View } from "react-native";
const C = theme.colors;
export function VehicleIllustration({
  kind,
  large = false,
}: {
  kind: "motorcycle" | "bicycle" | "electric" | "car" | "cargo";
  large?: boolean;
}) {
  const icon: AppIconName =
    kind === "bicycle"
      ? "bicycle"
      : kind === "electric"
        ? "moped"
        : kind === "car"
          ? "car-outline"
          : kind === "cargo"
            ? "truck-outline"
            : "motorbike";
  return (
    <View accessible={false} style={[styles.scene, large && styles.sceneLarge]}>
      <View style={styles.sceneSun} />
      <View style={styles.sceneBuildingA} />
      <View style={styles.sceneBuildingB} />
      <View style={styles.sceneRoad} />
      <View style={styles.sceneStreakA} />
      <View style={styles.sceneStreakB} />
      <View style={styles.sceneVehicle}>
        <AppIcon name={icon} size={large ? 108 : 76} color={C.primary} />
      </View>
      <View style={styles.sceneBag}>
        <BrandMark size={25} />
      </View>
      {kind === "electric" ? (
        <View style={styles.energy}>
          <AppIcon name="lightning-bolt" size={15} color={C.accentOn} />
        </View>
      ) : null}
    </View>
  );
}
const styles = createBrandedStyles({
  scene: {
    width: 126,
    height: 106,
    position: "relative",
    overflow: "hidden",
    borderRadius: 22,
    backgroundColor: C.primarySoft,
  },
  sceneLarge: { width: 178, height: 136 },
  sceneSun: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    top: 7,
    right: 8,
    backgroundColor: C.accentSoft,
  },
  sceneBuildingA: {
    position: "absolute",
    width: 17,
    height: 42,
    right: 9,
    bottom: 19,
    borderRadius: 4,
    backgroundColor: "#CCDFD8",
  },
  sceneBuildingB: {
    position: "absolute",
    width: 13,
    height: 62,
    right: 31,
    bottom: 19,
    borderRadius: 4,
    backgroundColor: "#D4E5DE",
  },
  sceneRoad: {
    position: "absolute",
    bottom: 14,
    left: 8,
    right: 6,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.borderStrong,
  },
  sceneStreakA: {
    position: "absolute",
    left: 8,
    top: 56,
    width: 23,
    height: 4,
    borderRadius: 3,
    backgroundColor: C.accent,
  },
  sceneStreakB: {
    position: "absolute",
    left: 3,
    top: 65,
    width: 22,
    height: 4,
    borderRadius: 3,
    backgroundColor: C.accent,
  },
  sceneVehicle: { position: "absolute", bottom: 8, right: 3 },
  sceneBag: {
    position: "absolute",
    width: 30,
    height: 32,
    backgroundColor: C.surface,
    borderRadius: 8,
    left: 16,
    top: 14,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-8deg" }],
  },
  energy: {
    position: "absolute",
    top: 8,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.accent,
  },
});
