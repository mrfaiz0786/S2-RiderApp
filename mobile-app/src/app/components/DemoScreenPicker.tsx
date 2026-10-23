import { appConfig } from "@/config/app";
import { useNavigation } from "@/navigation/NavigationProvider";
import { routes } from "@/navigation/routes";
import { theme } from "@/shared/theme";
import { BrandSheet } from "@/shared/ui/BrandSheet";
import { Text, TouchableOpacity } from "react-native";
export function DemoScreenPicker({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { navigate } = useNavigation();
  if (!appConfig.allowScreenPreview) return null;
  return (
    <BrandSheet
      visible={visible}
      title="Explore the rider preview"
      subtitle="Demo navigation only. This is not a production sign-in bypass."
      onClose={onClose}
    >
      {routes.map((route, index) => (
        <TouchableOpacity
          key={route.name}
          accessibilityRole="button"
          onPress={() => {
            onClose();
            navigate(route.name);
          }}
          style={{
            paddingVertical: 14,
            paddingHorizontal: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
            minHeight: 50,
          }}
        >
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 15,
              fontFamily: theme.typography.family.semibold,
            }}
          >
            {String(index + 1).padStart(2, "0")} {route.title}
          </Text>
        </TouchableOpacity>
      ))}
    </BrandSheet>
  );
}
