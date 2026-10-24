import type { Coordinate } from "../data/testScenario";
export type PixelPoint = { x: number; y: number };
export function project(point: Coordinate, zoom: number): PixelPoint {
  const latitude = Math.max(-85.05112878, Math.min(85.05112878, point.latitude));
  const size = 256 * 2 ** zoom;
  const sine = Math.sin((latitude * Math.PI) / 180);
  return {
    x: ((point.longitude + 180) / 360) * size,
    y: (0.5 - Math.log((1 + sine) / (1 - sine)) / (4 * Math.PI)) * size,
  };
}
export function distanceMeters(a: Coordinate, b: Coordinate): number {
  const radians = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * radians,
    dLon = (b.longitude - a.longitude) * radians;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.latitude * radians) * Math.cos(b.latitude * radians) * Math.sin(dLon / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
}
export function routeDistanceMeters(points: readonly Coordinate[]): number {
  return points
    .slice(1)
    .reduce((sum, point, index) => sum + distanceMeters(points[index], point), 0);
}
export function pointAlongRoute(points: readonly Coordinate[], progress: number): Coordinate {
  if (!points.length) throw new Error("A simulated route must contain at least one coordinate.");
  if (points.length === 1) return points[0];
  const fraction = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  if (fraction === 1) return points[points.length - 1];
  let remaining = routeDistanceMeters(points) * fraction;
  for (let i = 1; i < points.length; i += 1) {
    const length = distanceMeters(points[i - 1], points[i]);
    if (remaining <= length && length > 0) {
      const t = remaining / length;
      return {
        latitude: points[i - 1].latitude + (points[i].latitude - points[i - 1].latitude) * t,
        longitude: points[i - 1].longitude + (points[i].longitude - points[i - 1].longitude) * t,
      };
    }
    remaining -= length;
  }
  return points[points.length - 1];
}
export function fitZoom(points: readonly Coordinate[], width: number, height: number): number {
  for (let zoom = 17; zoom >= 11; zoom -= 1) {
    const pixels = points.map((point) => project(point, zoom));
    if (
      Math.max(...pixels.map((point) => point.x)) - Math.min(...pixels.map((point) => point.x)) <=
        width - 72 &&
      Math.max(...pixels.map((point) => point.y)) - Math.min(...pixels.map((point) => point.y)) <=
        height - 72
    )
      return zoom;
  }
  return 11;
}
