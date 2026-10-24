export type Coordinate = { latitude: number; longitude: number };
export type PaymentMethod = "cod" | "prepaid";
export type TestCity = "delhi" | "gurugram" | "noida" | "bengaluru";
const point = (latitude: number, longitude: number): Coordinate => ({ latitude, longitude });
// Scripted practice coordinates over real geography. NOT a computed driving route.
const cityRoutes = {
  delhi: {
    label: "New Delhi",
    pickup: "Barakhamba Road practice pickup",
    drop: "Mandi House practice drop",
    pickupRoute: [
      point(28.633, 77.2195),
      point(28.6318, 77.22),
      point(28.6305, 77.2208),
      point(28.6294, 77.222),
    ],
    dropRoute: [
      point(28.6294, 77.222),
      point(28.6288, 77.2232),
      point(28.6282, 77.2246),
      point(28.6276, 77.226),
      point(28.6269, 77.2272),
      point(28.626, 77.2286),
      point(28.6251, 77.23),
    ],
  },
  gurugram: {
    label: "Gurugram",
    pickup: "Sector 29 practice pickup",
    drop: "South City practice drop",
    pickupRoute: [point(28.4711, 77.061), point(28.4698, 77.0625), point(28.4682, 77.0637)],
    dropRoute: [
      point(28.4682, 77.0637),
      point(28.4665, 77.0651),
      point(28.465, 77.0666),
      point(28.4633, 77.0681),
      point(28.4617, 77.0697),
      point(28.4599, 77.0712),
    ],
  },
  noida: {
    label: "Noida",
    pickup: "Sector 18 practice pickup",
    drop: "Sector 29 practice drop",
    pickupRoute: [point(28.5811, 77.3222), point(28.58, 77.3232), point(28.5785, 77.3245)],
    dropRoute: [
      point(28.5785, 77.3245),
      point(28.5777, 77.326),
      point(28.577, 77.3275),
      point(28.5761, 77.329),
      point(28.5745, 77.331),
      point(28.573, 77.333),
    ],
  },
  bengaluru: {
    label: "Bengaluru",
    pickup: "Indiranagar practice pickup",
    drop: "12th Main practice drop",
    pickupRoute: [point(12.9807, 77.6388), point(12.9797, 77.64), point(12.9785, 77.6408)],
    dropRoute: [
      point(12.9785, 77.6408),
      point(12.9771, 77.642),
      point(12.9758, 77.643),
      point(12.974, 77.6444),
      point(12.9721, 77.6457),
      point(12.9705, 77.6473),
    ],
  },
} satisfies Record<
  TestCity,
  {
    label: string;
    pickup: string;
    drop: string;
    pickupRoute: Coordinate[];
    dropRoute: Coordinate[];
  }
>;
export const isTestCity = (value: unknown): value is TestCity =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(cityRoutes, value);
export type TestOrder = {
  id: string;
  sequence: number;
  cityId: TestCity;
  city: string;
  paymentMethod: PaymentMethod;
  offeredAt: number;
  expiresAt: number;
  customerTotalPaise: number;
  codPaise: number;
  payoutPaise: number;
  basePayPaise: number;
  distancePayPaise: number;
  bonusPaise: number;
  pickup: {
    name: string;
    address: string;
    contact: string;
    instructions: string;
    coordinate: Coordinate;
  };
  drop: {
    name: string;
    address: string;
    contact: string;
    instructions: string;
    coordinate: Coordinate;
  };
  pickupRoute: Coordinate[];
  dropRoute: Coordinate[];
  estimatedMinutes: number;
  items: { name: string; quantity: number; amountPaise: number }[];
};
export function createTestOrder(
  sequence: number,
  cityId: TestCity,
  paymentMethod: PaymentMethod,
  now: number,
): TestOrder {
  const route = cityRoutes[cityId];
  return {
    id: "YBM-TEST-" + String(sequence).padStart(4, "0"),
    sequence,
    cityId,
    city: route.label,
    paymentMethod,
    offeredAt: now,
    expiresAt: now + 180000,
    customerTotalPaise: 64900,
    codPaise: paymentMethod === "cod" ? 64900 : 0,
    payoutPaise: 8600,
    basePayPaise: 5000,
    distancePayPaise: 2600,
    bonusPaise: 1000,
    pickup: {
      name: "YBM Sample Grocery",
      address: route.pickup + ", " + route.label + " (fictional handover point)",
      contact: "Test Store Partner (no call)",
      instructions:
        "Check 4 sealed items. Ask for the displayed sample pickup PIN. Do not travel to this location.",
      coordinate: route.pickupRoute[route.pickupRoute.length - 1],
    },
    drop: {
      name: "Sample Customer",
      address: route.drop + ", " + route.label + " (fictional recipient)",
      contact: "Sample Customer (no call)",
      instructions:
        "Practice handover at the marked point. Verify the test delivery OTP; collect only simulated cash for COD.",
      coordinate: route.dropRoute[route.dropRoute.length - 1],
    },
    pickupRoute: route.pickupRoute,
    dropRoute: route.dropRoute,
    estimatedMinutes: 20,
    items: [
      { name: "Milk pack", quantity: 1, amountPaise: 12000 },
      { name: "Fresh produce", quantity: 1, amountPaise: 15000 },
      { name: "Rice pack", quantity: 1, amountPaise: 19900 },
      { name: "Household essentials", quantity: 1, amountPaise: 18000 },
    ],
  };
}
export const rupeesFromPaise = (paise: number) =>
  "\u20b9" + (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
