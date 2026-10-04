"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api-client";
import { getCategoryIcon, iconOptions } from "@/lib/icons";
import { useT } from "@/lib/i18n-client";
import type { Category } from "@/db/schema";

export default function CategoryForm({ initial }: { initial?: Category }) {
  const router = useRouter();
  const { t } = useT();
  const [nameAr, setNameAr] = useState(initial?.nameAr ?? "");
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "sparkles");
  const [image, setImage] = useState(initial?.image ?? "");
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
    setImage(raw);
    setUploading(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    const result = await apiPost("/api/categories", {
      id: initial?.id ?? 0,
      nameAr,
      nameEn,
      slug,
      description,
      icon,
      image,
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error ?? "Error");
      return;
    }
    setMessage(result.message ?? "");
    if (!initial) {
      setNameAr("");
      setNameEn("");
      setSlug("");
      setDescription("");
      setImage("");
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-extrabold text-wine">{t("ac.nameAr")}</label>
          <input required value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder="مكياج" className="field" dir="rtl" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-extrabold text-wine">{t("ac.nameEn")}</label>
          <input required dir="ltr" value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Makeup" className="field text-left" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-extrabold text-wine">
          {t("ac.slug")} <span className="font-normal text-mist">({t("ac.slugHint")})</span>
        </label>
        <input dir="ltr" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="makeup" className="field text-left" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-extrabold text-wine">{t("ac.desc")}</label>
        <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("ac.descPh")} className="field resize-none" />
      </div>

      <div>
        <label className="mb-2 block text-xs font-extrabold text-wine">{t("ac.icon")}</label>
        <div className="grid grid-cols-7 gap-2">
          {iconOptions.map((key) => {
            const Icon = getCategoryIcon(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setIcon(key)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                  icon === key ? "border-brand bg-blush text-brand" : "border-rosewash bg-white text-mist"
                }`}
              >
                <Icon size={17} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-extrabold text-wine">{t("ac.image")}</label>
        <div className="flex gap-2">
          <input value={image} onChange={(e) => setImage(e.target.value)} dir="ltr" placeholder="https://…" className="field text-left text-xs" />
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
        {image && <img src={image} alt="" className="mt-2 h-28 w-full rounded-2xl border border-rosewash object-cover" />}
      </div>

      <button type="submit" disabled={pending} className="btn-primary w-full !py-3">
        {pending ? <Loader2 size={16} className="animate-spin" /> : initial ? t("form.save") : t("ac.saveAdd")}
      </button>
    </form>
  );
}
