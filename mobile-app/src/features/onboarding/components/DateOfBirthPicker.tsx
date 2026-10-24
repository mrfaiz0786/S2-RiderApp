import { theme } from "@/shared/theme";
import { createBrandedStyles } from "@/shared/theme/createBrandedStyles";
import { AppIcon } from "@/shared/ui/AppIcon";
import { BrandSheet } from "@/shared/ui/BrandSheet";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DateOfBirthPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [visibleDate, setVisibleDate] = useState(() => {
    const parts = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    return parts
      ? new Date(Number(parts[3]), Number(parts[2]) - 1, 1)
      : new Date(new Date().getFullYear() - 20, 0, 1);
  });
  const today = new Date();
  const latest = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const earliest = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  const year = visibleDate.getFullYear();
  const month = visibleDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const dayCount = new Date(year, month + 1, 0).getDate();
  const move = (years: number, months = 0) => {
    const next = new Date(year + years, month + months, 1);
    if (next.getFullYear() >= earliest.getFullYear() && next.getFullYear() <= latest.getFullYear())
      setVisibleDate(next);
  };
  return (
    <>
      <Text style={styles.label}>
        Date of birth <Text style={styles.star}>*</Text>
      </Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Select date of birth from calendar"
        onPress={() => setOpen(true)}
        style={styles.input}
      >
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value || "Select date (DD/MM/YYYY)"}
        </Text>
        <AppIcon name="calendar-month-outline" size={22} color={theme.colors.primary} />
      </TouchableOpacity>
      <BrandSheet
        visible={open}
        title="Select date of birth"
        subtitle="Rider must be at least 18 years old"
        onClose={() => setOpen(false)}
      >
        <View style={styles.yearRow}>
          <TouchableOpacity
            accessibilityLabel="Previous ten years"
            onPress={() => move(-10)}
            style={styles.control}
          >
            <Text style={styles.controlText}>−10</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Previous year"
            onPress={() => move(-1)}
            style={styles.control}
          >
            <Text style={styles.controlText}>−1</Text>
          </TouchableOpacity>
          <Text style={styles.year}>{year}</Text>
          <TouchableOpacity
            accessibilityLabel="Next year"
            onPress={() => move(1)}
            style={styles.control}
          >
            <Text style={styles.controlText}>+1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Next ten years"
            onPress={() => move(10)}
            style={styles.control}
          >
            <Text style={styles.controlText}>+10</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.monthRow}>
          <TouchableOpacity
            accessibilityLabel="Previous month"
            onPress={() => move(0, -1)}
            style={styles.control}
          >
            <AppIcon name="chevron-left" size={23} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.month}>{months[month]}</Text>
          <TouchableOpacity
            accessibilityLabel="Next month"
            onPress={() => move(0, 1)}
            style={styles.control}
          >
            <AppIcon name="chevron-right" size={23} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {weekdays.map((day) => (
            <Text key={day} style={styles.weekday}>
              {day}
            </Text>
          ))}
          {Array.from({ length: firstDay + dayCount }, (_, index) => {
            const day = index - firstDay + 1;
            if (day < 1) return <View key={`blank-${index}`} style={styles.dayWrap} />;
            const date = new Date(year, month, day);
            const disabled = date < earliest || date > latest;
            const formatted = `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`;
            return (
              <TouchableOpacity
                key={formatted}
                accessibilityRole="button"
                accessibilityLabel={formatted}
                accessibilityState={{ disabled, selected: value === formatted }}
                disabled={disabled}
                onPress={() => {
                  onChange(formatted);
                  setOpen(false);
                }}
                style={[styles.dayWrap, value === formatted && styles.activeDay]}
              >
                <Text
                  style={[
                    styles.dayText,
                    disabled && styles.disabledDay,
                    value === formatted && styles.activeDayText,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.help}>
          Year buttons se year choose karein, phir month aur day select karein.
        </Text>
      </BrandSheet>
    </>
  );
}

const styles = createBrandedStyles({
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: "700", marginBottom: 7 },
  star: { color: theme.colors.danger },
  input: {
    minHeight: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    borderRadius: 15,
    backgroundColor: theme.colors.surface,
    marginBottom: 12,
  },
  value: { color: theme.colors.text, fontSize: 16 },
  placeholder: { color: theme.colors.placeholder },
  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  control: {
    minWidth: 45,
    minHeight: 43,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 12,
  },
  controlText: { color: theme.colors.primary, fontWeight: "800" },
  year: { color: theme.colors.text, fontSize: 20, fontWeight: "800" },
  month: { color: theme.colors.text, fontSize: 18, fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  weekday: {
    width: "14.2857%",
    textAlign: "center",
    color: theme.colors.muted,
    fontWeight: "700",
    marginBottom: 8,
  },
  dayWrap: {
    width: "14.2857%",
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  dayText: { color: theme.colors.text, fontSize: 15, fontWeight: "700" },
  disabledDay: { color: theme.colors.borderStrong },
  activeDay: { backgroundColor: theme.colors.primary },
  activeDayText: { color: theme.colors.white },
  help: { color: theme.colors.muted, fontSize: 12, marginTop: 12 },
});
