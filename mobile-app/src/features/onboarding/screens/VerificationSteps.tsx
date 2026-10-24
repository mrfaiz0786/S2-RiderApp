import { sampleDocuments } from "@/features/onboarding/data/fixtures";
import { vehicleDocumentIds } from "@/features/onboarding/data/vehicles";
import { useOnboarding } from "@/features/onboarding/model";
import { bankSetupIssue } from "@/features/onboarding/model/bankValidation";
import { useNavigation } from "@/navigation/NavigationProvider";
import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { BrandButton } from "@/shared/ui/BrandButton";
import { BrandedAlert as Alert } from "@/shared/ui/BrandDialog";
import { Card } from "@/shared/ui/Card";
import { Field } from "@/shared/ui/Field";
import { OnboardingProgress } from "@/shared/ui/OnboardingProgress";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.choice, selected && styles.selected]}
    >
      <Text style={styles.choiceText}>
        {selected ? "● " : "○ "}
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function IdentityScreen() {
  const state = useOnboarding();
  const { navigate } = useNavigation();
  const ready =
    !!state.identityMethod &&
    state.address.trim().length >= 8 &&
    (state.identityMethod !== "Aadhaar" || state.identityConsent);
  return (
    <>
      <ScreenHero
        eyebrow="STEP 5 · IDENTITY"
        title="Identity & address"
        subtitle="Choose an identity option and enter an address for review."
        icon="shield-check-outline"
        compact
      />
      <OnboardingProgress current={5} total={10} />
      <Card>
        <Text style={styles.heading}>
          Choose identity option <Text style={styles.star}>*</Text>
        </Text>
        <Choice
          label="Aadhaar offline check"
          selected={state.identityMethod === "Aadhaar"}
          onPress={() => state.setField("identityMethod", "Aadhaar")}
        />
        <Choice
          label="Alternative ID / address proof"
          selected={state.identityMethod === "Alternative ID"}
          onPress={() => state.setField("identityMethod", "Alternative ID")}
        />
        {state.identityMethod === "Aadhaar" ? (
          <TouchableOpacity
            accessibilityRole="checkbox"
            accessibilityState={{ checked: state.identityConsent }}
            onPress={() => state.setFlag("identityConsent", !state.identityConsent)}
            style={styles.choice}
          >
            <Text style={styles.choiceText}>
              {state.identityConsent ? "☑" : "□"} I consent to an Aadhaar offline identity check for
              rider onboarding. <Text style={styles.star}>*</Text>
            </Text>
          </TouchableOpacity>
        ) : null}
        <Field
          label="Current address"
          required
          value={state.address}
          onChangeText={(value) => state.setField("address", value)}
          placeholder="House, street, area and PIN code"
        />
        <Text style={styles.note}>
          Demo only. Do not enter an Aadhaar number here. Production needs an approved provider,
          clear disclosure and masked storage.
        </Text>
        <BrandButton
          title="Continue to documents →"
          disabled={!ready}
          onPress={() => navigate("document-check")}
        />
      </Card>
    </>
  );
}

export function DocumentCheckScreen() {
  const state = useOnboarding();
  const { navigate } = useNavigation();
  const ids = vehicleDocumentIds[state.vehicle] || vehicleDocumentIds["Two-Wheeler"];
  const documents = sampleDocuments.filter((item) => ids.includes(item.id));
  const ready = documents.every((item) => state.docStates[item.id] === "Pending review");
  return (
    <>
      <ScreenHero
        eyebrow="STEP 6 · DOCUMENTS"
        title="PAN & vehicle documents"
        subtitle="Complete each applicable document preview before moving on."
        icon="file-document-outline"
        compact
      />
      <OnboardingProgress current={6} total={10} />
      <Card>
        {documents.map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.heading}>
                {item.name} <Text style={styles.star}>*</Text>
              </Text>
              <Text style={styles.note}>
                {state.docStates[item.id] === "Pending review"
                  ? "Marked for demo review"
                  : item.detail}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => state.setDoc(item.id, "Pending review")}
              style={styles.mark}
            >
              <Text style={styles.markText}>
                {state.docStates[item.id] === "Pending review" ? "Done" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
        <Text style={styles.note}>
          No real file is uploaded or verified. Motor vehicles require DL, RC and insurance; bicycle
          riders see only applicable documents.
        </Text>
        <BrandButton
          title="Continue to selfie & bank →"
          disabled={!ready}
          onPress={() => navigate("selfie-bank")}
        />
      </Card>
    </>
  );
}

export function SelfieBankScreen() {
  const state = useOnboarding();
  const { navigate } = useNavigation();
  const [showIssue, setShowIssue] = useState(false);
  const issue = bankSetupIssue(state);
  return (
    <>
      <ScreenHero
        eyebrow="STEP 7 · PAYOUT SETUP"
        title="Selfie & bank details"
        subtitle="Finish the demo identity and payout checklist."
        icon="account-check-outline"
        compact
      />
      <OnboardingProgress current={7} total={10} />
      <Card>
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: state.selfieReady }}
          onPress={() => state.setFlag("selfieReady", !state.selfieReady)}
          style={styles.choice}
        >
          <Text style={styles.choiceText}>
            {state.selfieReady ? "☑" : "□"} Selfie step reviewed (demo){" "}
            <Text style={styles.star}>*</Text>
          </Text>
        </TouchableOpacity>
        <Field
          label="Bank account holder"
          required
          value={state.bankHolder}
          onChangeText={(value) => state.setField("bankHolder", value)}
          placeholder="Name on bank account"
        />
        <Field
          label="Account number (use fictional data)"
          required
          value={state.bankAccount}
          onChangeText={(value) => state.setField("bankAccount", value.replace(/\D/g, ""))}
          keyboardType="number-pad"
          maxLength={18}
        />
        <Text style={styles.inputHint}>6–18 digits. Example: 1234567890</Text>
        <Field
          label="IFSC (use fictional data)"
          required
          value={state.bankIfsc}
          onChangeText={(value) => state.setField("bankIfsc", value.toUpperCase())}
          maxLength={11}
        />
        <Text style={styles.inputHint}>
          11 characters: 4 letters, 0, then 6 letters or digits. Example: SBIN0001234
        </Text>
        {showIssue && issue ? (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {issue}
          </Text>
        ) : null}
        <Text style={styles.note}>
          No camera, face matching or bank validation is connected. Use fictional details in this
          demo.
        </Text>
        <BrandButton
          title="Continue to consent →"
          onPress={() => {
            if (issue) {
              setShowIssue(true);
              Alert.alert("Complete bank setup", issue);
              return;
            }
            navigate("declarations");
          }}
        />
      </Card>
    </>
  );
}

export function TrainingScreen() {
  const state = useOnboarding();
  const { navigate } = useNavigation();
  return (
    <>
      <ScreenHero
        eyebrow="STEP 10 · TRAINING"
        title="Delivery training"
        subtitle="Review the basic handover sequence before entering the demo Home."
        icon="school-outline"
        compact
      />
      <OnboardingProgress current={10} total={10} />
      <Card>
        <Text style={styles.heading}>1. Accept an order</Text>
        <Text style={styles.note}>Check pickup location and delivery details.</Text>
        <Text style={styles.heading}>2. Confirm pickup</Text>
        <Text style={styles.note}>Collect the correct package from the selected store.</Text>
        <Text style={styles.heading}>3. Confirm delivery</Text>
        <Text style={styles.note}>Follow the route and complete the handover in the app.</Text>
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: state.trainingCompleted }}
          onPress={() => state.setFlag("trainingCompleted", !state.trainingCompleted)}
          style={styles.choice}
        >
          <Text style={styles.choiceText}>
            {state.trainingCompleted ? "☑" : "□"} I reviewed these demo training steps{" "}
            <Text style={styles.star}>*</Text>
          </Text>
        </TouchableOpacity>
        <Text style={styles.note}>
          This does not grant real rider approval. Real activation needs verified documents,
          background clearance and completed training.
        </Text>
        <BrandButton
          title="Open demo Home →"
          disabled={!state.trainingCompleted}
          onPress={() => navigate("home")}
        />
      </Card>
    </>
  );
}

const styles = createBrandedStyles({
  heading: { color: theme.colors.text, fontSize: 15, fontWeight: "800", marginBottom: 6 },
  star: { color: theme.colors.danger },
  inputHint: { color: theme.colors.muted, fontSize: 11, marginBottom: 8 },
  error: { color: theme.colors.danger, fontSize: 12, fontWeight: "700", marginBottom: 8 },
  note: { color: theme.colors.muted, fontSize: 12, lineHeight: 19, marginBottom: 12 },
  choice: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 10,
    backgroundColor: theme.colors.surface,
  },
  selected: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primarySoft },
  choiceText: { color: theme.colors.text, fontSize: 14, fontWeight: "700" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 8,
  },
  flex: { flex: 1 },
  mark: {
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  markText: { color: theme.colors.primary, fontWeight: "800" },
});
