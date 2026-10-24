import { vehicles } from "@/features/onboarding/data/vehicles";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { BrandSheet } from "@/shared/ui/BrandSheet";
import { Card } from "@/shared/ui/Card";
import { OnboardingProgress } from "@/shared/ui/OnboardingProgress";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { VehicleIllustration } from "@/shared/ui/VehicleIllustration";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
type DocumentItem = { id: string; name: string; detail: string; status: string };
export function VehicleSetupView({
  vehicle,
  onVehicleChange,
  documents,
  getStatus,
  onSimulateUpload,
  onPreviewDigital,
}: {
  vehicle: string;
  onVehicleChange: (value: string) => void;
  documents: readonly DocumentItem[];
  getStatus: (id: string) => string;
  onSimulateUpload: (id: string) => void;
  onPreviewDigital: () => void;
}) {
  const [more, setMore] = useState(false);
  const [document, setDocument] = useState<DocumentItem | null>(null);
  return (
    <>
      <ScreenHero
        eyebrow="TEST RIDER SETUP"
        title="Your vehicle and sample documents"
        subtitle="Choose a vehicle, inspect the TEST cards and attach fictional samples."
        icon="bike"
      />
      <OnboardingProgress current={2} />
      <Card>
        <Text style={s.heading}>Select a sample vehicle</Text>
        {(more ? vehicles : vehicles.slice(0, 3)).map((item) => (
          <Pressable
            key={item.value}
            accessibilityRole="radio"
            accessibilityLabel={item.title}
            accessibilityState={{ checked: vehicle === item.value }}
            style={[s.pill, vehicle === item.value && s.selected]}
            onPress={() => onVehicleChange(item.value)}
          >
            <View style={s.row}>
              <VehicleIllustration kind={item.kind} />
              <View style={{ flex: 1 }}>
                <Text style={s.heading}>{item.title}</Text>
                <Text style={s.small}>
                  {vehicle === item.value ? "Selected for test journey" : "Tap to select"}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
        <BrandButton
          title={more ? "Show fewer vehicles" : "Show other test vehicles"}
          secondary
          onPress={() => setMore((value) => !value)}
        />
      </Card>
      <Card>
        <Text style={s.heading}>Sample document checklist</Text>
        {documents.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.name + " sample preview"}
            style={s.pill}
            onPress={() => setDocument(item)}
          >
            <Text style={s.heading}>{item.name}</Text>
            <Text style={s.body}>{getStatus(item.id)}</Text>
            <Text style={s.small}>Open clearly marked sample card</Text>
          </Pressable>
        ))}
        <BrandButton title="Attach all sample cards" secondary onPress={onPreviewDigital} />
      </Card>
      <BrandSheet
        visible={document !== null}
        title={document?.name || "Sample document"}
        subtitle="FICTIONAL SAMPLE — NOT A VALID ID OR VEHICLE DOCUMENT"
        onClose={() => setDocument(null)}
      >
        <View style={s.sampleDocument}>
          <Text style={s.amount}>SAMPLE / TEST</Text>
          <Text style={s.heading}>{document?.name}</Text>
          <Text style={s.body}>Holder: YBM Test Rider</Text>
          <Text selectable style={s.body}>
            Reference: {"SAMPLE-" + (document?.id.toUpperCase() || "DOC") + "-001"}
          </Text>
          <Text style={s.body}>Vehicle: YBM-TEST-01</Text>
          <Text style={s.small}>
            No government logo, valid identity number, signature or QR. For local interface testing
            only.
          </Text>
        </View>
        <BrandButton
          title="Use this sample document"
          onPress={() => {
            if (document) onSimulateUpload(document.id);
            setDocument(null);
          }}
        />
      </BrandSheet>
    </>
  );
}
