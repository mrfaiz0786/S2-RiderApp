import { isRecord } from "../api/types";

export type AssignmentStatus = "ASSIGNED" | "PICKED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "FAILED";
export type LoginResponse = {
  token: string;
  username: string;
  name: string;
  role: "ROLE_RIDER";
};
export type RiderProfile = {
  riderId: number;
  name: string;
  phone: string;
  email: string | null;
  vehicleType: string;
  status: string;
  rating: number | null;
  licenseNumber: string | null;
  idCardType: string | null;
  idCardNumber: string | null;
};
export type RiderOrderItem = {
  productName: string;
  variantLabel: string;
  sku: string;
  orderedQty: number;
  lineTotal: number;
};
export type RiderAssignment = {
  id: number;
  orderId: number;
  orderNumber: string;
  status: AssignmentStatus;
  assignedAt: string;
  warehouseName: string;
  warehouseAddress: string;
  warehouseLatitude: number | null;
  warehouseLongitude: number | null;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  customerLatitude: number | null;
  customerLongitude: number | null;
  grandTotal: number;
  unloadingCharge: number | null;
  paymentMethod: string;
  orderItems: RiderOrderItem[];
  deliveredAt: string | null;
  failureReason: string | null;
  deliveryNotes: string | null;
};
export type RouteSummary = {
  distanceMeters: number;
  durationSeconds: number;
  encodedPolyline: string;
};

function obj(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) throw new Error("Expected a response object");
  return value;
}
function str(value: unknown): string {
  if (typeof value !== "string") throw new Error("Expected text");
  return value;
}
function optionalText(value: unknown): string | null {
  return value == null ? null : str(value);
}
function finite(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("Expected number");
  return value;
}
function nonnegative(value: unknown): number {
  const n = finite(value);
  if (n < 0) throw new Error("Negative amount");
  return n;
}
function id(value: unknown): number {
  const n = finite(value);
  if (!Number.isSafeInteger(n) || n < 1) throw new Error("Invalid identifier");
  return n;
}
function coord(value: unknown, bound: number): number | null {
  if (value == null) return null;
  const n = finite(value);
  if (Math.abs(n) > bound) throw new Error("Invalid coordinate");
  return n;
}
export function decodeLogin(value: unknown): LoginResponse {
  const r = obj(value);
  if (r.role !== "ROLE_RIDER") throw new Error("Not an authorized rider account");
  const token = str(r.token);
  if (!token || /[\r\n]/.test(token) || token.length > 8192) throw new Error("Invalid token");
  const username = str(r.username);
  if (!username.trim()) throw new Error("Missing username");
  return { token, username, name: str(r.name), role: "ROLE_RIDER" };
}
export function decodeProfile(value: unknown): RiderProfile {
  const r = obj(value);
  return {
    riderId: id(r.riderId),
    name: str(r.name),
    phone: str(r.phone),
    email: optionalText(r.email),
    vehicleType: str(r.vehicleType),
    status: str(r.status),
    rating: r.rating == null ? null : finite(r.rating),
    licenseNumber: optionalText(r.licenseNumber),
    idCardType: optionalText(r.idCardType),
    idCardNumber: optionalText(r.idCardNumber),
  };
}
const validStatuses: readonly string[] = [
  "ASSIGNED",
  "PICKED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED",
];
export function decodeAssignment(value: unknown): RiderAssignment {
  const r = obj(value);
  const status = str(r.status);
  if (!validStatuses.includes(status)) throw new Error("Invalid assignment status");
  if (!Array.isArray(r.orderItems)) throw new Error("Missing order manifest");
  return {
    id: id(r.id),
    orderId: id(r.orderId),
    orderNumber: str(r.orderNumber),
    status: status as AssignmentStatus,
    assignedAt: str(r.assignedAt),
    warehouseName: str(r.warehouseName),
    warehouseAddress: str(r.warehouseAddress),
    warehouseLatitude: coord(r.warehouseLatitude, 90),
    warehouseLongitude: coord(r.warehouseLongitude, 180),
    customerName: str(r.customerName),
    customerPhone: str(r.customerPhone),
    deliveryAddress: str(r.deliveryAddress),
    customerLatitude: coord(r.customerLatitude, 90),
    customerLongitude: coord(r.customerLongitude, 180),
    grandTotal: nonnegative(r.grandTotal),
    unloadingCharge: r.unloadingCharge == null ? null : nonnegative(r.unloadingCharge),
    paymentMethod: str(r.paymentMethod),
    orderItems: r.orderItems.map((entry: unknown) => {
      const item = obj(entry);
      return {
        productName: str(item.productName),
        variantLabel: optionalText(item.variantLabel) ?? "",
        sku: optionalText(item.sku) ?? "",
        orderedQty: nonnegative(item.orderedQty),
        lineTotal: nonnegative(item.lineTotal),
      };
    }),
    deliveredAt: optionalText(r.deliveredAt),
    failureReason: optionalText(r.failureReason),
    deliveryNotes: optionalText(r.deliveryNotes),
  };
}
export function decodeAssignmentList(value: unknown): RiderAssignment[] {
  if (!Array.isArray(value)) throw new Error("Expected assignment list");
  if (value.length > 10000) throw new Error("List unexpectedly large");
  const rows = value.map(decodeAssignment);
  if (new Set(rows.map((row) => row.id)).size !== rows.length)
    throw new Error("Duplicate assignments");
  return rows;
}
export function decodeRoute(value: unknown): RouteSummary {
  const r = obj(value);
  // The documented backend returns data.error inside successful HTTP 200 responses.
  if (typeof r.error === "string") throw new Error("Routing service unavailable");
  if (!Array.isArray(r.routes) || r.routes.length === 0) throw new Error("No route");
  const first = obj(r.routes[0]);
  const duration = str(first.duration);
  if (!/^\d+(?:\.\d+)?s$/.test(duration)) throw new Error("Invalid route duration");
  const encodedPolyline = str(obj(first.polyline).encodedPolyline);
  if (!encodedPolyline) throw new Error("Route line missing");
  return {
    distanceMeters: nonnegative(first.distanceMeters),
    durationSeconds: Number(duration.slice(0, -1)),
    encodedPolyline,
  };
}
export function formatInr(amount: number): string {
  return (
    "₹" + amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}
/** Existing backend provides customer order total only, never rider earnings. */
export const hasLocation = (a: RiderAssignment) =>
  a.warehouseLatitude !== null &&
  a.warehouseLongitude !== null &&
  a.customerLatitude !== null &&
  a.customerLongitude !== null;
