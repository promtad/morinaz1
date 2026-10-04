"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ExternalLink, FileUp, Globe, Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api-client";
import { useT } from "@/lib/i18n-client";
import type { SettingsMap } from "@/lib/settings";

export default function SettingsForm({ settings }: { settings: SettingsMap }) {
  const router = useRouter();
  const { t } = useT();
  const [values, setValues] = useState<SettingsMap>({ ...settings });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const set = (key: keyof SettingsMap) => (v: string) => setValues((prev) => ({ ...prev, [key]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    const result = await apiPost("/api/settings", values);
    setPending(false);
    if (!result.ok) {
      setError(result.error ?? "Error");
      return;
    }
    setMessage(t("set.saved"));
    router.refresh();
  }

  function TextField({
    k,
    labelKey,
    hintKey,
    dir = "auto",
  }: {
    k: keyof SettingsMap;
    labelKey: string;
    hintKey?: string;
    dir?: "auto" | "ltr";
  }) {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-extrabold text-wine">{t(labelKey)}</label>
        <input
          value={values[k]}
          onChange={(e) => set(k)(e.target.value)}
          dir={dir === "ltr" ? "ltr" : undefined}
          className={`field ${dir === "ltr" ? "text-left" : ""}`}
        />
        {hintKey && <p className="mt-1 text-[10px] text-mist">{t(hintKey)}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          <AlertCircle size={15} />
          {error}
        </div>
      )}
      {message && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
          <CheckCircle2 size={15} />
          {message}
        </div>
      )}

      {/* Identity */}
      <section className="rounded-[1.75rem] border border-rosewash bg-white p-6 shadow-card">
        <h3 className="mb-1 text-base font-extrabold text-wine">{t("set.identity")}</h3>
        <p className="mb-5 text-xs text-mist">{t("set.identitySub")}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField k="siteName" labelKey="set.siteName" hintKey="set.siteNameHint" />
          <TextField k="siteTagline" labelKey="set.tagline" />
          <TextField k="currency" labelKey="set.currency" hintKey="set.currencyHint" />
          <TextField k="contactEmail" labelKey="set.email" dir="ltr" />
          <TextField k="instagram" labelKey="set.instagram" dir="ltr" />
          <TextField k="twitter" labelKey="set.twitter" dir="ltr" />
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-[1.75rem] border border-rosewash bg-white p-6 shadow-card">
        <h3 className="mb-1 flex items-center gap-2 text-base font-extrabold text-wine">
          <Globe size={17} className="text-brand" />
          {t("set.seo")}
        </h3>
        <p className="mb-5 text-xs text-mist">{t("set.seoSub")}</p>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-extrabold text-wine">{t("set.desc")}</label>
            <textarea rows={3} value={values.siteDescription} onChange={(e) => set("siteDescription")(e.target.value)} className="field resize-none" />
            <p className="mt-1 text-[10px] text-mist">{t("set.descHint")}</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-extrabold text-wine">{t("set.keywords")}</label>
            <textarea rows={2} value={values.siteKeywords} onChange={(e) => set("siteKeywords")(e.target.value)} className="field resize-none" />
          </div>
        </div>
      </section>

      {/* ads.txt */}
      <section id="adstxt" className="rounded-[1.75rem] border border-rosewash bg-white p-6 shadow-card">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-wine">{t("set.adsTxtTitle")}</h3>
          <a href="/ads.txt" target="_blank" rel="noopener" className="flex items-center gap-1 text-xs font-bold text-brand hover:underline">
            {t("set.preview")}
            <ExternalLink size={12} />
          </a>
        </div>
        <p className="mb-4 text-xs leading-6 text-mist">
          {t("set.adsTxtSub")}{" "}
          <span dir="ltr" className="rounded bg-blush px-1.5 py-0.5 font-mono text-[10px] text-brand">
            /ads.txt
          </span>
        </p>

        <label className="btn-ghost mb-3 inline-flex w-fit cursor-pointer items-center gap-2 !px-4 !py-2 text-xs">
          <FileUp size={14} />
          {t("set.upload")}
          <input
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) set("adsTxt")(await file.text());
              e.target.value = "";
            }}
          />
        </label>

        <textarea
          rows={7}
          dir="ltr"
          value={values.adsTxt}
          onChange={(e) => set("adsTxt")(e.target.value)}
          className="field resize-none text-left font-mono !text-xs leading-6"
          spellCheck={false}
        />
      </section>

      <div className="sticky bottom-4 z-10">
        <button type="submit" disabled={pending} className="btn-primary w-full !py-4 text-base shadow-soft">
          {pending ? <Loader2 size={17} className="animate-spin" /> : t("set.save")}
        </button>
      </div>
    </form>
  );
}
