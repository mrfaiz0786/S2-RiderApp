import type { DeliveryStatus } from "@/features/delivery/model/reducer";
import { getRoute, type RouteName } from "./routes";
export type JourneyAccess = { signedIn: boolean; approved: boolean; status: DeliveryStatus };
/** Simulator routing guard. Never substitutes for real API authorization. */
export function resolveTestRoute(target: RouteName, access: JourneyAccess): RouteName {
  if (!access.signedIn) return target === "otp" ? "otp" : "welcome";
  if (["welcome", "otp"].includes(target)) return access.approved ? "home" : "rider-profile";
  if (
    !access.approved &&
    getRoute(target).group !== "Onboarding" &&
    !["support", "safety"].includes(target)
  )
    return "verification-status";
  const accepted = [
    "accepted",
    "at_pickup",
    "picked_up",
    "at_dropoff",
    "awaiting_payment",
    "completed",
  ].includes(access.status);
  if (
    ["active-job", "pickup", "delivery-navigation", "delivery-completion", "cod-payment"].includes(
      target,
    ) &&
    !accepted
  )
    return "offers";
  if (target === "delivery-navigation" && ["accepted", "at_pickup"].includes(access.status))
    return "pickup";
  if (
    target === "delivery-completion" &&
    !["at_dropoff", "awaiting_payment", "completed"].includes(access.status)
  )
    return ["accepted", "at_pickup"].includes(access.status) ? "pickup" : "delivery-navigation";
  if (target === "cod-payment" && access.status !== "awaiting_payment")
    return access.status === "completed" ? "delivery-completion" : "active-job";
  return target;
}
