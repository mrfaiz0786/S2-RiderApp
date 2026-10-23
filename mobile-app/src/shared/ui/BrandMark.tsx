import { brandAssets } from "@/shared/assets";
import { Image, StyleSheet, View } from "react-native";
import { theme } from "../theme";

// Geometry adapted from the logo supplied by the project owner, not a competitor asset.
const logo = brandAssets.mark;
export function BrandMark({ size = 46, inverse = false }: { size?: number; inverse?: boolean }) {
  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size * 0.26 },
        inverse && styles.inverse,
      ]}
    >
      <Image
        source={logo}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="Build Your Mart logo"
        style={{ width: size * (inverse ? 0.74 : 0.94), height: size * 0.72 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  inverse: { backgroundColor: theme.colors.white },
});
