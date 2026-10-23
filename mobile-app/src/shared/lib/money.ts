/** Formats illustrative INR values; does not compute settlements or taxes. */
export function money(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}
