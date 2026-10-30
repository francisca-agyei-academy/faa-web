/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const ghs = new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" });

/** Formats a price stored in pesewas, e.g. 15000 → "GH₵150.00". */
export function formatPrice(pesewas: number) {
  return ghs.format(pesewas / 100);
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** e.g. "29 Oct 2026". */
export function formatDate(value: string | Date) {
  return dateFormat.format(typeof value === "string" ? new Date(value) : value);
}

export function fullName(user: { firstName: string; lastName: string }) {
  return `${user.firstName} ${user.lastName}`;
}
