import { BrandedAlert } from "@/shared/ui/BrandDialog";
export function alertDemo(feature: string): void {
  BrandedAlert.alert(
    "Demo mode",
    feature + " is a UI demonstration only. No real service or external system was contacted.",
  );
}
