import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LANG_COOKIE, LOCALES, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { locale?: string };
  const locale: Locale = (LOCALES as string[]).includes(body.locale ?? "") ? (body.locale as Locale) : "ar";

  const store = await cookies();
  store.set(LANG_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return NextResponse.json({ ok: true, locale });
}
