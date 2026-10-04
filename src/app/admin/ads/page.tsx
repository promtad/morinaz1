import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ExternalLink, Eye, Megaphone, Pencil, Pause, Play, Star, Trash2 } from "lucide-react";
import ActionButton from "@/components/action-button";
import { db } from "@/db";
import { ads, categories, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatPrice, parseImages, timeAgo } from "@/lib/format";
import { getT } from "@/lib/i18n-server";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("aa.meta") };
}

export default async function AdminAdsPage() {
  await requireAdmin();
  const [{ locale, t }, settings] = await Promise.all([getT(), getSettings()]);

  const rows = await db
    .select({ ad: ads, category: categories, seller: users.name })
    .from(ads)
    .innerJoin(categories, eq(categories.id, ads.categoryId))
    .innerJoin(users, eq(users.id, ads.userId))
    .orderBy(desc(ads.createdAt));

  const btn =
    "flex h-9 w-9 items-center justify-center rounded-xl border bg-white transition disabled:opacity-50";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-display text-xs tracking-[0.4em] text-brand">LISTINGS</p>
        <h1 className="mt-2 text-3xl font-extrabold text-wine">{t("aa.title")}</h1>
        <p className="mt-1 text-sm text-mist">{t("aa.sub")}</p>
      </div>

      <section className="rounded-[1.75rem] border border-rosewash bg-white p-6 shadow-card">
        <h2 className="mb-5 flex items-center gap-2 font-extrabold text-wine">
          <Megaphone size={17} className="text-brand" />
          {t("aa.all")} ({rows.length})
        </h2>

        <div className="flex flex-col gap-3">
          {rows.map(({ ad, category, seller }) => {
            const images = parseImages(ad.images);
            return (
              <div
                key={ad.id}
                className="flex flex-col gap-3 rounded-2xl border border-blush bg-cream/50 p-3.5 transition hover:border-brand/30 md:flex-row md:items-center"
              >
                <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-blush">
                  {images[0] ? (
                    <img src={images[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-brand/40">
                      <Megaphone size={18} />
                    </span>
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {ad.featured && <Star size={12} className="fill-gold text-gold" />}
                    <Link href={`/ads/${ad.id}`} className="line-clamp-1 text-sm font-extrabold text-wine transition hover:text-brand">
                      {ad.title}
                    </Link>
                  </div>
                  <p className="mt-1 text-[11px] text-mist">
                    {locale === "en" ? category.nameEn : category.nameAr} · {t("common.by")} {seller} ·{" "}
                    {timeAgo(ad.createdAt, locale)} ·
                    <Eye size={10} className="mx-1 inline" />
                    {ad.views}
                    {ad.productUrl && (
                      <a href={ad.productUrl} target="_blank" rel="noopener" className="ms-2 inline-flex items-center gap-0.5 text-brand hover:underline">
                        {t("aa.productLink")}
                        <ExternalLink size={9} />
                      </a>
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="whitespace-nowrap text-sm font-extrabold text-brand">
                    {formatPrice(ad.price)} {settings.currency}
                  </span>
                  <ActionButton
                    endpoint={`/api/ads/${ad.id}/featured`}
                    title={ad.featured ? t("aa.unfeature") : t("aa.feature")}
                    className={`${btn} ${ad.featured ? "border-gold/50 text-gold hover:bg-gold/10" : "border-rosewash text-mist hover:border-gold hover:text-gold"}`}
                  >
                    <Star size={15} className={ad.featured ? "fill-gold" : ""} />
                  </ActionButton>
                  <ActionButton
                    endpoint={`/api/ads/${ad.id}/toggle`}
                    title={ad.status === "active" ? t("dash.pauseTitle") : t("dash.resumeTitle")}
                    className={`${btn} ${ad.status === "active" ? "border-rosewash text-green-600 hover:border-amber-400 hover:text-amber-500" : "border-amber-300 text-amber-500 hover:border-green-500 hover:text-green-600"}`}
                  >
                    {ad.status === "active" ? <Pause size={14} /> : <Play size={14} />}
                  </ActionButton>
                  <Link
                    href={`/dashboard/edit/${ad.id}`}
                    title={t("common.edit")}
                    className={`${btn} border-rosewash text-plum hover:border-brand hover:text-brand`}
                  >
                    <Pencil size={14} />
                  </Link>
                  <ActionButton
                    endpoint={`/api/ads/${ad.id}`}
                    method="DELETE"
                    confirm={t("aa.confirmDelete")}
                    title={t("common.delete")}
                    className={`${btn} border-rosewash text-red-400 hover:border-red-400 hover:bg-red-50`}
                  >
                    <Trash2 size={14} />
                  </ActionButton>
                </div>
              </div>
            );
          })}

          {!rows.length && (
            <p className="py-14 text-center text-sm font-bold text-mist">{t("aa.empty")}</p>
          )}
        </div>
      </section>
    </div>
  );
}
