import { useNavigation } from "@/navigation/NavigationProvider";
import { BrandActionDock } from "@/shared/ui/BrandActionDock";
import { useDelivery } from "../model";
export function DeliveryActionDock() {
  const { route, navigate } = useNavigation();
  const { jobAccepted, pickupDone, acceptOffer } = useDelivery();
  if (route === "offers")
    return (
      <BrandActionDock
        title={jobAccepted ? "Open accepted delivery" : "Accept delivery"}
        caption="Sample offer - no live dispatch"
        onPress={() => {
          acceptOffer();
          navigate("active-job");
        }}
      />
    );
  if (route === "delivery-navigation")
    return (
      <BrandActionDock
        title="Arrived at destination"
        caption="Sample route - no live tracking"
        disabled={!pickupDone}
        onPress={() => navigate("delivery-completion")}
      />
    );
  return null;
}
