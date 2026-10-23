import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon } from "@/shared/ui/AppIcon";
import { View } from "react-native";
const C = theme.colors;
export function SelectionMark({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.selectionMark, selected && styles.selectionMarkOn]}>
      {selected ? <AppIcon name="check" size={16} color={C.white} /> : null}
    </View>
  );
}
const styles = createBrandedStyles({
  selectionMark: {
    width: 25,
    height: 25,
    borderWidth: 1.5,
    borderColor: C.borderStrong,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionMarkOn: { borderColor: C.primary, backgroundColor: C.primary },
});
