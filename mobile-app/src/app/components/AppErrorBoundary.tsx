import { theme } from "@/shared/theme";
import React, { Component, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
/** Render failures must not expose stack traces or personal data on a rider screen. */
export class AppErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean; epoch: number }
> {
  state = { failed: false, epoch: 0 };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 28,
            backgroundColor: theme.colors.background,
          }}
        >
          <Text accessibilityRole="header" style={{ fontSize: 24, color: theme.colors.text }}>
            Something went wrong
          </Text>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              marginVertical: 16,
              color: theme.colors.textSecondary,
            }}
          >
            Restart the app view to try again. Unsaved input may be cleared. Before repeating an
            order or payment action, check its current status.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              this.setState((previous) => ({ failed: false, epoch: previous.epoch + 1 }))
            }
            style={{ padding: 18, borderRadius: 16, backgroundColor: theme.colors.primary }}
          >
            <Text style={{ color: theme.colors.primaryOn, textAlign: "center", fontSize: 16 }}>
              Restart preview
            </Text>
          </Pressable>
        </View>
      );
    return <React.Fragment key={this.state.epoch}>{this.props.children}</React.Fragment>;
  }
}
