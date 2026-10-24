import { OnboardingActionDock } from "@/features/onboarding/components/OnboardingActionDock";
import { useNavigation } from "@/navigation/NavigationProvider";
import { ScreenRenderer } from "@/navigation/ScreenRenderer";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { BrandEntrance } from "@/shared/ui/BrandMotion";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "./AppHeader";
import { BottomTabs } from "./BottomTabs";
import { DemoScreenPicker } from "./DemoScreenPicker";
import { TestOrderAlerts } from "./TestOrderAlerts";
export function AppShell({ onExit }: { onExit?: () => void } = {}) {
  const { route, goBack } = useNavigation();
  const [previewOpen, setPreviewOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [route]);
  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (previewOpen) {
        setPreviewOpen(false);
        return true;
      }
      if (route === "welcome" || route === "home") return false;
      goBack();
      return true;
    });
    return () => subscription.remove();
  }, [route, previewOpen, goBack]);
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ExpoStatusBar style="dark" />
      {onExit ? (
        <View style={styles.demoBanner}>
          <Text style={styles.demoBannerText}>REGISTRATION SIMULATION · NOTHING IS SAVED</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Exit registration demo"
            onPress={onExit}
            style={styles.exitDemo}
          >
            <Text style={styles.exitDemoText}>Exit demo</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.testLabel}>TEST RIDER · NO REAL ORDERS OR PAYMENTS</Text>
      )}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <AppHeader onOpenPreview={() => setPreviewOpen(true)} />
        <TestOrderAlerts />
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <BrandEntrance key={route}>
            <ScreenRenderer route={route} />
          </BrandEntrance>
        </ScrollView>
        <OnboardingActionDock />
        <BottomTabs />
      </KeyboardAvoidingView>
      <DemoScreenPicker visible={previewOpen} onClose={() => setPreviewOpen(false)} />
    </SafeAreaView>
  );
}
const styles = createBrandedStyles({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  demoBanner: {
    backgroundColor: theme.colors.warningSoft,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    gap: 8,
    minHeight: 43,
  },
  demoBannerText: {
    flex: 1,
    fontWeight: "800",
    color: theme.colors.warning,
    fontSize: 9,
    letterSpacing: 0.3,
  },
  exitDemo: {
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  exitDemoText: { fontWeight: "800", fontSize: 12, color: theme.colors.primary },
  testLabel: {
    backgroundColor: theme.colors.accentSoft,
    color: theme.colors.primary,
    textAlign: "center",
    padding: 7,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
  },
});
