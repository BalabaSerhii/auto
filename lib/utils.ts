import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { site } from "@/data/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Значення виду "[НАЗВА]" — ще не заповнене власником */
export function isPlaceholder(value: string | null | undefined): boolean {
  if (!value) return true;
  return /\[[^\]]+\]/.test(value);
}

export function isFilled(value: string | null | undefined): value is string {
  return !isPlaceholder(value);
}

/** tel:-посилання або null, якщо номер ще не вказано */
export function telHref(phone: string = site.phone): string | null {
  if (isPlaceholder(phone)) return null;
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function fullAddress(): string {
  const { street, city } = site.address;
  return [street, city].join(", ");
}

/** Посилання «Побудувати маршрут» або null, якщо адреса невідома */
export function routeHref(): string | null {
  if (site.address.routeUrl) return site.address.routeUrl;
  if (isPlaceholder(site.address.street) || isPlaceholder(site.address.city)) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress())}`;
}

export function activeMessengers() {
  return site.messengers.filter((m) => m.href);
}

/** Перший доступний месенджер для кнопки «Написати» */
export function primaryMessenger() {
  return activeMessengers()[0] ?? null;
}

export function formatUAH(value: number): string {
  return new Intl.NumberFormat("uk-UA").format(value);
}

/** «від 500 грн» або плейсхолдер, якщо ціну ще не вказано */
export function priceLabel(priceFrom: number | null): string {
  return priceFrom === null ? "від [ЦІНА] грн" : `від ${formatUAH(priceFrom)} грн`;
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, "");
}
