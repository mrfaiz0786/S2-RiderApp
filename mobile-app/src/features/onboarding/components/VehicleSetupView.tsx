import { vehicles } from "@/features/onboarding/data/vehicles";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandButton } from "@/shared/ui/BrandButton";
import { BrandMark } from "@/shared/ui/BrandMark";
import { BrandPressable } from "@/shared/ui/BrandMotion";
import { BrandNote } from "@/shared/ui/BrandNote";
import { BrandSheet } from "@/shared/ui/BrandSheet";
import { OnboardingProgress } from "@/shared/ui/OnboardingProgress";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { SelectionMark } from "@/shared/ui/SelectionMark";
import { VehicleIllustration } from "@/shared/ui/VehicleIllustration";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const C = theme.colors;
type DocumentItem = { id: string; name: string; detail: string; status: string };
export function VehicleSetupView({
  vehicle,
  onVehicleChange,
  documents,
  getStatus,
  onSimulateUpload,
  onPreviewDigital,
  showDocuments = true,
}: {
  vehicle: string;
  onVehicleChange: (v: string) => void;
  documents: readonly DocumentItem[];
  getStatus: (id: string) => string;
  onSimulateUpload: (id: string) => void;
  onPreviewDigital: () => void;
  showDocuments?: boolean;
}) {
  const [more, setMore] = useState(false);
  const [document, setDocument] = useState<DocumentItem | null>(null);
  const [digital, setDigital] = useState(false);
  const [notice, setNotice] = useState("");
  const available =
    more || vehicles.slice(3).some((v) => v.value === vehicle) ? vehicles : vehicles.slice(0, 3);
  return (
    <>
      <ScreenHero
        eyebrow="FIND YOUR FIT"
        title="Your wheels. Your way."
        subtitle="Choose the vehicle you plan to use. We will keep your document checklist relevant."
        icon="bike"
      />
      <OnboardingProgress current={3} total={10} />
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Vehicle category"
        style={styles.vehicleList}
      >
        {available.map((v) => {
          const selected = v.value === vehicle;
          return (
            <BrandPressable
              key={v.value}
              accessibilityRole="radio"
              accessibilityLabel={v.title}
              accessibilityState={{ checked: selected }}
              onPress={() => onVehicleChange(v.value)}
              style={[styles.vehicleCard, selected && styles.vehicleSelected]}
            >
              <VehicleIllustration kind={v.kind} />
              <View style={styles.vehicleDescription}>
                <Text style={styles.vehicleBadge}>{v.badge}</Text>
                <Text style={styles.vehicleTitle}>{v.title}</Text>
                <Text style={styles.vehicleNote}>{v.note}</Text>
                <Text style={[styles.selectionLabel, !selected && { color: C.muted }]}>
                  {selected ? "Your selected vehicle" : "Tap to choose"}
                </Text>
              </View>
              <View style={styles.vehicleCheck}>
                <SelectionMark selected={selected} />
              </View>
            </BrandPressable>
          );
        })}
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => setMore((v) => !v)}
        style={styles.moreButton}
      >
        <Text style={styles.helpText}>
          {more ? "Show fewer vehicle previews" : "Other vehicle previews"}
        </Text>
        <AppIcon name={more ? "chevron-up" : "chevron-down"} color={C.primary} size={21} />
      </Pressable>
      {showDocuments ? (
        <>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>A few details for review</Text>
            <Text style={styles.smallLabel}>DEMO CHECKLIST</Text>
          </View>
          <Text style={styles.body}>
            Requirements below are illustrative. Actual eligibility depends on your launch location
            and approved policy.
          </Text>
          <View style={styles.documentList}>
            {documents.map((d) => (
              <Pressable
                key={d.id}
                accessibilityRole="button"
                accessibilityLabel={d.name + ", " + getStatus(d.id) + ", view upload preview"}
                onPress={() => setDocument(d)}
                style={styles.documentRow}
              >
                <View style={styles.documentIcon}>
                  <AppIcon
                    name={d.id === "aadhaar" ? "shield-check-outline" : "file-document-outline"}
                    size={24}
                    color={C.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.documentTitle}>{d.name}</Text>
                  <Text style={styles.documentStatus}>{getStatus(d.id)}</Text>
                </View>
                <AppIcon name="chevron-right" size={22} color={C.muted} />
              </Pressable>
            ))}
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setDigital(true)}
            style={styles.digitalCard}
          >
            <View style={styles.digitalIcon}>
              <AppIcon name="shield-check-outline" size={25} color={C.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.documentTitle}>A guided digital check</Text>
              <Text style={styles.bodySmall}>
                Preview how consent-based verification could work.
              </Text>
            </View>
            <AppIcon name="arrow-right" size={21} color={C.primary} />
          </Pressable>
          {notice ? <BrandNote title="Preview updated" body={notice} /> : null}
        </>
      ) : null}
      <BrandSheet
        visible={!!document}
        title={
          document?.id === "aadhaar"
            ? "Your identity, handled with care"
            : document?.name || "Document preview"
        }
        subtitle="No document is uploaded or verified in this prototype."
        onClose={() => setDocument(null)}
      >
        <View style={styles.guideHero}>
          <BrandMark size={55} />
          <View style={{ flex: 1 }}>
            <Text style={styles.guideTitle}>Clear steps. No guessing.</Text>
            <Text style={styles.body}>
              Review requirements, submit a readable document, then follow its review status.
            </Text>
          </View>
        </View>
        <BrandNote
          title="Only approved methods"
          body="Production identity options and consent must follow the approved verification policy. This demo does not establish eligibility or a guaranteed review time."
          icon="shield-check-outline"
        />
        <Text style={styles.body}>
          Use fictional data for this preview. A failed check should explain the correction needed
          and offer help, not silently block you.
        </Text>
        <BrandButton
          title="Simulate an upload"
          icon="upload-outline"
          onPress={() => {
            if (document) {
              onSimulateUpload(document.id);
              setNotice(
                document.name + " marked pending review locally. No file was selected or sent.",
              );
            }
            setDocument(null);
          }}
        />
        <BrandButton title="Not now" secondary onPress={() => setDocument(null)} />
      </BrandSheet>
      <BrandSheet
        visible={digital}
        title="Digital verification preview"
        subtitle="DigiLocker and issuer services are not connected."
        onClose={() => setDigital(false)}
      >
        <BrandNote
          title="You stay in control"
          body="A real flow needs explicit consent, an authorized provider and a validated response. Opening this preview never means your documents are verified."
          icon="shield-check-outline"
        />
        <BrandButton
          title="Preview review status"
          onPress={() => {
            onPreviewDigital();
            setNotice(
              "Digital verification previewed. Status remains manual review; no provider was contacted.",
            );
            setDigital(false);
          }}
        />
        <BrandButton title="Back to documents" secondary onPress={() => setDigital(false)} />
      </BrandSheet>
    </>
  );
}
const styles = createBrandedStyles({
  vehicleList: { gap: 13 },
  vehicleCard: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 142,
    gap: 14,
    padding: 13,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  vehicleSelected: { borderColor: C.primary, backgroundColor: C.primaryTint },
  vehicleDescription: { flex: 1, paddingTop: 13, minWidth: 0 },
  vehicleBadge: {
    color: C.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    paddingRight: 22,
  },
  vehicleTitle: { color: C.text, fontSize: 18, fontWeight: "800", marginTop: 4, paddingRight: 6 },
  vehicleNote: { color: C.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 4 },
  selectionLabel: { color: C.primary, fontSize: 11, fontWeight: "700", marginTop: 8 },
  vehicleCheck: { position: "absolute", top: 11, right: 11 },
  moreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    minHeight: 48,
    marginTop: 4,
    marginBottom: 12,
  },
  helpText: { color: C.primary, fontSize: 13, fontWeight: "800" },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 15,
    marginBottom: 12,
  },
  sectionTitle: { color: C.text, fontSize: 19, fontWeight: "800", flexShrink: 1 },
  smallLabel: { color: C.muted, fontSize: 10, fontWeight: "800", letterSpacing: 0.6 },
  body: { color: C.textSecondary, fontSize: 14, lineHeight: 21 },
  documentList: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: C.surface,
    marginTop: 13,
  },
  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 15,
    minHeight: 80,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  documentIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  documentTitle: { color: C.text, fontSize: 15, fontWeight: "800" },
  documentStatus: { color: C.muted, fontSize: 12, marginTop: 4 },
  digitalCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 20,
    backgroundColor: C.accentSoft,
    padding: 16,
    marginTop: 14,
  },
  digitalIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.surface,
  },
  bodySmall: { color: C.muted, fontSize: 13, lineHeight: 19, marginTop: 3 },
  guideHero: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 10 },
  guideTitle: { color: C.text, fontSize: 16, fontWeight: "800" },
});
