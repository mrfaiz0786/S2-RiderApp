import { DeliveryActionDock } from "@/features/delivery/components/DeliveryActionDock";
import { OnboardingActionDock } from "@/features/onboarding/components/OnboardingActionDock";
import { useNavigation } from "@/navigation/NavigationProvider";
import { ScreenRenderer } from "@/navigation/ScreenRenderer";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { BrandEntrance } from "@/shared/ui/BrandMotion";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { BackHandler, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "./AppHeader";
import { BottomTabs } from "./BottomTabs";
import { DemoScreenPicker } from "./DemoScreenPicker";
export function AppShell() {
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
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <AppHeader onOpenPreview={() => setPreviewOpen(true)} />
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
        <DeliveryActionDock />
        <BottomTabs />
      </KeyboardAvoidingView>
      <DemoScreenPicker visible={previewOpen} onClose={() => setPreviewOpen(false)} />
    </SafeAreaView>
  );
}
const styles = createBrandedStyles({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
  },
});
