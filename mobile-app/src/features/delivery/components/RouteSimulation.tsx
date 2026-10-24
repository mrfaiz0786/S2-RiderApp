import { useBrandMotion } from "@/shared/ui/BrandMotion";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { useEffect, useRef, useState } from "react";
import { AppState, Text } from "react-native";
import { useDelivery } from "../model";
import { pointAlongRoute, routeDistanceMeters } from "../model/mapGeometry";
import { SimulatedMap } from "./SimulatedMap";
export function RouteSimulation({ leg }: { leg: "pickup" | "drop" }) {
  const delivery = useDelivery();
  const { order, status, pickupProgress, dropProgress, canTest } = delivery;
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(AppState.currentState === "active");
  const motionEnabled = useBrandMotion();
  const advance = useRef(delivery.advanceRoute);
  advance.current = delivery.advanceRoute;
  const eligible = canTest && (leg === "pickup" ? status === "accepted" : status === "picked_up");
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (value) => {
      setActive(value === "active");
      if (value !== "active") setPlaying(false);
    });
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (!playing || !active || !eligible || !motionEnabled) return;
    const timer = setInterval(() => advance.current(leg, 0.025), 500);
    return () => clearInterval(timer);
  }, [playing, active, eligible, leg, motionEnabled]);
  if (!order) return null;
  const route = leg === "pickup" ? order.pickupRoute : order.dropRoute;
  const progress = leg === "pickup" ? pickupProgress : dropProgress;
  const remaining = routeDistanceMeters(route) * (1 - progress);
  return (
    <>
      <SimulatedMap
        key={order.id + leg}
        route={route}
        position={pointAlongRoute(route, progress)}
        pickup={order.pickup.coordinate}
        drop={order.drop.coordinate}
      />
      <Card>
        <Text style={s.heading}>
          {progress >= 1
            ? "Simulation arrived"
            : leg === "pickup"
              ? "Ride to the sample pickup"
              : "Ride to the sample drop"}
        </Text>
        <Text accessibilityLiveRegion="polite" style={s.body}>
          {Math.round(progress * 100)}% complete · {(remaining / 1000).toFixed(2)} km of scripted
          path remaining
        </Text>
        <BrandButton
          title={
            progress >= 1
              ? "Route complete"
              : playing && motionEnabled
                ? "Pause map simulation"
                : "Play map simulation"
          }
          disabled={!eligible || !motionEnabled}
          onPress={() => setPlaying((value) => !value)}
        />
        <BrandButton
          title="Advance route one step"
          secondary
          disabled={!eligible}
          onPress={() => {
            setPlaying(false);
            advance.current(leg, 0.25);
          }}
        />
        <BrandButton
          title="Jump to arrival (test shortcut)"
          secondary
          disabled={!eligible}
          onPress={() => {
            setPlaying(false);
            advance.current(leg, 1);
          }}
        />
        <Text style={s.small}>
          {motionEnabled
            ? "Playback takes about 20 seconds per leg and pauses when you leave this screen or background the app."
            : "Reduced motion is enabled. Use step or jump controls to progress without animation."}{" "}
          No real GPS, navigation or location permission is used.
        </Text>
      </Card>
    </>
  );
}
