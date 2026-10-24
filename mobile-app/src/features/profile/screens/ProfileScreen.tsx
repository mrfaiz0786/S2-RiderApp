import { useAuth } from "@/features/auth/model";
import { useNotifications } from "@/features/notifications/model";
import { previewHubs, workCityName } from "@/features/onboarding/data/workAreas";
import { useOnboarding } from "@/features/onboarding/model";
import { useProfile } from "@/features/profile/model";
import { useNavigation } from "@/navigation/NavigationProvider";
import { useSessionReset } from "@/shared/state/SessionResetProvider";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { BrandedAlert } from "@/shared/ui/BrandDialog";
import { Card } from "@/shared/ui/Card";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Tag } from "@/shared/ui/Tag";
import { Text } from "react-native";
export function ProfileScreen() {
  const { phone } = useAuth();
  const { name, email, language } = useProfile();
  const { vehicle, workCity, workHub, sampleReview } = useOnboarding();
  const { deviceAlertsEnabled } = useNotifications();
  const { navigate } = useNavigation();
  const reset = useSessionReset();
  const approved = sampleReview === "test_approved";
  return (
    <>
      <ScreenHero
        eyebrow="TEST RIDER ACCOUNT"
        title="Profile and test settings"
        subtitle="Fictional rider setup. This is not a real verified account."
        icon="cog-outline"
      />
      <Card>
        <Tag
          label={approved ? "TEST APPROVED" : "SAMPLE REVIEW PENDING"}
          tone={approved ? "green" : "amber"}
        />
        <Text style={s.heading}>{name || "YBM Test Rider"}</Text>
        <Row label="Test phone" value={phone} />
        <Row label="Sample email" value={email} />
        <BrandButton
          title="Edit sample profile"
          secondary
          onPress={() => navigate("rider-profile")}
        />
      </Card>
      <Card>
        <Row label="Language" value={language + " (partial preview)"} />
        <Row label="Vehicle" value={vehicle} />
        <Row label="Test city" value={workCityName(workCity)} />
        <Row
          label="Test hub"
          value={previewHubs(workCity).find((hub) => hub.id === workHub)?.name || "Not selected"}
        />
        <Row
          label="Device alerts"
          value={deviceAlertsEnabled ? "Enabled for test run" : "In-app alerts only"}
        />
        <Row label="GPS tracking" value="Off · scripted map only" />
        <BrandButton
          title="Review sample verification"
          secondary
          onPress={() => navigate("verification-status")}
        />
      </Card>
      <Card>
        <Text style={s.heading}>Reset demo progress</Text>
        <Text style={s.body}>
          Clear the test login, sample approval, active delivery, saved test history and simulated
          earnings on this device. Nothing on a server is changed.
        </Text>
        <BrandButton
          title="Reset demo progress"
          secondary
          onPress={() =>
            BrandedAlert.alert(
              "Reset demo progress?",
              "This clears your saved test deliveries and cash/earnings totals as well as the current test journey. No real account or server data is deleted.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Reset demo", style: "destructive", onPress: reset },
              ],
            )
          }
        />
        <Text style={s.small}>
          Ordinary app restarts keep test deliveries/history but require test login and sample
          verification again. Reset deliberately clears that saved progress.
        </Text>
      </Card>
      <BrandButton title="Help and support preview" secondary onPress={() => navigate("support")} />
    </>
  );
}
