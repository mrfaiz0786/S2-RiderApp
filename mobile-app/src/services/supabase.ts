/** Supabase is the sole backend adapter. Main and Faiz demo screens keep their original UI.
 * Only verified Supabase Auth sessions can access rider test orders; no demo OTP is sent here.
 */
declare const process: { env: Record<string, string | undefined> };

const projectUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export type SupabaseTestOrder = {
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
  status: "offered" | "accepted" | "picked_up" | "completed";
  created_at: string;
  completed_at: string | null;
};

export type SupabaseSignInResult = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

export function isSupabaseConfigured(): boolean {
  return /^https:\/\/[^/]+\.supabase\.co$/.test(projectUrl) && publishableKey.length > 0;
}

async function request<T>(
  endpoint: string,
  { token, method = "GET", body }: { token?: string; method?: "GET" | "POST"; body?: object } = {},
): Promise<T> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase URL and publishable key are not configured.");
  }

  const response = await fetch(projectUrl + endpoint, {
    method,
    headers: {
      apikey: publishableKey,
      Authorization: "Bearer " + (token || publishableKey),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = payload as { message?: string; msg?: string; error_description?: string } | null;
    throw new Error(
      error?.message || error?.msg || error?.error_description || "Supabase request failed",
    );
  }
  return payload as T;
}

function requireSession(accessToken: string): string {
  if (!accessToken || !accessToken.trim()) throw new Error("A Supabase Auth session is required.");
  return accessToken;
}

/** Actual Supabase email sign-in. Not the Faiz simulated 123456 phone OTP. */
export function signInWithSupabaseEmail(email: string, password: string) {
  if (!email.includes("@") || password.length < 6) {
    throw new Error("A valid email and password are required.");
  }
  return request<SupabaseSignInResult>("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: { email, password },
  });
}

/** Reads only this authenticated rider's rows, enforced by Supabase RLS. */
export function listSupabaseTestOrders(accessToken: string) {
  return request<SupabaseTestOrder[]>(
    "/rest/v1/rider_test_orders?select=*&order=created_at.desc&limit=100",
    { token: requireSession(accessToken) },
  );
}

/** Database enforces at most 5 active orders and a minimum 30-second creation interval. */
export function createSupabaseTestOrder(accessToken: string) {
  return request<SupabaseTestOrder>("/rest/v1/rpc/create_rider_test_order", {
    token: requireSession(accessToken),
    method: "POST",
    body: {},
  });
}

/** Server checks row ownership and enforces offered → accepted → picked_up → completed. */
export function advanceSupabaseTestOrder(
  accessToken: string,
  orderId: string,
  nextStatus: "accepted" | "picked_up" | "completed",
) {
  if (!/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(orderId)) {
    throw new Error("A valid order identifier is required.");
  }
  return request<SupabaseTestOrder>("/rest/v1/rpc/advance_rider_test_order", {
    token: requireSession(accessToken),
    method: "POST",
    body: { p_order_id: orderId, p_next_status: nextStatus },
  });
}
