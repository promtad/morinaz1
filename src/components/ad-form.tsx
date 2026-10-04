"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ImagePlus, Link2, Loader2, Plus, X } from "lucide-react";
import { apiPost } from "@/lib/api-client";
import { useT } from "@/lib/i18n-client";

export type AdFormInitial = {
  id: number;
  title: string;
  description: string;
  price: number;
  oldPrice: number | null;
  productUrl: string;
  categoryId: number;
  images: string[];
};

async function fileToDataUrl(file: File): Promise<string> {
  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = raw;
    });
    const max = 900;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    if (scale >= 1 && raw.length < 350_000) return raw;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    return raw;
  }
}

export default function AdForm({
  mode,
  categories,
  initial,
  currency,
}: {
  mode: "create" | "edit";
  categories: { id: number; nameAr: string; nameEn: string }[];
  initial?: AdFormInitial;
  currency: string;
}) {
  const router = useRouter();
  const { locale, t } = useT();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [categoryId, setCategoryId] = useState(String(initial?.categoryId ?? ""));
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [oldPrice, setOldPrice] = useState(initial?.oldPrice ? String(initial.oldPrice) : "");
  const [productUrl, setProductUrl] = useState(initial?.productUrl ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const room = 6 - images.length;
    const picked = Array.from(files).slice(0, room);
    const urls: string[] = [];
    for (const file of picked) urls.push(await fileToDataUrl(file));
    setImages((prev) => [...prev, ...urls].slice(0, 6));
    setUploading(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const payload = {
      title,
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      productUrl,
      categoryId: Number(categoryId),
      images,
    };
    const result =
      mode === "create"
        ? await apiPost("/api/ads", payload)
        : await apiPost(`/api/ads/${initial!.id}`, payload, "PATCH");
    if (!result.ok) {
      setError(result.error ?? "Error");
      setPending(false);
      return;
    }
    router.push(result.target ?? "/dashboard");
    router.refresh();
  }

  const inputDir = locale === "en" ? "ltr" : "rtl";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-extrabold text-wine">{t("form.title")}</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("form.titlePh")} className="field" dir={inputDir} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-extrabold text-wine">{t("form.category")}</label>
        <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="field">
          <option value="" disabled>
            {t("form.categoryPh")}
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === "en" ? c.nameEn : c.nameAr}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-extrabold text-wine">
            {t("form.price")} ({currency})
          </label>
          <input type="number" min={1} required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="149" className="field" dir="ltr" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-extrabold text-wine">
            {t("form.oldPrice")}{" "}
            <span className="font-normal text-mist">({t("form.oldPriceHint")})</span>
          </label>
          <input type="number" min={1} value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} placeholder="249" className="field" dir="ltr" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-extrabold text-wine">
          {t("form.url")} <span className="font-normal text-mist">({t("form.urlHint")})</span>
        </label>
        <div className="relative">
          <Link2 size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-mist" />
          <input type="url" dir="ltr" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder="https://your-store.com/product/123" className="field !ps-11 text-left" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-extrabold text-wine">{t("form.desc")}</label>
        <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("form.descPh")} className="field resize-none" dir={inputDir} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-extrabold text-wine">
          {t("form.images")} <span className="font-normal text-mist">({t("form.imagesHint")})</span>
        </label>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl border border-rosewash">
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, x) => x !== i))}
                className="absolute end-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-wine/80 text-white opacity-0 transition group-hover:opacity-100"
              >
                <X size={12} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 start-1 rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold text-white">
                  {t("form.mainPhoto")}
                </span>
              )}
            </div>
          ))}

          {images.length < 6 && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-rosewash bg-blush/50 text-mist transition hover:border-brand hover:text-brand">
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
              <span className="text-[10px] font-bold">{t("form.upload")}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  onFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>

        <div className="mt-2 flex gap-2">
          <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} dir="ltr" placeholder={t("form.imgUrlPh")} className="field !py-2.5 text-left text-xs" />
          <button
            type="button"
            onClick={() => {
              if (urlInput.trim().startsWith("http") && images.length < 6) {
                setImages((prev) => [...prev, urlInput.trim()]);
                setUrlInput("");
              }
            }}
            className="btn-ghost shrink-0 !px-4 !py-2 text-xs"
          >
            <Plus size={14} />
            {t("form.add")}
          </button>
        </div>
      </div>

      <button type="submit" disabled={pending} className="btn-primary w-full !py-3.5 text-base">
        {pending ? <Loader2 size={17} className="animate-spin" /> : mode === "create" ? t("form.publish") : t("form.save")}
      </button>
    </form>
  );
}
