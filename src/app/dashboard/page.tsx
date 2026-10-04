import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { Eye, Inbox, Megaphone, Pencil, Pause, Play, Plus, Trash2 } from "lucide-react";
import ActionButton from "@/components/action-button";
import { db } from "@/db";
import { ads, categories } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { discountPercent, formatPrice, parseImages, timeAgo } from "@/lib/format";
import { getT } from "@/lib/i18n-server";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("dash.myPanel") };
}

export default async function DashboardPage() {
  const user = await requireUser();
  const [{ locale, t }, settings] = await Promise.all([getT(), getSettings()]);

  const myAds = await db
    .select({ ad: ads, category: categories })
    .from(ads)
    .innerJoin(categories, eq(categories.id, ads.categoryId))
    .where(eq(ads.userId, user.id))
    .orderBy(desc(ads.createdAt));

  const [{ totalViews }] = await db
    .select({ totalViews: sql<number>`coalesce(sum(${ads.views}),0)` })
    .from(ads)
    .where(eq(ads.userId, user.id));

  const active = myAds.filter(({ ad }) => ad.status === "active").length;

  return (
    <div className="shell py-12">
      {/* Head */}
      <div className="mb-10 flex flex-wrap items-center gap-5 rounded-[2rem] bg-gradient-to-l from-wine to-brand-deep p-8 text-white shadow-soft">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
          <Megaphone size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[10px] tracking-[0.4em] text-gold">MY DASHBOARD</p>
          <h1 className="mt-1 text-2xl font-extrabold">
            {t("dash.hello")} {user.name}
          </h1>
          <p className="mt-1 text-sm text-rose-100/80">{t("dash.sub")}</p>
        </div>
        <Link href="/dashboard/new" className="rounded-full bg-white px-6 py-3 text-sm font-extrabold text-brand shadow-lg transition hover:-translate-y-0.5">
          <span className="flex items-center gap-2">
            <Plus size={16} />
            {t("dash.new")}
          </span>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-3 gap-4">
        <div className="rounded-3xl border border-rosewash bg-white p-5 text-center shadow-card">
          <p className="text-3xl font-extrabold text-brand">{myAds.length}</p>
          <p className="mt-1 text-xs font-bold text-mist">{t("dash.total")}</p>
        </div>
        <div className="rounded-3xl border border-rosewash bg-white p-5 text-center shadow-card">
          <p className="text-3xl font-extrabold text-brand">{active}</p>
          <p className="mt-1 text-xs font-bold text-mist">{t("dash.active")}</p>
        </div>
        <div className="rounded-3xl border border-rosewash bg-white p-5 text-center shadow-card">
          <p className="flex items-center justify-center gap-1 text-3xl font-extrabold text-brand">
            <Eye size={20} />
            {Number(totalViews)}
          </p>
          <p className="mt-1 text-xs font-bold text-mist">{t("dash.views")}</p>
        </div>
      </div>

      {/* List */}
      {myAds.length ? (
        <div className="flex flex-col gap-4">
          {myAds.map(({ ad, category }) => {
            const images = parseImages(ad.images);
            const pct = discountPercent(ad.price, ad.oldPrice);
            return (
              <div
                key={ad.id}
                className="flex flex-col gap-4 rounded-[1.75rem] border border-rosewash bg-white p-4 shadow-card transition hover:border-brand/30 sm:flex-row sm:items-center"
              >
                <Link
                  href={`/ads/${ad.id}`}
                  className="relative h-24 w-full shrink-0 overflow-hidden rounded-2xl bg-blush sm:w-32"
                >
                  {images[0] ? (
                    <img src={images[0]} alt={ad.title} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-brand/40">
                      <Megaphone size={22} />
                    </span>
                  )}
                  {pct > 0 && (
                    <span className="absolute start-2 top-2 rounded-full bg-brand px-2 py-0.5 text-[9px] font-extrabold text-white">
                      -{pct}%
                    </span>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blush px-2.5 py-0.5 text-[10px] font-bold text-brand">
                      {locale === "en" ? category.nameEn : category.nameAr}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        ad.status === "active" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {ad.status === "active" ? t("common.active") : t("common.paused")}
                    </span>
                    <span className="text-[10px] text-mist">{timeAgo(ad.createdAt, locale)}</span>
                  </div>
                  <Link
                    href={`/ads/${ad.id}`}
                    className="mt-1.5 line-clamp-1 block font-extrabold text-wine transition hover:text-brand"
                  >
                    {ad.title}
                  </Link>
                  <p className="mt-1 text-sm font-extrabold text-brand">
                    {formatPrice(ad.price)} {settings.currency}
                    {ad.oldPrice && ad.oldPrice > ad.price && (
                      <span className="ms-2 text-xs font-normal text-mist line-through">
                        {formatPrice(ad.oldPrice)}
                      </span>
                    )}
                    <span className="ms-3 text-[10px] font-bold text-mist">
                      <Eye size={11} className="me-0.5 inline" />
                      {ad.views}
                    </span>
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/dashboard/edit/${ad.id}`}
                    title={t("common.edit")}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-rosewash text-plum transition hover:border-brand hover:text-brand"
                  >
                    <Pencil size={15} />
                  </Link>
                  <ActionButton
                    endpoint={`/api/ads/${ad.id}/toggle`}
                    title={ad.status === "active" ? t("dash.pauseTitle") : t("dash.resumeTitle")}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-rosewash text-plum transition hover:border-amber-400 hover:text-amber-500"
                  >
                    {ad.status === "active" ? <Pause size={15} /> : <Play size={15} />}
                  </ActionButton>
                  <ActionButton
                    endpoint={`/api/ads/${ad.id}`}
                    method="DELETE"
                    confirm={t("dash.confirmDelete")}
                    title={t("common.delete")}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-rosewash text-red-400 transition hover:border-red-400 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                  </ActionButton>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-[2rem] border-2 border-dashed border-rosewash bg-white/60 py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blush text-brand">
            <Inbox size={28} />
          </span>
          <p className="text-lg font-extrabold text-wine">{t("dash.empty")}</p>
          <p className="max-w-sm text-sm leading-7 text-mist">{t("dash.emptySub")}</p>
          <Link href="/dashboard/new" className="btn-primary mt-2">
            <Plus size={17} />
            {t("dash.first")}
          </Link>
        </div>
      )}
    </div>
  );
}
