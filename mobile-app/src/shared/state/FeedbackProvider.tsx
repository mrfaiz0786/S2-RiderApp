import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
type Feedback = { demoNotice: string; setDemoNotice: Dispatch<SetStateAction<string>> };
const Context = createContext<Feedback | null>(null);
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [demoNotice, setDemoNotice] = useState("");
  const value = useMemo(() => ({ demoNotice, setDemoNotice }), [demoNotice]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useFeedback(): Feedback {
  const value = useContext(Context);
  if (!value) throw new Error("Feedback provider is missing");
  return value;
}
