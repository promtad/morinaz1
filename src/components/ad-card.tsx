import Link from "next/link";
import { Eye, Sparkles, Tag } from "lucide-react";
import type { Ad } from "@/db/schema";
import { discountPercent, formatPrice, parseImages } from "@/lib/format";
import { getT } from "@/lib/i18n-server";

export default async function AdCard({
  ad,
  categoryName,
  currency,
}: {
  ad: Ad;
  categoryName: string;
  currency: string;
}) {
  const { t } = await getT();
  const images = parseImages(ad.images);
  const pct = discountPercent(ad.price, ad.oldPrice);

  return (
    <Link
      href={`/ads/${ad.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-rosewash bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-soft"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-blush">
        {images[0] ? (
          <img
            src={images[0]}
            alt={ad.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blush via-rosewash to-blush">
            <Tag className="text-brand/30" size={44} />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine/25 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

        {pct > 0 && (
          <span className="absolute end-3 top-3 rounded-full bg-gradient-to-l from-brand to-brand-deep px-3 py-1 text-xs font-extrabold text-white shadow-lg">
            {t("common.discount")} {pct}%
          </span>
        )}
        {ad.featured && (
          <span className="absolute start-3 top-3 flex items-center gap-1 rounded-full bg-wine/85 px-2.5 py-1 text-[10px] font-bold text-gold backdrop-blur">
            <Sparkles size={11} />
            {t("common.featured")}
          </span>
        )}
        {images.length > 1 && (
          <span className="absolute bottom-3 end-3 rounded-full bg-wine/70 px-2 py-0.5 text-[10px] text-white backdrop-blur">
            {images.length} {t("common.photos")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-blush px-2.5 py-0.5 text-[10px] font-bold text-brand">
            {categoryName}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-mist">
            <Eye size={12} />
            {ad.views}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-[2.6rem] text-sm font-bold leading-relaxed text-wine transition group-hover:text-brand">
          {ad.title}
        </h3>

        <div className="mt-auto flex items-baseline gap-2 border-t border-blush pt-3">
          <span className="text-lg font-extrabold text-brand">
            {formatPrice(ad.price)}
            <span className="ms-1 text-[11px] font-bold">{currency}</span>
          </span>
          {ad.oldPrice && ad.oldPrice > ad.price && (
            <span className="text-xs text-mist line-through">{formatPrice(ad.oldPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
