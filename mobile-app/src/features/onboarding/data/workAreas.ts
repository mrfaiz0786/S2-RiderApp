/** Fictional onboarding choices, not live service areas. */
export const workCities = [
  { id: "delhi", name: "Delhi", region: "Delhi NCR", aliases: "new delhi" },
  { id: "gurugram", name: "Gurugram", region: "Delhi NCR", aliases: "gurgaon" },
  { id: "noida", name: "Noida", region: "Delhi NCR", aliases: "greater noida" },
  { id: "bengaluru", name: "Bengaluru", region: "Karnataka", aliases: "bangalore" },
] as const;
export function workCityName(id: string) {
  return workCities.find((c) => c.id === id)?.name || "Not selected";
}
export type Hub = { id: string; name: string; area: string; distance: string; code: string };
export function previewHubs(city: string): Hub[] {
  if (!workCities.some((c) => c.id === city)) return [];
  const label = workCityName(city),
    short = city.slice(0, 3).toUpperCase();
  return [
    {
      id: city + "-north-demo",
      name: label + " North Hub",
      area: "Fictional pickup area A",
      distance: "3.2 km",
      code: short + "-DEMO-01",
    },
    {
      id: city + "-central-demo",
      name: label + " Central Hub",
      area: "Fictional pickup area B",
      distance: "5.6 km",
      code: short + "-DEMO-02",
    },
    {
      id: city + "-west-demo",
      name: label + " West Hub",
      area: "Fictional pickup area C",
      distance: "7.4 km",
      code: short + "-DEMO-03",
    },
  ];
}
