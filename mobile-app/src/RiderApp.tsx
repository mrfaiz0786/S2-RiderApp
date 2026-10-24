import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type OrderStatus = "offered" | "accepted" | "picked_up" | "completed";
type Order = {
  id: string;
  reference: string;
  product_name: string;
  product_image_url: string;
  pickup_name: string;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  drop_name: string;
  drop_address: string;
  drop_lat: number;
  drop_lng: number;
  fee_rupees: number;
  status: OrderStatus;
  created_at: string;
};
type Page =
  "welcome" | "login" | "register" | "otp" | "registration" | "dashboard" | "order" | "map";
declare const process: { env: Record<string, string | undefined> };
const API = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const KEY = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
const enabled = Boolean(API && KEY);
const TEST_PHONE = "9999999999";
const TEST_OTP = "123456";
const palette = {
  teal: "#07474E",
  orange: "#FF8A16",
  bg: "#F7F8F5",
  ink: "#15373A",
  faint: "#62787A",
  white: "#FFFFFF",
  border: "#DEE7E4",
  pale: "#E6F3EF",
};
const places = [
  { name: "Rohini, Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Karol Bagh, Delhi", lat: 28.6519, lng: 77.1907 },
  { name: "Saket, New Delhi", lat: 28.5244, lng: 77.2066 },
  { name: "Dwarka, New Delhi", lat: 28.5921, lng: 77.046 },
  { name: "Noida Sector 18, NCR", lat: 28.5708, lng: 77.3261 },
  { name: "Gurugram Sector 29, NCR", lat: 28.4696, lng: 77.0631 },
  { name: "Ghaziabad, NCR", lat: 28.6692, lng: 77.4538 },
  { name: "Lajpat Nagar, New Delhi", lat: 28.5677, lng: 77.2433 },
];
const goods = [
  {
    name: "Cement bags",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=480&q=75",
  },
  {
    name: "Red clay bricks",
    image: "https://images.unsplash.com/photo-1590725175990-708c25c59427?w=480&q=75",
  },
  {
    name: "Steel reinforcement rods",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=480&q=75",
  },
  {
    name: "Floor tiles",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=480&q=75",
  },
  {
    name: "Wall paint buckets",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=480&q=75",
  },
];
function simulatedOrder(): Order {
  const a = Math.floor(Math.random() * places.length),
    b = (a + 1 + Math.floor(Math.random() * (places.length - 1))) % places.length,
    g = goods[Math.floor(Math.random() * goods.length)];
  return {
    id: "local-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
    reference: "DEMO-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    product_name: g.name,
    product_image_url: g.image,
    pickup_name: places[a].name,
    pickup_address: places[a].name,
    pickup_lat: places[a].lat,
    pickup_lng: places[a].lng,
    drop_name: places[b].name,
    drop_address: places[b].name,
    drop_lat: places[b].lat,
    drop_lng: places[b].lng,
    fee_rupees: 75 + Math.floor(Math.random() * 150),
    status: "offered",
    created_at: new Date().toISOString(),
  };
}
function distance(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = Math.PI / 180,
    dLat = (b.lat - a.lat) * rad,
    dLng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
// Custom graph and Dijkstra algorithm, independent of Google. This is a schematic, not turn-by-turn road routing.
const graph: number[][] = [
  [1, 3],
  [0, 2, 7],
  [1, 5, 7],
  [0, 5],
  [6, 7],
  [2, 3],
  [4, 1],
  [1, 2, 4],
];
function routeBetween(a: Order) {
  const getNearest = (lat: number, lng: number) =>
    places.reduce(
      (best, p, i) => (distance({ lat, lng }, p) < distance({ lat, lng }, places[best]) ? i : best),
      0,
    );
  const start = getNearest(a.pickup_lat, a.pickup_lng),
    end = getNearest(a.drop_lat, a.drop_lng);
  const dist = places.map(() => Infinity),
    prev = places.map(() => -1),
    visited = new Set<number>();
  dist[start] = 0;
  for (let n = 0; n < places.length; n++) {
    let u = -1;
    for (let i = 0; i < places.length; i++)
      if (!visited.has(i) && (u < 0 || dist[i] < dist[u])) u = i;
    if (u < 0 || !Number.isFinite(dist[u])) break;
    visited.add(u);
    if (u === end) break;
    for (const v of graph[u]) {
      const cand = dist[u] + distance(places[u], places[v]);
      if (cand < dist[v]) {
        dist[v] = cand;
        prev[v] = u;
      }
    }
  }
  const path: number[] = [];
  let at = end;
  for (let n = 0; n < places.length && at >= 0; n++) {
    path.unshift(at);
    if (at === start) break;
    at = prev[at];
  }
  return { path: path[0] === start ? path : [start, end], km: Math.round(dist[end] * 10) / 10 };
}
async function api(path: string, token: string, opts?: { method?: string; body?: unknown }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const r = await fetch(API + path, {
      method: opts?.method || "GET",
      headers: {
        apikey: KEY,
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: opts?.body === undefined ? undefined : JSON.stringify(opts.body),
      signal: controller.signal,
    });
    const content = await r.text();
    const data = content ? JSON.parse(content) : null;
    if (!r.ok)
      throw new Error(
        data?.message || data?.msg || data?.error_description || "Server error " + r.status,
      );
    return data;
  } finally {
    clearTimeout(timeout);
  }
}
function BigButton({
  title,
  onPress,
  secondary = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, secondary && styles.secondary, disabled && { opacity: 0.5 }]}
    >
      <Text style={[styles.buttonText, secondary && { color: palette.teal }]}>{title}</Text>
    </TouchableOpacity>
  );
}
function Input({
  label,
  value,
  onChange,
  placeholder,
  secure = false,
  keyboard = "default",
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  secure?: boolean;
  keyboard?: "default" | "phone-pad" | "email-address" | "numeric";
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#829495"
        secureTextEntry={secure}
        keyboardType={keyboard}
        autoCapitalize="none"
      />
    </View>
  );
}
function MapView({ order }: { order: Order }) {
  const route = routeBetween(order);
  const coords = (p: { lat: number; lng: number }) => ({
    x: 8 + ((p.lng - 77.0) / 0.49) * 84,
    y: 8 + ((28.77 - p.lat) / 0.37) * 84,
  });
  return (
    <View>
      <Text style={styles.sub}>YBM Delhi NCR schematic map</Text>
      <View style={styles.map}>
        {places.map((p, i) => {
          const at = coords(p);
          return (
            <View
              key={p.name}
              style={[
                styles.dot,
                {
                  left: (at.x + "%") as `${number}%`,
                  top: (at.y + "%") as `${number}%`,
                  backgroundColor: route.path.includes(i) ? palette.orange : palette.teal,
                },
              ]}
            />
          );
        })}
        {route.path.slice(1).map((point, i) => {
          const a = coords(places[route.path[i]]),
            b = coords(places[point]);
          const w = Math.hypot(b.x - a.x, b.y - a.y);
          const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
          return (
            <View
              key={point}
              style={{
                position: "absolute",
                left: (a.x + "%") as `${number}%`,
                top: (a.y + "%") as `${number}%`,
                width: (w + "%") as `${number}%`,
                height: 3,
                backgroundColor: palette.orange,
                transform: [{ rotate: deg + "deg" }],
                transformOrigin: "left center",
              }}
            />
          );
        })}
        <Text style={[styles.mapLabel, { top: 8, left: 8 }]}>DELHI</Text>
        <Text style={[styles.mapLabel, { bottom: 8, right: 8 }]}>NCR</Text>
      </View>
      <Text style={styles.help}>
        Suggested graph route: {route.path.map((i) => places[i].name.split(",")[0]).join(" → ")}
      </Text>
      <Text style={styles.help}>
        Approx. {route.km} km between graph nodes. Not road directions; do not use for live
        navigation.
      </Text>
    </View>
  );
}
export default function RiderApp() {
  const [page, setPage] = useState<Page>("welcome"),
    [mode, setMode] = useState<"login" | "register">("login"),
    [phone, setPhone] = useState(TEST_PHONE),
    [otp, setOtp] = useState(""),
    [name, setName] = useState(""),
    [step, setStep] = useState(0),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [token, setToken] = useState(""),
    [demo, setDemo] = useState(true),
    [orders, setOrders] = useState<Order[]>([]),
    [selected, setSelected] = useState<string | null>(null),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [online, setOnline] = useState(true),
    [clock, setClock] = useState(Date.now()),
    [lastCreated, setLastCreated] = useState(0);
  const selectedOrder = orders.find((o) => o.id === selected),
    active = orders.filter((o) => o.status !== "completed"),
    finished = orders.filter((o) => o.status === "completed");
  const load = useCallback(async () => {
    if (!token) return;
    try {
      const d = await api(
        "/rest/v1/rider_test_orders?select=*&order=created_at.desc&limit=100",
        token,
      );
      if (Array.isArray(d)) setOrders(d);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    }
  }, [token]);
  const create = useCallback(async () => {
    if (!online || active.length >= 5 || busy) return;
    if (Date.now() - lastCreated < 30000) return;
    if (demo) {
      setOrders((old) => [simulatedOrder(), ...old]);
      setLastCreated(Date.now());
      return;
    }
    if (!token) return;
    setBusy(true);
    try {
      const next = await api("/rest/v1/rpc/create_rider_test_order", token, {
        method: "POST",
        body: {},
      });
      setOrders((old) => [next, ...old]);
      setLastCreated(Date.now());
      setMessage("");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, [online, active.length, busy, lastCreated, demo, token]);
  useEffect(() => {
    const interval = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (token) void load();
  }, [token, load]);
  useEffect(() => {
    if (
      page === "dashboard" &&
      online &&
      active.length < 5 &&
      clock - lastCreated >= 30000 &&
      !busy
    )
      void create();
  }, [page, online, active.length, clock, lastCreated, busy, create]);
  const progress = (value: string) => {
    setMessage(value);
  };
  const continueOtp = () => {
    if (!/^\d{10}$/.test(phone)) {
      progress("Enter a valid 10-digit number.");
      return;
    }
    setMessage("");
    setOtp("");
    setPage("otp");
  };
  const confirmOtp = () => {
    if (otp !== TEST_OTP) {
      progress("Incorrect test OTP. Use 123456.");
      return;
    }
    setMessage("");
    if (mode === "register") {
      setStep(0);
      setPage("registration");
    } else {
      setDemo(true);
      setPage("dashboard");
    }
  };
  const registrationSteps = [
    { title: "Your name", hint: "Enter your name to continue." },
    { title: "Choose vehicle", hint: "Bike, scooter, bicycle or delivery van." },
    { title: "Work in Delhi NCR", hint: "Your test orders will be only in Delhi and NCR." },
    {
      title: "Identity check (simulation)",
      hint: "Aadhaar, PAN, driving licence and selfie are simulated. Do not upload sensitive documents.",
    },
    { title: "Bank details (simulation)", hint: "No bank account number is needed in this test." },
    { title: "Practice delivery", hint: "Learn to accept, pick up and deliver an order." },
  ];
  async function realSignIn() {
    if (!enabled) {
      progress("Supabase URL and publishable key are not configured.");
      return;
    }
    if (!email.includes("@") || password.length < 6) {
      progress("Enter your verified email and password (6+ characters).");
      return;
    }
    setBusy(true);
    try {
      const data = await api("/auth/v1/token?grant_type=password", KEY, {
        method: "POST",
        body: { email, password },
      });
      if (!data.access_token) throw new Error("No session received");
      setToken(data.access_token);
      setDemo(false);
      setMessage("");
      setOrders([]);
      setLastCreated(0);
      setPage("dashboard");
    } catch (e) {
      progress(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }
  async function advance(o: Order) {
    const next: Record<OrderStatus, OrderStatus> = {
      offered: "accepted",
      accepted: "picked_up",
      picked_up: "completed",
      completed: "completed",
    };
    const status = next[o.status];
    if (o.status === "completed") return;
    if (!demo) {
      setBusy(true);
      try {
        await api("/rest/v1/rpc/advance_rider_test_order", token, {
          method: "POST",
          body: { p_order_id: o.id, p_next_status: status },
        });
      } catch (e) {
        progress(e instanceof Error ? e.message : String(e));
        setBusy(false);
        return;
      }
      setBusy(false);
    }
    setOrders((old) => old.map((item) => (item.id === o.id ? { ...item, status } : item)));
    setMessage(
      status === "completed" ? "Delivery complete! A new order may arrive after 30 seconds." : "",
    );
    if (status === "completed") {
      setPage("dashboard");
      setSelected(null);
    }
  }
  const reset = () => {
    setToken("");
    setOrders([]);
    setPage("welcome");
    setSelected(null);
    setLastCreated(0);
    setMessage("");
  };
  const head =
    page === "welcome"
      ? "YBM RIDER"
      : page === "login"
        ? "Rider Login"
        : page === "register"
          ? "Rider Registration"
          : page === "otp"
            ? "Verify Test OTP"
            : page === "registration"
              ? "Join as Rider"
              : page === "dashboard"
                ? "My Deliveries"
                : page === "map"
                  ? "My Route"
                  : "Delivery Details";
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={palette.bg} barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.root} keyboardShouldPersistTaps="handled">
        <View style={styles.top}>
          <View style={styles.logo}>
            <Text style={{ fontWeight: "900", fontSize: 22, color: palette.white }}>Y</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>YOURBUILDMART • RIDER</Text>
            <Text style={styles.title}>{head}</Text>
          </View>
        </View>
        {page !== "welcome" && (
          <TouchableOpacity
            onPress={() => {
              if (page === "dashboard") reset();
              else if (page === "map") setPage("order");
              else if (page === "order") setPage("dashboard");
              else setPage("welcome");
              setMessage("");
            }}
            style={styles.back}
          >
            <Text style={styles.link}>← {page === "dashboard" ? "Sign out" : "Back"}</Text>
          </TouchableOpacity>
        )}
        {message !== "" && (
          <View style={styles.note}>
            <Text style={styles.noteText}>{message}</Text>
          </View>
        )}
        {page === "welcome" && (
          <>
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>Deliver. Earn. Easy.</Text>
              <Text style={styles.heroBody}>
                Everything you need for deliveries on one simple screen.
              </Text>
              <Text style={styles.heroBody}>📍 Delhi and Delhi NCR only</Text>
            </View>
            <BigButton
              title="I already have an account  →"
              onPress={() => {
                setMode("login");
                setPage("login");
              }}
            />
            <BigButton
              title="Register as a new rider  →"
              secondary
              onPress={() => {
                setMode("register");
                setPage("register");
              }}
            />
            <Text style={styles.help}>
              New test app. No old API. No Google Maps. Test orders are not customer purchases.
            </Text>
          </>
        )}
        {(page === "login" || page === "register") && (
          <>
            <Text style={styles.sub}>
              {page === "login"
                ? "Sign in using the separate test flow."
                : "Try the complete rider registration, with no documents or personal data saved."}
            </Text>
            <View style={styles.card}>
              <Input
                label="Test mobile number"
                value={phone}
                onChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 10))}
                keyboard="phone-pad"
                placeholder="9999999999"
              />
              <Text style={styles.help}>
                Test number: {TEST_PHONE} • Test OTP: {TEST_OTP}
              </Text>
              <BigButton title="Continue with test OTP →" onPress={continueOtp} />
            </View>
            {page === "login" && (
              <View style={styles.card}>
                <Text style={styles.sub}>Real Supabase test-order account</Text>
                <Text style={styles.help}>
                  Optional: use an existing verified Supabase email account to store actual
                  test-order records. The phone OTP above is simulation only.
                </Text>
                <Input
                  label="Verified email"
                  value={email}
                  onChange={setEmail}
                  keyboard="email-address"
                />
                <Input label="Password" value={password} onChange={setPassword} secure />
                <BigButton
                  title={busy ? "Signing in..." : "Sign in to Supabase"}
                  onPress={() => void realSignIn()}
                  disabled={busy}
                />
              </View>
            )}
          </>
        )}
        {page === "otp" && (
          <View style={styles.card}>
            <Text style={styles.sub}>Code for +91 {phone}</Text>
            <Text style={styles.help}>SIMULATION: no SMS is sent. Enter test code 123456.</Text>
            <Input
              label="6-digit OTP"
              value={otp}
              onChange={(v) => setOtp(v.replace(/\D/g, "").slice(0, 6))}
              keyboard="numeric"
            />
            <BigButton title="Verify and continue →" onPress={confirmOtp} />
          </View>
        )}
        {page === "registration" && (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>
              STEP {step + 1} OF {registrationSteps.length} • SIMULATION
            </Text>
            <Text style={styles.section}>{registrationSteps[step].title}</Text>
            <Text style={styles.sub}>{registrationSteps[step].hint}</Text>
            {step === 0 && (
              <Input
                label="Name (test only)"
                value={name}
                onChange={setName}
                placeholder="Rider name"
              />
            )}
            {step === 1 && (
              <Text style={styles.help}>
                🛵 Bike / scooter / bicycle / van • simulated selection
              </Text>
            )}
            {step === 2 && (
              <Text style={styles.help}>📍 Delhi • Noida • Ghaziabad • Gurugram • Faridabad</Text>
            )}
            {step === 3 && (
              <Text style={styles.help}>
                ✅ Documents marked as checked for simulation only, not verified.
              </Text>
            )}
            {step === 4 && (
              <Text style={styles.help}>
                ✅ Bank information skipped; this is a practice journey.
              </Text>
            )}
            {step === 5 && (
              <Text style={styles.help}>
                1. Accept → 2. Pick up → 3. Complete. Your practice is ready!
              </Text>
            )}
            <BigButton
              title={
                step === registrationSteps.length - 1 ? "Finish test registration →" : "Next step →"
              }
              onPress={() => {
                if (step === 0 && name.trim().length < 2) {
                  progress("Please enter a test name.");
                  return;
                }
                setMessage("");
                if (step === registrationSteps.length - 1) {
                  setDemo(true);
                  setOrders([]);
                  setLastCreated(0);
                  setPage("dashboard");
                } else setStep((x) => x + 1);
              }}
            />
          </View>
        )}
        {page === "dashboard" && (
          <>
            <View style={styles.banner}>
              <Text style={styles.bannerBig}>{demo ? "PRACTICE MODE" : "SUPABASE TEST MODE"}</Text>
              <Text style={styles.bannerSmall}>
                {demo
                  ? "Orders are simulated on this device; nothing is saved."
                  : "Test order records are stored in Supabase, not customer deliveries."}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.section}>You are {online ? "🟢 Online" : "🔴 Offline"}</Text>
              <BigButton
                title={online ? "Go offline" : "Go online"}
                secondary
                onPress={() => setOnline((v) => !v)}
              />
              <Text style={styles.help}>
                Active orders: {active.length} / 5 • Completed: {finished.length}
              </Text>
              <Text style={styles.help}>
                {active.length >= 5
                  ? "Finish an order to make room."
                  : online
                    ? "New order check every 30 seconds."
                    : "Go online to get orders."}
              </Text>
            </View>
            {active.length === 0 && (
              <Text style={styles.sub}>
                No active orders.{" "}
                {online ? "Your next test order is being prepared." : "You are offline."}
              </Text>
            )}
            {active.map((o) => (
              <TouchableOpacity
                accessibilityRole="button"
                key={o.id}
                style={styles.orderCard}
                onPress={() => {
                  setSelected(o.id);
                  setPage("order");
                }}
              >
                <Image source={{ uri: o.product_image_url }} style={styles.photo} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.eyebrow}>{o.reference}</Text>
                  <Text style={styles.section}>{o.product_name}</Text>
                  <Text style={styles.help}>📦 {o.pickup_name}</Text>
                  <Text style={styles.help}>📍 {o.drop_name}</Text>
                  <Text style={styles.payment}>
                    ₹{o.fee_rupees} • {o.status.replace("_", " ").toUpperCase()}
                  </Text>
                  <Text style={styles.link}>Open delivery →</Text>
                </View>
              </TouchableOpacity>
            ))}
            {finished.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.section}>Completed today ({finished.length})</Text>
                <Text style={styles.sub}>
                  Earnings (test): ₹{finished.reduce((sum, o) => sum + o.fee_rupees, 0)}
                </Text>
              </View>
            )}
          </>
        )}
        {(page === "order" || page === "map") && selectedOrder && (
          <>
            <View style={styles.card}>
              <Text style={styles.eyebrow}>{selectedOrder.reference} • TEST ORDER</Text>
              <Image source={{ uri: selectedOrder.product_image_url }} style={styles.largePhoto} />
              <Text style={styles.section}>{selectedOrder.product_name}</Text>
              <Text style={styles.payment}>You earn ₹{selectedOrder.fee_rupees}</Text>
              <Text style={styles.label}>1. PICKUP FROM</Text>
              <Text style={styles.sub}>{selectedOrder.pickup_address}</Text>
              <Text style={styles.label}>2. DELIVER TO</Text>
              <Text style={styles.sub}>{selectedOrder.drop_address}</Text>
            </View>
            {page === "map" ? (
              <MapView order={selectedOrder} />
            ) : (
              <BigButton title="See in-app route map →" secondary onPress={() => setPage("map")} />
            )}
            <BigButton
              title={
                selectedOrder.status === "offered"
                  ? "1. Accept this order →"
                  : selectedOrder.status === "accepted"
                    ? "2. Package picked up →"
                    : selectedOrder.status === "picked_up"
                      ? "3. Mark delivered ✓"
                      : "Delivered ✓"
              }
              disabled={busy || selectedOrder.status === "completed"}
              onPress={() => void advance(selectedOrder)}
            />
            <Text style={styles.help}>
              Confirm each step only after it really happens. Navigation map is schematic, not
              verified road guidance.
            </Text>
          </>
        )}
        {busy && <ActivityIndicator color={palette.teal} size="large" />}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  root: { padding: 18, paddingBottom: 50, maxWidth: 650, alignSelf: "center", width: "100%" },
  top: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10, marginBottom: 20 },
  logo: {
    width: 51,
    height: 51,
    borderRadius: 16,
    backgroundColor: palette.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: { fontWeight: "800", fontSize: 11, letterSpacing: 1, color: palette.teal },
  title: { fontSize: 27, fontWeight: "900", color: palette.ink },
  back: { paddingVertical: 8, marginBottom: 10 },
  link: { fontWeight: "800", fontSize: 15, color: palette.teal },
  hero: { padding: 25, borderRadius: 22, backgroundColor: palette.teal, marginBottom: 22 },
  heroTitle: { fontSize: 29, fontWeight: "900", color: palette.white, marginBottom: 10 },
  heroBody: { fontSize: 16, lineHeight: 25, color: palette.white, marginBottom: 7 },
  button: {
    minHeight: 58,
    backgroundColor: palette.orange,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    marginVertical: 7,
  },
  secondary: { backgroundColor: palette.pale, borderWidth: 1, borderColor: palette.teal },
  buttonText: { fontWeight: "900", fontSize: 16, color: palette.ink, textAlign: "center" },
  card: {
    backgroundColor: palette.white,
    padding: 19,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 17,
    gap: 7,
  },
  label: { fontWeight: "800", fontSize: 13, color: palette.ink, marginBottom: 7 },
  input: {
    borderWidth: 1,
    borderColor: "#C1D1CD",
    borderRadius: 13,
    fontSize: 18,
    minHeight: 54,
    paddingHorizontal: 14,
    color: palette.ink,
    backgroundColor: palette.white,
  },
  sub: { fontSize: 16, lineHeight: 25, color: palette.ink, marginBottom: 10 },
  section: { fontWeight: "900", fontSize: 19, color: palette.ink, marginVertical: 4 },
  help: { fontSize: 13, lineHeight: 20, color: palette.faint, marginVertical: 3 },
  note: { backgroundColor: "#FFF1DE", padding: 13, borderRadius: 12, marginBottom: 15 },
  noteText: { fontSize: 14, color: palette.ink },
  banner: { padding: 17, backgroundColor: palette.pale, borderRadius: 18, marginBottom: 15 },
  bannerBig: { fontSize: 15, fontWeight: "900", color: palette.teal },
  bannerSmall: { fontSize: 13, lineHeight: 20, color: palette.ink, marginTop: 5 },
  orderCard: {
    flexDirection: "row",
    gap: 13,
    backgroundColor: palette.white,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
  },
  photo: { width: 105, height: 115, borderRadius: 12, backgroundColor: palette.pale },
  largePhoto: {
    width: "100%",
    height: 205,
    borderRadius: 13,
    backgroundColor: palette.pale,
    marginVertical: 10,
  },
  payment: { fontSize: 17, fontWeight: "900", color: palette.teal, marginVertical: 7 },
  map: {
    height: 275,
    backgroundColor: "#D9ECE0",
    borderRadius: 18,
    marginVertical: 12,
    overflow: "hidden",
    borderColor: "#B7D0C8",
    borderWidth: 1,
  },
  dot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: palette.white,
    zIndex: 3,
  },
  mapLabel: { position: "absolute", fontSize: 28, fontWeight: "900", color: "#A6C8BB", zIndex: 0 },
});
