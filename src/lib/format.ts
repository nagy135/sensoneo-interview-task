import type { ProductPackaging } from "@/api/products-types";

import { i18n } from "../i18n";
import { APP_CURRENCY_CODE } from "../config/app";

function getLocale() {
  return i18n.resolvedLanguage || i18n.language;
}

function getCurrencySymbol(currency: string) {
  const parts = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).formatToParts(0);

  const symbol = parts.find((p) => p.type === "currency")?.value;
  return symbol || currency;
}

export function formatDepositCents(cents: number) {
  const dollars = cents / 100;
  const locale = getLocale();

  // We always display USD, with "$" before the number (even in non-en locales).
  // Intl currency formatting places the symbol after the number in some locales (e.g. de).
  // To keep locale-specific separators while enforcing prefix, we format the number separately.
  const symbol = getCurrencySymbol(APP_CURRENCY_CODE);
  const abs = Math.abs(dollars);
  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs);

  return dollars < 0
    ? `-${symbol}${formattedNumber}`
    : `${symbol}${formattedNumber}`;
}

export function formatVolume(volumeMl: number) {
  const locale = getLocale();
  if (volumeMl >= 1000) {
    const liters = volumeMl / 1000;
    const isWhole = volumeMl % 1000 === 0;
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: isWhole ? 0 : 1,
    }).format(liters);
    return i18n.t("units.liters", { value: formatted });
  }
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(volumeMl);
  return i18n.t("units.milliliters", { value: formatted });
}

export function formatPackaging(packaging: ProductPackaging) {
  const key = `products.packaging.${packaging}`;
  return i18n.exists(key) ? i18n.t(key) : packaging;
}

export function formatShortDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat(getLocale(), {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}
