import { Text, View } from "react-native";
import { journeyStyles as s } from "../theme/journeyStyles";
export function TestHint({ title, detail }: { title: string; detail?: string }) {
  return (
    <View style={s.hint}>
      <Text selectable style={s.heading}>
        {title}
      </Text>
      {detail ? <Text style={s.small}>{detail}</Text> : null}
    </View>
  );
}
