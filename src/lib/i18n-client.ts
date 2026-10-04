"use client";

import { LANG_COOKIE, tr, type Locale } from "./i18n";

export function getClientLocale(): Locale {
  if (typeof document === "undefined") return "ar";
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=(en|ar)`));
  return match?.[1] === "en" ? "en" : "ar";
}

export function useT(): { locale: Locale; t: (key: string) => string } {
  const locale = getClientLocale();
  return { locale, t: (key: string) => tr(locale, key) };
}
