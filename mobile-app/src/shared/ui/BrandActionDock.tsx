import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Text, View } from "react-native";
const C = theme.colors;
export function BrandActionDock({
  title,
  caption,
  onPress,
  disabled = false,
}: {
  title: string;
  caption?: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.dock}>
      {caption ? <Text style={styles.dockCaption}>{caption}</Text> : null}
      <BrandButton title={title} onPress={onPress} disabled={disabled} />
    </View>
  );
}
const styles = createBrandedStyles({
  dock: {
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingHorizontal: 20,
    paddingTop: 9,
    paddingBottom: 12,
  },
  dockCaption: { color: C.muted, fontSize: 12, textAlign: "center", marginBottom: 5 },
});
