import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { theme } from "../theme";
export type AppIconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];
export function AppIcon({
  name,
  size = 22,
  color = theme.colors.muted,
}: {
  name: AppIconName;
  size?: number;
  color?: string;
}) {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}
