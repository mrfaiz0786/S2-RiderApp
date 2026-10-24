import { SafeAreaProvider } from "react-native-safe-area-context";
import RiderApp from "../RiderApp";

/** Keep the native/web safe-area context above every screen that consumes it. */
export default function App() {
  return (
    <SafeAreaProvider>
      <RiderApp />
    </SafeAreaProvider>
  );
}
