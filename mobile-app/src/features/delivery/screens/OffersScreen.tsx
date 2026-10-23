import { DeliveryOffersView } from "@/features/delivery/components/DeliveryOffersView";
import { useDelivery } from "@/features/delivery/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { useFeedback } from "@/shared/state/FeedbackProvider";
import { BrandedAlert as Alert } from "@/shared/ui/BrandDialog";

export function OffersScreen() {
  const { jobAccepted, declineOffer } = useDelivery();
  const { navigate: go } = useNavigation();
  const { setDemoNotice } = useFeedback();
  return (
    <DeliveryOffersView
      jobAccepted={jobAccepted}
      onDecline={() =>
        Alert.alert("Decline sample offer?", "This only changes local demo state.", [
          { text: "Keep offer", style: "cancel" },
          {
            text: "Decline",
            style: "destructive",
            onPress: () => {
              declineOffer();
              go("home");
              setDemoNotice("Sample offer declined locally.");
            },
          },
        ])
      }
    />
  );
}
