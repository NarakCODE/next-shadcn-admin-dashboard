import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatCurrency(
  value: number | string,
  options: { currency?: string; noDecimals?: boolean } = {},
): string {
  const amount = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(amount)) return "";

  const currency = options.currency ?? "USD";
  const minimumFractionDigits = options.noDecimals ? 0 : 2;
  const maximumFractionDigits = options.noDecimals ? 0 : 2;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  } catch (_e) {
    return amount.toFixed(options.noDecimals ? 0 : 2);
  }
}
