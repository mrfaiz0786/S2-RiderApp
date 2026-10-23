import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
/** Creates an isolated, typed store. It intentionally provides no disk persistence. */
export function createFeatureStore<State, Action>(
  name: string,
  initialState: State,
  reducer: (state: State, action: Action) => State,
) {
  type Value = { state: State; dispatch: Dispatch<Action> };
  const Context = createContext<Value | null>(null);
  function Provider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = useMemo(() => ({ state, dispatch }), [state]);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }
  function useStore(): Value {
    const value = useContext(Context);
    if (!value) throw new Error(name + " must be used within its Provider");
    return value;
  }
  return { Provider, useStore };
}
