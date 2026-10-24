import { appConfig } from "@/config/app";
import { BrandButton } from "@/shared/ui/BrandButton";
import { BrandMark } from "@/shared/ui/BrandMark";
import { Card } from "@/shared/ui/Card";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { theme } from "@/shared/theme";
import { createLegacyRiderApi } from "@/services/legacy/client";
import {
  formatInr,
  type LoginResponse,
  type RiderAssignment,
  type RiderProfile,
} from "@/services/legacy/contracts";
import { fromLogin, legacySessionStore, type LegacySession } from "@/services/legacy/session";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LiveAssignmentPanel } from "./components/LiveAssignmentPanel";
import { LiveLogin } from "./components/LiveLogin";

type Page = "work" | "history" | "profile" | "details" | "registration";
function statusName(status: string) {
  return status.replace(/_/g, " ");
}

export function LiveRiderApp() {
  const [page, setPage] = useState<Page>("work");
  const [session, setSession] = useState<LegacySession | null>(null);
  const sessionRef = useRef<LegacySession | null>(null);
  const [booting, setBooting] = useState(true);
  const [storageError, setStorageError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [orders, setOrders] = useState<RiderAssignment[]>([]);
  const [history, setHistory] = useState<RiderAssignment[]>([]);
  const [profile, setProfile] = useState<RiderProfile | null>(null);
  const [workError, setWorkError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [returnPage, setReturnPage] = useState<"work" | "history">("work");
  const [historyFilter, setHistoryFilter] = useState<"ALL" | "DELIVERED" | "FAILED">("ALL");
  const [workSearch, setWorkSearch] = useState("");
  const [newAssignments, setNewAssignments] = useState(0);
  const seenAssignmentIds = useRef<Set<number> | null>(null);

  const endExpiredSession = useCallback(() => {
    sessionRef.current = null;
    setSession(null);
    setPage("work");
    setStorageError("Your session expired. Please sign in again.");
    void legacySessionStore.clear().catch(() => {
      setStorageError(
        "Session expired but local secure storage could not be cleared. Check device storage.",
      );
    });
  }, []);
  const api = useMemo(() => {
    try {
      if (!appConfig.apiBaseUrl) return null;
      return createLegacyRiderApi({
        baseUrl: appConfig.apiBaseUrl,
        timeoutMs: appConfig.requestTimeoutMs,
        getAccessToken: async () => {
          const current = sessionRef.current;
          return current && current.expiresAt > Date.now() ? current.token : null;
        },
        onUnauthorized: endExpiredSession,
      });
    } catch {
      return null;
    }
  }, [endExpiredSession]);

  useEffect(() => {
    let alive = true;
    void legacySessionStore
      .read()
      .then((restored) => {
        if (!alive) return;
        sessionRef.current = restored;
        setSession(restored);
      })
      .catch(() => {
        if (alive)
          setStorageError(
            "Could not read native secure storage. Live sign-in needs Expo Go or a supported development build.",
          );
      })
      .finally(() => {
        if (alive) setBooting(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!session || !api) {
      setOrders([]);
      setHistory([]);
      setProfile(null);
      setNewAssignments(0);
      seenAssignmentIds.current = null;
      return;
    }
    let alive = true;
    const controller = new AbortController();
    async function fetchOrders() {
      const result = await api!.orders(controller.signal);
      if (!alive) return;
      if (result.ok) {
        const nextIds = new Set(result.data.map((item) => item.id));
        const newlyAssigned = seenAssignmentIds.current
          ? result.data.filter((item) => !seenAssignmentIds.current!.has(item.id)).length
          : 0;
        seenAssignmentIds.current = nextIds;
        if (newlyAssigned > 0) setNewAssignments((previous) => previous + newlyAssigned);
        setOrders(result.data);
        setWorkError("");
      } else if (result.error.code !== "CANCELLED" && result.error.code !== "UNAUTHENTICATED")
        setWorkError(result.error.message);
    }
    async function fetchHistory() {
      const result = await api!.history(controller.signal);
      if (!alive) return;
      if (result.ok) {
        setHistory(result.data);
        setHistoryError("");
      } else if (result.error.code !== "CANCELLED" && result.error.code !== "UNAUTHENTICATED")
        setHistoryError(result.error.message);
    }
    async function fetchProfile() {
      const result = await api!.profile(controller.signal);
      if (!alive) return;
      if (result.ok) {
        setProfile(result.data);
        setProfileError("");
      } else if (result.error.code !== "CANCELLED" && result.error.code !== "UNAUTHENTICATED")
        setProfileError(result.error.message);
    }
    setLoading(true);
    void Promise.all([fetchOrders(), fetchHistory(), fetchProfile()]).finally(() => {
      if (alive) setLoading(false);
    });
    const timer = setInterval(() => {
      if (AppState.currentState === "active") void fetchOrders();
    }, 30000);
    const appListener = AppState.addEventListener("change", (state) => {
      if (state === "active") void fetchOrders();
    });
    return () => {
      alive = false;
      controller.abort();
      clearInterval(timer);
      appListener.remove();
    };
  }, [session, api, reload]);

  const login = async (result: LoginResponse) => {
    const next = fromLogin(result);
    const saved = await legacySessionStore.save(next);
    if (!saved) throw new Error("Session changed; please sign in again.");
    sessionRef.current = next;
    setSession(next);
    setStorageError("");
    setPage("work");
  };
  const logout = async () => {
    try {
      await legacySessionStore.clear();
      sessionRef.current = null;
      setSession(null);
      setPage("work");
      setStorageError("");
    } catch {
      setStorageError("Could not clear secure storage. Please try signing out again.");
    }
  };
  if (appConfig.configurationError || !api)
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <BrandMark size={55} />
          <ScreenHero
            eyebrow="CONFIGURATION"
            title="Backend address needed"
            subtitle="Set EXPO_PUBLIC_API_BASE_URL to the backend's HTTPS server origin (not /api/rider-app), then restart Expo."
            icon="alert-circle-outline"
          />
          <Text style={s.error}>
            {appConfig.configurationError ?? "The configured API URL must be a valid HTTPS origin."}
          </Text>
        </View>
      </SafeAreaView>
    );
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandRow}>
          <BrandMark size={36} />
          <Text style={styles.brandLabel}>YBM RIDER · LIVE API</Text>
        </View>
        {booting ? (
          <Text style={s.body}>Checking your rider session…</Text>
        ) : !session ? (
          <>
            {storageError ? (
              <Card tone="amber">
                <Text accessibilityRole="alert" style={s.error}>
                  {storageError}
                </Text>
              </Card>
            ) : null}
            {page === "registration" ? (
              <>
                <ScreenHero
                  eyebrow="BECOME A RIDER"
                  title="Join Build Your Mart"
                  subtitle="Public registration is planned. No real application or KYC is submitted from this build."
                  icon="account-plus-outline"
                />
                <Card>
                  <Text style={s.heading}>How registration will work</Text>
                  <Text style={s.body}>1. Verify your mobile number.</Text>
                  <Text style={s.body}>
                    2. Complete profile, work area and vehicle information.
                  </Text>
                  <Text style={s.body}>3. Submit required documents securely.</Text>
                  <Text style={s.body}>4. Track review and corrections.</Text>
                  <Text style={s.body}>5. After server approval, get access to assignments.</Text>
                  <Text style={s.small}>
                    Registration, upload and approval APIs are not in the existing rider-api.txt
                    contract. This page does not claim to create an account.
                  </Text>
                </Card>
                <BrandButton
                  title="Back to existing rider sign-in"
                  onPress={() => setPage("work")}
                />
              </>
            ) : (
              <LiveLogin api={api} onLogin={login} onRegister={() => setPage("registration")} />
            )}
          </>
        ) : (
          <>
            <View style={styles.tabs}>
              {(["work", "history", "profile"] as const).map((tab) => (
                <View key={tab} style={styles.tab}>
                  <BrandButton
                    title={tab === "work" ? "Work" : tab === "history" ? "History" : "Profile"}
                    secondary={page !== tab}
                    onPress={() => setPage(tab)}
                  />
                </View>
              ))}
            </View>
            {storageError ? (
              <Card tone="amber">
                <Text style={s.error}>{storageError}</Text>
              </Card>
            ) : null}
            {page === "details" && selectedId ? (
              <LiveAssignmentPanel
                api={api}
                assignmentId={selectedId}
                onBack={() => setPage(returnPage)}
              />
            ) : null}
            {page === "work" ? (
              <>
                <ScreenHero
                  eyebrow="SERVER ASSIGNMENTS"
                  title="Your work"
                  subtitle="Assigned deliveries from the existing rider backend. Updated while the app is active."
                  icon="truck-delivery-outline"
                />
                {newAssignments > 0 ? (
                  <Card tone="blue">
                    <Text accessibilityLiveRegion="polite" style={s.heading}>
                      {newAssignments} new assignment{newAssignments === 1 ? "" : "s"} received
                    </Text>
                    <Text style={s.small}>
                      Detected while the app is active; not a background push alert.
                    </Text>
                    <BrandButton
                      title="Dismiss new assignment notice"
                      secondary
                      onPress={() => setNewAssignments(0)}
                    />
                  </Card>
                ) : null}
                {loading ? <Text style={s.body}>Refreshing your assigned work…</Text> : null}
                {workError ? (
                  <Card tone="amber">
                    <Text accessibilityRole="alert" style={s.error}>
                      {workError}
                    </Text>
                  </Card>
                ) : null}
                <BrandButton
                  title="Refresh work list"
                  secondary
                  onPress={() => setReload((v) => v + 1)}
                />
                {!loading && orders.length === 0 ? (
                  <Card>
                    <Text style={s.body}>
                      No active assignments. Operations assigns deliveries; this API does not offer
                      public order acceptance.
                    </Text>
                  </Card>
                ) : null}
                <TextInput
                  accessibilityLabel="Search assigned orders"
                  placeholder="Search order number or customer"
                  value={workSearch}
                  onChangeText={setWorkSearch}
                  autoCorrect={false}
                  style={styles.search}
                />
                {orders
                  .filter((order) =>
                    (order.orderNumber + " " + order.customerName)
                      .toLowerCase()
                      .includes(workSearch.trim().toLowerCase()),
                  )
                  .map((order) => (
                    <Card key={order.id}>
                      <Text style={s.heading}>{order.orderNumber}</Text>
                      <Row label="Status" value={statusName(order.status)} />
                      <Row label="Pickup" value={order.warehouseName} />
                      <Text style={s.body}>Drop: {order.deliveryAddress}</Text>
                      <Row
                        label={order.paymentMethod === "COD" ? "COD order amount" : "Order amount"}
                        value={formatInr(order.grandTotal)}
                      />
                      <BrandButton
                        title="View assignment details"
                        onPress={() => {
                          setSelectedId(order.id);
                          setReturnPage("work");
                          setPage("details");
                        }}
                      />
                    </Card>
                  ))}
              </>
            ) : null}
            {page === "history" ? (
              <>
                <ScreenHero
                  eyebrow="SERVER HISTORY"
                  title="Delivery history"
                  subtitle="Includes ongoing, delivered and failed assignments. No locally simulated receipts are included."
                  icon="history"
                />
                {historyError ? (
                  <Card tone="amber">
                    <Text accessibilityRole="alert" style={s.error}>
                      {historyError}
                    </Text>
                  </Card>
                ) : null}
                <BrandButton
                  title="Refresh history"
                  secondary
                  onPress={() => setReload((v) => v + 1)}
                />
                <Card>
                  <Row
                    label="Delivered"
                    value={String(history.filter((o) => o.status === "DELIVERED").length)}
                  />
                  <Row
                    label="Failed"
                    value={String(history.filter((o) => o.status === "FAILED").length)}
                  />
                  <Text style={s.small}>
                    The backend currently returns an unpaginated list. These counts cover only its
                    returned records.
                  </Text>
                </Card>
                {history.length === 0 && !loading ? (
                  <Text style={s.body}>No history returned by the server.</Text>
                ) : null}
                <View style={styles.tabs}>
                  {(["ALL", "DELIVERED", "FAILED"] as const).map((filter) => (
                    <View key={filter} style={styles.tab}>
                      <BrandButton
                        title={
                          filter === "ALL" ? "All" : filter === "DELIVERED" ? "Delivered" : "Failed"
                        }
                        secondary={historyFilter !== filter}
                        onPress={() => setHistoryFilter(filter)}
                      />
                    </View>
                  ))}
                </View>
                {history
                  .filter((item) => historyFilter === "ALL" || item.status === historyFilter)
                  .map((order) => (
                    <Card key={order.id}>
                      <Text style={s.heading}>{order.orderNumber}</Text>
                      <Row label="Status" value={statusName(order.status)} />
                      <Row label="Order total" value={formatInr(order.grandTotal)} />
                      <Text style={s.small}>Assigned: {order.assignedAt}</Text>
                      <BrandButton
                        title="View server details"
                        secondary
                        onPress={() => {
                          setSelectedId(order.id);
                          setReturnPage("history");
                          setPage("details");
                        }}
                      />
                    </Card>
                  ))}
              </>
            ) : null}
            {page === "profile" ? (
              <>
                <ScreenHero
                  eyebrow="EXISTING RIDER"
                  title="My profile"
                  subtitle="Read-only values from the existing rider backend."
                  icon="account-circle-outline"
                />
                {profileError ? (
                  <Card tone="amber">
                    <Text accessibilityRole="alert" style={s.error}>
                      {profileError}
                    </Text>
                  </Card>
                ) : null}
                <Card>
                  <Row label="Rider" value={profile?.name ?? "Loading…"} />
                  <Row label="Phone" value={profile?.phone ?? session.username} />
                  <Row label="Vehicle" value={profile?.vehicleType ?? "—"} />
                  <Row label="Availability" value={profile?.status ?? "—"} />
                  <Text style={s.small}>
                    Status toggle is intentionally disabled: the current endpoint toggles blindly.
                    Profile and document edits are admin-managed.
                  </Text>
                </Card>
                <Card tone="amber">
                  <Text style={s.heading}>Public onboarding is not live yet</Text>
                  <Text style={s.body}>
                    New registrations and KYC approval require the backend's applicant and document
                    APIs. Existing credentials continue to work.
                  </Text>
                </Card>
                <BrandButton
                  title="Refresh profile"
                  secondary
                  onPress={() => setReload((v) => v + 1)}
                />
                <BrandButton
                  title="Sign out on this device"
                  secondary
                  onPress={() => void logout()}
                />
                <Text style={s.small}>
                  The documented backend has no logout/revocation endpoint. Local sign-out deletes
                  the secure token; previously issued JWTs may remain valid until server expiry.
                </Text>
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 46,
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
    gap: 10,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingBottom: 10 },
  search: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 14,
    fontSize: 15,
    color: theme.colors.text,
  },
  brandLabel: { fontSize: 12, fontWeight: "800", letterSpacing: 0.7, color: theme.colors.primary },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 8 },
  tab: { flex: 1 },
});
