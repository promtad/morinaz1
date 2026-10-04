"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api-client";
import { useT } from "@/lib/i18n-client";
import type { AdSlot } from "@/db/schema";

const POSITIONS = [
  { value: "header", labelKey: "as.header", descKey: "as.headerDesc", en: "HEADER" },
  { value: "middle", labelKey: "as.middle", descKey: "as.middleDesc", en: "MIDDLE" },
  { value: "sidebar", labelKey: "as.sidebar", descKey: "as.sidebarDesc", en: "SIDEBAR" },
  { value: "footer", labelKey: "as.footer", descKey: "as.footerDesc", en: "FOOTER" },
];

export default function SlotForm({ initial }: { initial?: AdSlot }) {
  const router = useRouter();
  const { t } = useT();
  const [name, setName] = useState(initial?.name ?? "");
  const [position, setPosition] = useState(initial?.position ?? "header");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [linkUrl, setLinkUrl] = useState(initial?.linkUrl ?? "");
  const [htmlCode, setHtmlCode] = useState(initial?.htmlCode ?? "");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    const raw = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    setImageUrl(raw);
    setUploading(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    const result = await apiPost("/api/slots", {
      id: initial?.id ?? 0,
      name,
      position,
      imageUrl,
      linkUrl,
      htmlCode,
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error ?? "Error");
      return;
    }
    setMessage(result.message ?? "");
    if (!initial) {
      setName("");
      setImageUrl("");
      setLinkUrl("");
      setHtmlCode("");
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
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

      <div>
        <label className="mb-1.5 block text-xs font-extrabold text-wine">{t("as.name")}</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("as.namePh")} className="field" />
      </div>

      <div>
        <label className="mb-2 block text-xs font-extrabold text-wine">{t("as.position")}</label>
        <div className="grid grid-cols-2 gap-2">
          {POSITIONS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPosition(p.value)}
              className={`rounded-2xl border p-3 text-start transition ${
                position === p.value ? "border-brand bg-blush" : "border-rosewash bg-white"
              }`}
            >
              <span className="block text-sm font-extrabold text-wine">
                {t(p.labelKey)}
                <span className="ms-2 font-display text-[9px] tracking-[0.25em] text-brand">{p.en}</span>
              </span>
              <span className="mt-0.5 block text-[10px] text-mist">{t(p.descKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-extrabold text-wine">{t("as.image")}</label>
        <div className="flex gap-2">
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} dir="ltr" placeholder="https://…" className="field text-left text-xs" />
          <label className="btn-ghost shrink-0 cursor-pointer !px-4 !py-2.5 text-xs">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
            {t("form.upload")}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                onFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {imageUrl && <img src={imageUrl} alt="" className="mt-2 h-24 w-full rounded-2xl border border-rosewash object-cover" />}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-extrabold text-wine">{t("as.link")}</label>
        <input dir="ltr" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://advertiser.com/offer" className="field text-left" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-extrabold text-wine">
          {t("as.html")} <span className="font-normal text-mist">({t("as.htmlHint")})</span>
        </label>
        <textarea rows={4} dir="ltr" value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)} placeholder="<script …></script>" className="field resize-none text-left font-mono !text-xs" />
      </div>

      <button type="submit" disabled={pending} className="btn-primary w-full !py-3">
        {pending ? <Loader2 size={16} className="animate-spin" /> : initial ? t("form.save") : t("as.add")}
      </button>
    </form>
  );
}
