import { appConfig } from "@/config/app";
import { riderFonts } from "@/shared/theme/fonts";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
/** Do not block the rider forever if an optional custom font cannot be loaded. */
export function useAppReady(): boolean {
  const [fontsLoaded, fontError] = useFonts(riderFonts);
  const [timeout, setTimeoutExpired] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTimeoutExpired(true), appConfig.fontTimeoutMs);
    return () => clearTimeout(timer);
  }, []);
  return fontsLoaded || Boolean(fontError) || timeout;
}
