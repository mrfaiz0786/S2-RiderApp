import { appConfig } from "@/config/app";
import { createContext, useContext, type ReactNode } from "react";

/**
 * Explicit in-memory sandbox. Enabled only for public-registration previews in
 * nonproduction API mode. Never turns an actual rider session into demo access.
 */
const Context = createContext(false);
export function DemoJourneyModeProvider({ children }: { children: ReactNode }) {
  const allowed = appConfig.dataMode === "api" && appConfig.environment !== "production";
  return <Context.Provider value={allowed}>{children}</Context.Provider>;
}
export function useDemoJourneyEnabled() {
  const previewMode = useContext(Context);
  return appConfig.dataMode === "mock" || previewMode;
}
