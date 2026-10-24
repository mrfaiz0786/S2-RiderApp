import { appConfig } from "@/config/app";
import { theme } from "@/shared/theme";
import { BrandMark } from "@/shared/ui/BrandMark";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Never let a live-mode configuration display mock OTP, orders or balances. */
export function IntegrationGate() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <BrandMark size={56} />
        <Text accessibilityRole="header" style={styles.title}>
          {appConfig.configurationError ? "Check app configuration" : "API integration pending"}
        </Text>
        <Text style={styles.body}>
          {appConfig.configurationError ??
            "This app uses APIs supplied by the backend team. The client infrastructure is prepared, but the API contract and screen adapters must be integrated and tested before live mode is enabled."}
        </Text>
        <View style={styles.note}>
          <Text style={styles.body}>
            For the existing UI preview, use EXPO_PUBLIC_DATA_MODE=mock in a development or staging
            environment. No demo code authenticates a real account.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 28,
    gap: 20,
    maxWidth: 620,
    width: "100%",
    alignSelf: "center",
  },
  title: { color: theme.colors.primary, fontSize: 25, fontFamily: theme.typography.family.bold },
  body: { color: theme.colors.textSecondary, fontSize: 16, lineHeight: 25 },
  note: { backgroundColor: theme.colors.surface, padding: 18, borderRadius: 16 },
});
