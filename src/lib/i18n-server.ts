import { cookies } from "next/headers";
import { LANG_COOKIE, tr, type Locale } from "./i18n";

export async function getLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    return store.get(LANG_COOKIE)?.value === "en" ? "en" : "ar";
  } catch {
    return "ar";
  }
}

export type TFn = (key: string) => string;

export async function getT(): Promise<{ locale: Locale; t: TFn }> {
  const locale = await getLocale();
  return { locale, t: (key: string) => tr(locale, key) };
}
