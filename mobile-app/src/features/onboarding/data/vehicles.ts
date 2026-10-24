/** Illustrative categories; eligibility must eventually come from the backend. */
export const vehicles: {
  value: string;
  title: string;
  note: string;
  kind: "motorcycle" | "bicycle" | "electric" | "car" | "cargo";
  badge: string;
}[] = [
  {
    value: "Two-Wheeler",
    title: "Motorcycle",
    note: "Your everyday delivery companion.",
    kind: "motorcycle",
    badge: "TWO WHEELS",
  },
  {
    value: "Bicycle / Cycle",
    title: "Bicycle",
    note: "A pedal-powered way to get moving.",
    kind: "bicycle",
    badge: "PEDAL POWER",
  },
  {
    value: "Electric Scooter",
    title: "Electric scooter",
    note: "An electric option for your day.",
    kind: "electric",
    badge: "ELECTRIC",
  },
  {
    value: "Auto (demo)",
    title: "Auto",
    note: "Additional category preview.",
    kind: "car",
    badge: "DEMO CATEGORY",
  },
  {
    value: "Car (demo)",
    title: "Car",
    note: "Additional category preview.",
    kind: "car",
    badge: "DEMO CATEGORY",
  },
  {
    value: "Van / Cargo (demo)",
    title: "Van / cargo",
    note: "Additional category preview.",
    kind: "cargo",
    badge: "DEMO CATEGORY",
  },
];
export const vehicleDocumentIds: Record<string, string[]> = {
  "Two-Wheeler": ["pan", "dl", "rc", "insurance"],
  "Electric Scooter": ["pan", "dl", "rc", "insurance"],
  "Bicycle / Cycle": ["pan"],
  "Auto (demo)": ["pan", "dl", "rc", "insurance"],
  "Car (demo)": ["pan", "dl", "rc", "insurance"],
  "Van / Cargo (demo)": ["pan", "dl", "rc", "insurance"],
};
