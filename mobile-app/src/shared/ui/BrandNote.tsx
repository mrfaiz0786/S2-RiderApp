import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon, type AppIconName } from "@/shared/ui/AppIcon";
import { Text, View } from "react-native";
const C = theme.colors;
export function BrandNote({
  title,
  body,
  icon = "information-outline",
  warning = false,
}: {
  title: string;
  body: string;
  icon?: AppIconName;
  warning?: boolean;
}) {
  return (
    <View style={[styles.note, warning && { backgroundColor: C.warningSoft }]}>
      <View style={styles.noteIcon}>
        <AppIcon name={icon} size={22} color={warning ? C.warning : C.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.noteTitle}>{title}</Text>
        <Text style={styles.noteBody}>{body}</Text>
      </View>
    </View>
  );
}
const styles = createBrandedStyles({
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
    borderRadius: 18,
    backgroundColor: C.primaryTint,
    gap: 11,
    marginVertical: 10,
  },
  noteIcon: { width: 30, paddingTop: 2 },
  noteTitle: { fontSize: 14, fontWeight: "800", color: C.text },
  noteBody: { fontSize: 13, color: C.textSecondary, lineHeight: 19, marginTop: 3 },
});
