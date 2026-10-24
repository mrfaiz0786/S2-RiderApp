/** Date of birth is entered as DD/MM/YYYY. Invalid or future dates never pass. */
export function isAdult(dateOfBirth: string, today = new Date()): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateOfBirth.trim());
  if (!match) return false;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day)
    return false;
  let age = today.getFullYear() - year;
  if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day))
    age--;
  return age >= 18 && age <= 100;
}
