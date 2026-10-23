import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
type SessionLifecycle = { epoch: number; resetSession: () => void };
const Context = createContext<SessionLifecycle | null>(null);
/** A reset remounts the complete demo scope, clearing feature state and local screen drafts. */
export function SessionResetProvider({ children }: { children: ReactNode }) {
  const [epoch, setEpoch] = useState(0);
  const resetSession = useCallback(() => setEpoch((value) => value + 1), []);
  const value = useMemo(() => ({ epoch, resetSession }), [epoch, resetSession]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useSessionLifecycle(): SessionLifecycle {
  const value = useContext(Context);
  if (!value) throw new Error("Session lifecycle provider is missing");
  return value;
}
export function useSessionReset() {
  return useSessionLifecycle().resetSession;
}
