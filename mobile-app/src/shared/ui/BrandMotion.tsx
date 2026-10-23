import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  AppState,
  Easing,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { theme } from "../theme";

const MotionContext = createContext(false);
export function BrandMotionProvider({ children }: { children: React.ReactNode }) {
  // Begin conservatively until the platform preference is known.
  const [reduce, setReduce] = useState(true);
  const [active, setActive] = useState(AppState.currentState !== "background");
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (mounted) setReduce(v);
      })
      .catch(() => {
        if (mounted) setReduce(true);
      });
    const reduced = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    const state = AppState.addEventListener("change", (v) => setActive(v === "active"));
    return () => {
      mounted = false;
      reduced.remove();
      state.remove();
    };
  }, []);
  return <MotionContext.Provider value={!reduce && active}>{children}</MotionContext.Provider>;
}
export const useBrandMotion = () => useContext(MotionContext);

export function BrandEntrance({
  children,
  style,
  sheet = false,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  sheet?: boolean;
}) {
  const enabled = useBrandMotion();
  const progress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    progress.stopAnimation();
    if (!enabled) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: sheet ? theme.motion.sheet : theme.motion.entry,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [enabled, progress, sheet]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [sheet ? 20 : theme.motion.entranceDistance, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function BrandPressable({
  children,
  onPressIn,
  onPressOut,
  style,
  disabled,
  ...props
}: PressableProps) {
  const enabled = useBrandMotion();
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!enabled || disabled) {
      scale.stopAnimation();
      scale.setValue(1);
    }
    return () => scale.stopAnimation();
  }, [enabled, disabled, scale]);
  const animate = (value: number) => {
    scale.stopAnimation();
    if (!enabled || disabled) {
      scale.setValue(1);
      return;
    }
    Animated.timing(scale, {
      toValue: value,
      duration: theme.motion.press,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
      isInteraction: false,
    }).start();
  };
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        {...props}
        disabled={disabled}
        style={style}
        onPressIn={(e) => {
          animate(0.985);
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          animate(1);
          onPressOut?.(e);
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
