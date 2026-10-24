import { useEffect, useState } from "react";
import { Linking, Text, View } from "react-native";
import { BrandButton } from "@/shared/ui/BrandButton";
import { Card } from "@/shared/ui/Card";
import { Row } from "@/shared/ui/Row";
import { ScreenHero } from "@/shared/ui/ScreenHero";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import {
  formatInr,
  hasLocation,
  type RiderAssignment,
  type RouteSummary,
} from "@/services/legacy/contracts";
import type { LegacyRiderApi } from "@/services/legacy/client";

export function LiveAssignmentPanel({
  assignmentId,
  api,
  onBack,
}: {
  assignmentId: number;
  api: LegacyRiderApi;
  onBack: () => void;
}) {
  const [order, setOrder] = useState<RiderAssignment | null>(null);
  const [route, setRoute] = useState<RouteSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [routeNotice, setRouteNotice] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setRoute(null);
    setRouteNotice("");
    void (async () => {
      const detail = await api.detail(assignmentId, controller.signal);
      if (!alive) return;
      if (!detail.ok) {
        setError(detail.error.message);
        setLoading(false);
        return;
      }
      setOrder(detail.data);
      setLoading(false);
      if (!hasLocation(detail.data)) {
        setRouteNotice("Map coordinates are unavailable. Use the written addresses.");
        return;
      }
      const a = detail.data;
      const result = await api.route(
        a.warehouseLatitude!,
        a.warehouseLongitude!,
        a.customerLatitude!,
        a.customerLongitude!,
        controller.signal,
      );
      if (!alive) return;
      if (result.ok) setRoute(result.data);
      else setRouteNotice("Route preview unavailable. You can still open external directions.");
    })().catch(() => {
      if (alive) {
        setError("Could not load this assignment.");
        setLoading(false);
      }
    });
    return () => {
      alive = false;
      controller.abort();
    };
  }, [assignmentId, api, reload]);
  async function navigateTo(lat: number, lng: number) {
    // Opens an external map rather than incorrectly displaying Google Routes on OSM tiles.
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    try {
      await Linking.openURL(url);
    } catch {
      setRouteNotice("Map app could not open. Use the written address.");
    }
  }
  return (
    <>
      <BrandButton title="Back to assignments" secondary onPress={onBack} />
      <ScreenHero
        eyebrow="EXISTING BACKEND · READ ONLY"
        title={order?.orderNumber ?? "Assignment details"}
        subtitle="Real assignment details come from your assigned-work API, not the test simulator."
        icon="package-variant-closed"
      />
      {loading ? <Text style={s.body}>Loading assignment…</Text> : null}
      {error ? (
        <Card tone="amber">
          <Text accessibilityRole="alert" style={s.error}>
            {error}
          </Text>
          <BrandButton title="Retry" secondary onPress={() => setReload((v) => v + 1)} />
        </Card>
      ) : null}
      {order ? (
        <>
          <Card>
            <Text style={s.heading}>Current status: {order.status.replace(/_/g, " ")}</Text>
            <Row label="Assignment ID" value={String(order.id)} />
            <Row label="Order ID" value={String(order.orderId)} />
            <Row label="Payment" value={order.paymentMethod} />
            <Row label="Customer order amount" value={formatInr(order.grandTotal)} />
            <Text style={s.small}>
              Customer order value is not rider earnings. No payment receipt is recorded by this
              screen.
            </Text>
          </Card>
          <Card>
            <Text style={s.heading}>Pickup · warehouse</Text>
            <Text style={s.body}>{order.warehouseName}</Text>
            <Text style={s.body}>{order.warehouseAddress}</Text>
            {order.warehouseLatitude !== null && order.warehouseLongitude !== null ? (
              <BrandButton
                title="Open pickup directions"
                secondary
                onPress={() => void navigateTo(order.warehouseLatitude!, order.warehouseLongitude!)}
              />
            ) : null}
            <View style={s.divider} />
            <Text style={s.heading}>Drop · customer</Text>
            <Text style={s.body}>{order.customerName}</Text>
            <Text style={s.body}>{order.deliveryAddress}</Text>
            <Text style={s.small}>
              Contact: {order.customerPhone} · use only for the assigned delivery.
            </Text>
            {order.customerLatitude !== null && order.customerLongitude !== null ? (
              <BrandButton
                title="Open drop directions"
                secondary
                onPress={() => void navigateTo(order.customerLatitude!, order.customerLongitude!)}
              />
            ) : null}
          </Card>
          <Card>
            <Text style={s.heading}>Package manifest</Text>
            {order.orderItems.map((item, index) => (
              <View key={index}>
                <Text style={s.body}>
                  {item.orderedQty} × {item.productName}
                </Text>
                {item.variantLabel ? <Text style={s.small}>{item.variantLabel}</Text> : null}
                <Row label={item.sku || "Item"} value={formatInr(item.lineTotal)} />
              </View>
            ))}
          </Card>
          <Card>
            <Text style={s.heading}>Route information</Text>
            {route ? (
              <>
                <Row label="Distance" value={(route.distanceMeters / 1000).toFixed(1) + " km"} />
                <Row
                  label="Est. driving time"
                  value={Math.round(route.durationSeconds / 60) + " min"}
                />
                <Text style={s.small}>
                  Based on the backend Google Routes response; actual traffic and navigation may
                  differ.
                </Text>
              </>
            ) : (
              <Text style={s.body}>{routeNotice || "Checking route availability…"}</Text>
            )}
          </Card>
          <Card tone="amber">
            <Text style={s.heading}>Delivery status actions temporarily restricted</Text>
            <Text style={s.body}>
              The backend guide reports that assignment status updates do not enforce rider
              ownership. Pickup, out-for-delivery, delivered and failed actions stay disabled until
              server-side authorization is corrected and cross-rider tests pass.
            </Text>
            <BrandButton
              title="Refresh server status"
              secondary
              onPress={() => setReload((v) => v + 1)}
            />
          </Card>
        </>
      ) : null}
    </>
  );
}
