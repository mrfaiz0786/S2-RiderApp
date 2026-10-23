import { DeliveryNavigationView } from "@/features/delivery/components/DeliveryNavigationView";
import { useDelivery } from "@/features/delivery/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { alertDemo } from "@/shared/lib/demoFeedback";

export function DeliveryNavigationScreen() {
  const { pickupDone } = useDelivery();
  const { navigate: go } = useNavigation();
  return (
    <DeliveryNavigationView
      pickupDone={pickupDone}
      onDirections={() => alertDemo("External navigation")}
      onReportIssue={() => go("support")}
    />
  );
}
