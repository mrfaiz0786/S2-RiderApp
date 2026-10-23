import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { BrandMark } from "@/shared/ui/BrandMark";
import { ActivityIndicator, Text, View } from "react-native";
const C = theme.colors;
export function BrandLoadingScreen() {
  return (
    <View style={styles.loading}>
      <BrandMark size={100} />
      <Text style={{ fontSize: 24, fontWeight: "700", color: C.primary, marginTop: 20 }}>
        Build Your Mart
      </Text>
      <Text style={{ fontSize: 15, color: C.muted, marginTop: 6, marginBottom: 26 }}>
        A better start to your delivery day.
      </Text>
      <ActivityIndicator color={C.primary} size="small" />
    </View>
  );
}
const styles = createBrandedStyles({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.background,
    padding: 24,
  },
});
