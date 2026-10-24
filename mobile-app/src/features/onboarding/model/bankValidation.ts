export type BankSetupDetails = {
  bankHolder: string;
  bankAccount: string;
  bankIfsc: string;
  selfieReady: boolean;
};

/** Format checks for the local preview; these do not verify a real bank account. */
export function bankSetupIssue(details: BankSetupDetails): string | null {
  if (details.bankHolder.trim().length < 3) return "Enter the bank account holder's full name.";
  if (!/^\d{6,18}$/.test(details.bankAccount)) return "Account number must be 6–18 digits.";
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(details.bankIfsc.trim().toUpperCase()))
    return "Enter an 11-character IFSC, for example SBIN0001234.";
  if (!details.selfieReady) return "Tick the selfie step checkbox to continue.";
  return null;
}
