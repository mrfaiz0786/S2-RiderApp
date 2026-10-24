import { appConfig } from "@/config/app";
import { useAuth } from "@/features/auth/model";
import { useOnboarding } from "@/features/onboarding/model";
import { useSessionLifecycle } from "@/shared/state/SessionResetProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import { isTestCity, type PaymentMethod } from "../data/testScenario";
import { decodeDeliverySnapshot, encodeDeliverySnapshot } from "./persistence";
import {
  deliveryFlags,
  deliveryReducer,
  deliveryTotals,
  initialDeliveryState,
  type DeliveryAction,
  type DeliveryState,
} from "./reducer";
const KEY = "ybm.test-rider.deliveries.v1";
// One queue also serializes reset against writes from the previous provider instance.
let storageQueue: Promise<unknown> = Promise.resolve();
function serialized<T>(operation: () => Promise<T>) {
  const next = storageQueue.then(operation, operation);
  storageQueue = next.catch(() => undefined);
  return next;
}
type Store = {
  state: DeliveryState;
  dispatch: Dispatch<DeliveryAction>;
  hydrated: boolean;
  storageError: string;
};
const Context = createContext<Store | null>(null);
export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(deliveryReducer, initialDeliveryState);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState("");
  const { epoch } = useSessionLifecycle();
  useEffect(() => {
    let active = true;
    if (appConfig.dataMode !== "mock") {
      setHydrated(true);
      return;
    }
    void serialized(async () => {
      if (epoch > 0) {
        await AsyncStorage.removeItem(KEY);
        return initialDeliveryState;
      }
      return decodeDeliverySnapshot(await AsyncStorage.getItem(KEY));
    })
      .then((restored) => {
        if (active) {
          dispatch({ type: "restore", state: restored });
          setHydrated(true);
        }
      })
      .catch(() => {
        if (active) {
          setStorageError(
            "Local test history could not be restored. This run will still work in memory.",
          );
          setHydrated(true);
        }
      });
    return () => {
      active = false;
    };
  }, [epoch]);
  useEffect(() => {
    if (!hydrated || appConfig.dataMode !== "mock") return;
    let active = true;
    const snapshot = encodeDeliverySnapshot(state);
    void serialized(() => AsyncStorage.setItem(KEY, snapshot))
      .then(() => {
        if (active) setStorageError("");
      })
      .catch(() => {
        if (active)
          setStorageError("Test progress is in memory only because local storage is unavailable.");
      });
    return () => {
      active = false;
    };
  }, [state, hydrated]);
  const value = useMemo(
    () => ({ state, dispatch, hydrated, storageError }),
    [state, hydrated, storageError],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDelivery() {
  const store = useContext(Context);
  if (!store) throw new Error("Delivery provider is missing");
  const { state, dispatch } = store;
  const { testSignedIn } = useAuth();
  const { sampleReview, workCity } = useOnboarding();
  const canTest =
    appConfig.dataMode === "mock" &&
    testSignedIn &&
    sampleReview === "test_approved" &&
    store.hydrated;
  return {
    ...state,
    ...deliveryFlags(state),
    ...deliveryTotals(state),
    hydrated: store.hydrated,
    storageError: store.storageError,
    canTest,
    setOnline: (value: boolean) => {
      if (!value || canTest) dispatch({ type: "availabilityChanged", value });
    },
    createOffer: (paymentMethod: PaymentMethod = "cod") => {
      if (canTest && isTestCity(workCity))
        dispatch({ type: "offerCreated", cityId: workCity, paymentMethod, now: Date.now() });
    },
    acceptOffer: () => {
      if (canTest) dispatch({ type: "acceptOffer", now: Date.now() });
    },
    declineOffer: () => dispatch({ type: "declineOffer", now: Date.now() }),
    expireOffer: () => dispatch({ type: "expireOffer", now: Date.now() }),
    advanceRoute: (leg: "pickup" | "drop", step: number) => {
      if (canTest) dispatch({ type: "advanceRoute", leg, step, now: Date.now() });
    },
    confirmPickup: (code: string) => {
      if (canTest) dispatch({ type: "confirmPickup", code, now: Date.now() });
    },
    verifyDelivery: (code: string) => {
      if (canTest) dispatch({ type: "verifyDelivery", code, now: Date.now() });
    },
    confirmCod: (amountPaise: number, confirmed: boolean) => {
      if (canTest) dispatch({ type: "confirmCod", amountPaise, confirmed, now: Date.now() });
    },
  };
}
