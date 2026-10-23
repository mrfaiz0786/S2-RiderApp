import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Alert as NativeAlert,
  Text,
  type AlertButton,
  type AlertOptions,
} from "react-native";
import { theme } from "../theme";
import { createBrandedStyles } from "../theme/createBrandedStyles";
import { BrandButton } from "./BrandButton";
import { BrandSheet } from "./BrandSheet";

type Dialog = {
  id: number;
  title: string;
  message?: string;
  buttons: AlertButton[];
  options?: AlertOptions;
};
let present: ((dialog: Dialog) => void) | null = null;
let sequence = 0;
// API-compatible adapter for existing app-owned Alert.alert calls.
// Actual Android/iOS permission dialogs remain OS-controlled.
export const BrandedAlert = {
  alert(title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions) {
    Keyboard.dismiss();
    if (!present) {
      NativeAlert.alert(title, message, buttons, options);
      return;
    }
    present({
      id: ++sequence,
      title,
      message,
      buttons: buttons?.length ? buttons : [{ text: "Got it" }],
      options,
    });
  },
};

export function BrandDialogProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Dialog[]>([]);
  useEffect(() => {
    const handler = (dialog: Dialog) => setQueue((previous) => [...previous, dialog]);
    present = handler;
    return () => {
      if (present === handler) present = null;
    };
  }, []);
  const current = queue[0];
  const close = (id: number) => setQueue((previous) => previous.filter((item) => item.id !== id));
  return (
    <>
      {children}
      <BrandSheet
        visible={!!current}
        title={current?.title || "Update"}
        dismissible={current?.options?.cancelable === true}
        onClose={() => {
          if (current) {
            close(current.id);
            current.options?.onDismiss?.();
          }
        }}
      >
        {current?.message ? (
          <Text selectable style={styles.message}>
            {current.message}
          </Text>
        ) : null}
        {current?.buttons.map((button, index) => (
          <BrandButton
            key={current.id + "-" + index}
            title={button.text || "Continue"}
            secondary={button.style === "cancel"}
            danger={button.style === "destructive"}
            onPress={() => {
              close(current.id);
              button.onPress?.();
            }}
          />
        ))}
      </BrandSheet>
    </>
  );
}
const styles = createBrandedStyles({
  message: { color: theme.colors.textSecondary, fontSize: 15, lineHeight: 23, marginBottom: 10 },
});
