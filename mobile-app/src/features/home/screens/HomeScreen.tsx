import { useDelivery } from "@/features/delivery/model";
import { RiderDashboard } from "@/features/home/components/RiderDashboard";
import { useProfile } from "@/features/profile/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { useFeedback } from "@/shared/state/FeedbackProvider";

export function HomeScreen() {
  const { name } = useProfile();
  const { online, setOnline, jobAccepted, pickupDone, deliveryDone } = useDelivery();
  const { navigate: go } = useNavigation();
  const { demoNotice, setDemoNotice } = useFeedback();
  return (
    <RiderDashboard
      name={name}
      online={online}
      jobAccepted={jobAccepted}
      pickupDone={pickupDone}
      deliveryDone={deliveryDone}
      demoNotice={demoNotice}
      onToggleOnline={(v) => {
        setOnline(v);
        setDemoNotice(
          v
            ? "Demo availability is on. No dispatch service was contacted."
            : "Demo availability is off.",
        );
      }}
      onNavigate={(id) => go(id)}
    />
  );
}
