"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { getClientLocale } from "@/lib/i18n-client";
import type { Locale } from "@/lib/i18n";

export default function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const locale = getClientLocale();

  async function setLocale(next: Locale) {
    if (next === locale) return;
    await fetch("/api/lang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border border-rosewash bg-white p-0.5 ${
        pending ? "opacity-70" : ""
      }`}
      title="Language / اللغة"
    >
      {!compact && <Languages size={13} className="ms-1.5 text-mist" />}
      <button
        type="button"
        onClick={() => setLocale("ar")}
        className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold transition ${
          locale === "ar" ? "bg-gradient-to-l from-brand to-brand-deep text-white" : "text-mist hover:text-brand"
        }`}
      >
        عربي
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-full px-2.5 py-1 font-display text-[10px] tracking-wider transition ${
          locale === "en" ? "bg-gradient-to-l from-brand to-brand-deep text-white" : "text-mist hover:text-brand"
        }`}
      >
        EN
      </button>
    </div>
  );
}
