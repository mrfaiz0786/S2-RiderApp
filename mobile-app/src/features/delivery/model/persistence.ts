import { isRecord } from "@/services/api/types";
import { createTestOrder, isTestCity, type TestOrder } from "../data/testScenario";
import {
  initialDeliveryState,
  type DeliveryEvent,
  type DeliveryReceipt,
  type DeliveryState,
  type DeliveryStatus,
} from "./reducer";
const statuses: DeliveryStatus[] = [
  "idle",
  "offered",
  "declined",
  "expired",
  "accepted",
  "at_pickup",
  "picked_up",
  "at_dropoff",
  "awaiting_payment",
  "completed",
];
const validTime = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;
function decodeOrder(value: unknown): TestOrder {
  if (
    !isRecord(value) ||
    !Number.isSafeInteger(value.sequence) ||
    Number(value.sequence) < 1 ||
    !isTestCity(value.cityId) ||
    !["cod", "prepaid"].includes(String(value.paymentMethod)) ||
    !validTime(value.offeredAt)
  )
    throw new Error("Invalid sample order");
  return createTestOrder(
    Number(value.sequence),
    value.cityId,
    value.paymentMethod === "cod" ? "cod" : "prepaid",
    value.offeredAt,
  );
}
function decodeEvents(value: unknown): DeliveryEvent[] {
  if (!Array.isArray(value) || value.length > 30) throw new Error("Invalid timeline");
  return value.map((item: unknown) => {
    if (
      !isRecord(item) ||
      typeof item.type !== "string" ||
      item.type.length > 90 ||
      !validTime(item.at)
    )
      throw new Error("Invalid event");
    return { type: item.type, at: item.at };
  });
}
/** Only fictional delivery state is persisted. No phone input, OTPs, IDs or documents. */
export function encodeDeliverySnapshot(state: DeliveryState): string {
  return JSON.stringify({ schema: 1, state: { ...state, online: false } });
}
export function decodeDeliverySnapshot(raw: string | null): DeliveryState {
  if (!raw) return initialDeliveryState;
  try {
    const envelope: unknown = JSON.parse(raw);
    if (!isRecord(envelope) || envelope.schema !== 1 || !isRecord(envelope.state))
      return initialDeliveryState;
    const value = envelope.state;
    if (
      !statuses.includes(value.status as DeliveryStatus) ||
      !Number.isSafeInteger(value.sequence) ||
      Number(value.sequence) < 0 ||
      !Array.isArray(value.history) ||
      value.history.length > 100
    )
      return initialDeliveryState;
    const history: DeliveryReceipt[] = value.history.map((item: unknown) => {
      if (!isRecord(item) || !validTime(item.completedAt)) throw new Error("Invalid receipt");
      const order = decodeOrder(item.order);
      if (item.completedAt < order.offeredAt || item.codCollectedPaise !== order.codPaise)
        throw new Error("Invalid receipt amount");
      return {
        order,
        completedAt: item.completedAt,
        codCollectedPaise: order.codPaise,
        events: decodeEvents(item.events),
      };
    });
    if (new Set(history.map((item) => item.order.id)).size !== history.length)
      return initialDeliveryState;
    const order = value.order === null ? null : decodeOrder(value.order);
    const status = value.status as DeliveryStatus;
    if (
      (status !== "idle" && !order) ||
      (order && order.sequence > Number(value.sequence)) ||
      history.some((item) => item.order.sequence > Number(value.sequence))
    )
      return initialDeliveryState;
    const pickup = value.pickupProgress,
      drop = value.dropProgress;
    if (
      typeof pickup !== "number" ||
      !Number.isFinite(pickup) ||
      pickup < 0 ||
      pickup > 1 ||
      typeof drop !== "number" ||
      !Number.isFinite(drop) ||
      drop < 0 ||
      drop > 1
    )
      return initialDeliveryState;
    if (
      ["at_pickup", "picked_up", "at_dropoff", "awaiting_payment", "completed"].includes(status) &&
      pickup !== 1
    )
      return initialDeliveryState;
    if (["at_dropoff", "awaiting_payment", "completed"].includes(status) && drop !== 1)
      return initialDeliveryState;
    if (status === "awaiting_payment" && order?.paymentMethod !== "cod")
      return initialDeliveryState;
    if (status === "completed" && !history.some((item) => item.order.id === order?.id))
      return initialDeliveryState;
    return {
      online: false,
      status,
      sequence: Number(value.sequence),
      order,
      pickupProgress: pickup,
      dropProgress: drop,
      events: decodeEvents(value.events),
      history,
    };
  } catch {
    return initialDeliveryState;
  }
}
