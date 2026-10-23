import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandEntrance } from "@/shared/ui/BrandMotion";
import React, { useEffect } from "react";
import { Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const C = theme.colors;
export function BrandSheet({
  visible,
  title,
  subtitle,
  onClose,
  children,
  dismissible = true,
}: {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  dismissible?: boolean;
}) {
  useEffect(() => {
    if (visible) Keyboard.dismiss();
  }, [visible]);
  const requestClose = () => {
    if (dismissible) onClose();
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={requestClose}
    >
      <View style={styles.modalRoot}>
        <Pressable style={StyleSheet.absoluteFill} onPress={requestClose} accessible={false} />
        <BrandEntrance key={visible ? title : "closed"} sheet style={styles.sheet}>
          <SafeAreaView edges={["bottom"]} style={styles.sheetInner} accessibilityViewIsModal>
            <View style={styles.handle} />
            <View style={styles.sheetHeading}>
              <Text accessibilityRole="header" style={styles.sheetTitle}>
                {title}
              </Text>
              {dismissible ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close dialog"
                  onPress={onClose}
                  hitSlop={4}
                  style={styles.close}
                >
                  <AppIcon name="close" size={23} color={C.primary} />
                </Pressable>
              ) : (
                <View style={{ height: 48, width: 12 }} />
              )}
            </View>
            {subtitle ? <Text style={styles.sheetSubtitle}>{subtitle}</Text> : null}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.sheetContent}
            >
              {children}
            </ScrollView>
          </SafeAreaView>
        </BrandEntrance>
      </View>
    </Modal>
  );
}
const styles = createBrandedStyles({
  modalRoot: { flex: 1, justifyContent: "flex-end", backgroundColor: C.overlay },
  sheet: {
    width: "100%",
    maxWidth: 620,
    maxHeight: "87%",
    alignSelf: "center",
    backgroundColor: C.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  sheetInner: { flexShrink: 1 },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.neutralStrong,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  sheetHeading: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 22,
    paddingRight: 12,
    gap: 10,
  },
  sheetTitle: { flex: 1, fontSize: 22, fontWeight: "800", color: C.text },
  close: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  sheetSubtitle: {
    paddingHorizontal: 22,
    color: C.muted,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 10,
  },
  sheetContent: { padding: 22, paddingTop: 12, gap: 10 },
});
