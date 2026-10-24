import { theme } from "@/shared/theme";
import { journeyStyles as s } from "@/shared/theme/journeyStyles";
import { useMemo, useRef, useState } from "react";
import {
  Image,
  Linking,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Polyline, Text as SvgText } from "react-native-svg";
import type { Coordinate } from "../data/testScenario";
import { fitZoom, project } from "../model/mapGeometry";
const HEIGHT = 300;
const TILE_BASE = "https://tile.openstreetmap.org";
const USER_AGENT = "YBMRiderTest/0.1 (+https://github.com/mrfaiz0786/S2-RiderApp)";
/** Small, on-demand street-map viewport. No prefetch, offline downloads, GPS or routing API. */
export function SimulatedMap({
  route,
  position,
  pickup,
  drop,
}: {
  route: readonly Coordinate[];
  position: Coordinate;
  pickup: Coordinate;
  drop: Coordinate;
}) {
  const [width, setWidth] = useState(320);
  const [zoomDelta, setZoomDelta] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [tileError, setTileError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const currentOffset = useRef(offset);
  currentOffset.current = offset;
  const zoom = Math.max(11, Math.min(18, fitZoom(route, width, HEIGHT) + zoomDelta));
  const pixels = route.map((point) => project(point, zoom));
  const center = {
    x: (Math.min(...pixels.map((p) => p.x)) + Math.max(...pixels.map((p) => p.x))) / 2,
    y: (Math.min(...pixels.map((p) => p.y)) + Math.max(...pixels.map((p) => p.y))) / 2,
  };
  const left = center.x - width / 2 - offset.x,
    top = center.y - HEIGHT / 2 - offset.y;
  const screen = (point: Coordinate) => {
    const projected = project(point, zoom);
    return { x: projected.x - left, y: projected.y - top };
  };
  const driver = screen(position),
    start = screen(pickup),
    end = screen(drop);
  const tiles: { key: string; uri: string; x: number; y: number }[] = [];
  for (let x = Math.floor(left / 256); x <= Math.floor((left + width) / 256); x += 1) {
    for (let y = Math.floor(top / 256); y <= Math.floor((top + HEIGHT) / 256); y += 1) {
      if (x < 0 || y < 0 || x >= 2 ** zoom || y >= 2 ** zoom) continue;
      tiles.push({
        key: `${zoom}/${x}/${y}`,
        uri: `${TILE_BASE}/${zoom}/${x}/${y}.png`,
        x: x * 256 - left,
        y: y * 256 - top,
      });
    }
  }
  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 8 || Math.abs(gesture.dy) > 8,
        onPanResponderGrant: () => {
          dragStart.current = currentOffset.current;
        },
        onPanResponderMove: (_, gesture) =>
          setOffset({
            x: Math.max(-1200, Math.min(1200, dragStart.current.x + gesture.dx)),
            y: Math.max(-1200, Math.min(1200, dragStart.current.y + gesture.dy)),
          }),
      }),
    [],
  );
  return (
    <View style={styles.wrapper}>
      <View
        accessibilityLabel="Real street map with simulated rider position. Drag to pan."
        style={styles.map}
        onLayout={(event) => setWidth(Math.max(200, Math.min(900, event.nativeEvent.layout.width)))}
        {...pan.panHandlers}
      >
        {tiles.map((tile) => (
          <Image
            key={tile.key}
            accessibilityIgnoresInvertColors
            source={{
              uri: tile.uri,
              cache: "default",
              ...(Platform.OS === "web" ? {} : { headers: { "User-Agent": USER_AGENT } }),
            }}
            style={{ position: "absolute", left: tile.x, top: tile.y, width: 256, height: 256 }}
            onLoad={() => setLoaded(true)}
            onError={() => setTileError(true)}
          />
        ))}
        <Svg width={width} height={HEIGHT} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Polyline
            points={pixels.map((point) => `${point.x - left},${point.y - top}`).join(" ")}
            fill="none"
            stroke="white"
            strokeWidth={9}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Polyline
            points={pixels.map((point) => `${point.x - left},${point.y - top}`).join(" ")}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth={5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {[
            { point: start, label: "P", color: theme.colors.success },
            { point: end, label: "D", color: theme.colors.accent },
          ].map(({ point, label, color }) => (
            <Svg key={label} x={point.x - 16} y={point.y - 16} width={32} height={32}>
              <Circle cx={16} cy={16} r={14} fill={color} stroke="white" strokeWidth={3} />
              <SvgText
                x={16}
                y={21}
                textAnchor="middle"
                fill={label === "D" ? theme.colors.text : "white"}
                fontWeight="bold"
                fontSize={13}
              >
                {label}
              </SvgText>
            </Svg>
          ))}
          <Circle cx={driver.x} cy={driver.y} r={18} fill={theme.colors.accent} opacity={0.22} />
          <Circle
            cx={driver.x}
            cy={driver.y}
            r={9}
            fill={theme.colors.primary}
            stroke="white"
            strokeWidth={3}
          />
        </Svg>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>SIMULATED RIDER · NOT GPS</Text>
        </View>
      </View>
      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zoom map out"
          onPress={() => {
            setZoomDelta((value) => Math.max(-3, value - 1));
            setOffset({ x: 0, y: 0 });
          }}
          style={styles.control}
        >
          <Text style={s.heading}>−</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fit sample route"
          onPress={() => {
            setZoomDelta(0);
            setOffset({ x: 0, y: 0 });
          }}
          style={styles.control}
        >
          <Text style={s.body}>Fit route</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zoom map in"
          onPress={() => {
            setZoomDelta((value) => Math.min(4, value + 1));
            setOffset({ x: 0, y: 0 });
          }}
          style={styles.control}
        >
          <Text style={s.heading}>+</Text>
        </Pressable>
      </View>
      <Text style={styles.caption}>
        P: pickup · D: drop · teal dot: test rider. Scripted path, not driving directions.
      </Text>
      {tileError || !loaded ? (
        <Text accessibilityLiveRegion="polite" style={styles.caption}>
          {tileError
            ? "Some street tiles are unavailable. The route overlay still works; connect to the internet for map detail."
            : "Loading street tiles (internet required)..."}
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="OpenStreetMap copyright and contributors"
        onPress={() => {
          void Linking.openURL("https://www.openstreetmap.org/copyright").catch(() =>
            setTileError(true),
          );
        }}
      >
        <Text style={styles.attribution}>© OpenStreetMap contributors</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    overflow: "hidden",
    marginBottom: 14,
  },
  map: { height: HEIGHT, backgroundColor: "#E6EEEA", overflow: "hidden" },
  badge: {
    position: "absolute",
    left: 10,
    top: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: theme.colors.surface,
  },
  badgeText: { fontSize: 10, fontWeight: "800", color: theme.colors.primary },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 8,
  },
  control: {
    paddingHorizontal: 17,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 12,
  },
  caption: {
    paddingHorizontal: 12,
    paddingBottom: 6,
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  attribution: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
    fontSize: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});
