import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft, ArrowRight, Eye, FolderOpen, Megaphone, MonitorSmartphone, Users } from "lucide-react";
import { db } from "@/db";
import { ads, categories, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatPrice, timeAgo } from "@/lib/format";
import { getT } from "@/lib/i18n-server";
import { getSiteStats } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("ao.meta") };
}

export default async function AdminOverviewPage() {
  await requireAdmin();
  const [{ locale, t }, stats, settings] = await Promise.all([getT(), getSiteStats(), getSettings()]);

  const recentAds = await db
    .select({ ad: ads, category: categories, seller: users.name })
    .from(ads)
    .innerJoin(categories, eq(categories.id, ads.categoryId))
    .innerJoin(users, eq(users.id, ads.userId))
    .orderBy(desc(ads.createdAt))
    .limit(6);

  const recentUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(5);

  const Arrow = locale === "en" ? ArrowRight : ArrowLeft;

  const cards = [
    { icon: Megaphone, labelKey: "ao.totalAds", en: "ADS", value: stats.ads, href: "/admin/ads" },
    { icon: FolderOpen, labelKey: "ao.sections", en: "SECTIONS", value: stats.categories, href: "/admin/categories" },
    { icon: Users, labelKey: "ao.members", en: "MEMBERS", value: stats.users, href: "/admin/users" },
    { icon: Eye, labelKey: "ao.views", en: "VIEWS", value: stats.views, href: "/admin/ads" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-display text-xs tracking-[0.4em] text-brand">CONTROL CENTER</p>
        <h1 className="mt-2 text-3xl font-extrabold text-wine">{t("ao.title")}</h1>
        <p className="mt-1 text-sm text-mist">{t("ao.sub")}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.labelKey}
            href={card.href}
            className="group rounded-[1.75rem] border border-rosewash bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-brand/40"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-soft">
              <card.icon size={20} />
            </span>
            <p className="mt-4 text-3xl font-extrabold text-wine">{card.value}</p>
            <p className="mt-1 text-xs font-bold text-mist">
              {t(card.labelKey)}
              <span className="ms-2 font-display text-[9px] tracking-[0.25em] text-brand/60">{card.en}</span>
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        {/* Recent ads */}
        <section className="rounded-[1.75rem] border border-rosewash bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-extrabold text-wine">{t("ao.recentAds")}</h2>
            <Link href="/admin/ads" className="flex items-center gap-1 text-xs font-bold text-brand hover:underline">
              {t("ao.manageAll")}
              <Arrow size={12} />
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-blush">
            {recentAds.map(({ ad, category, seller }) => (
              <div key={ad.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <Link href={`/ads/${ad.id}`} className="line-clamp-1 text-sm font-bold text-wine transition hover:text-brand">
                    {ad.title}
                  </Link>
                  <p className="mt-0.5 text-[11px] text-mist">
                    {locale === "en" ? category.nameEn : category.nameAr} · {t("common.by")} {seller} ·{" "}
                    {timeAgo(ad.createdAt, locale)}
                  </p>
                </div>
                <span className="text-sm font-extrabold text-brand">
                  {formatPrice(ad.price)} {settings.currency}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    ad.status === "active" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {ad.status === "active" ? t("common.active") : t("common.paused")}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent users + quick actions */}
        <div className="flex flex-col gap-8">
          <section className="rounded-[1.75rem] border border-rosewash bg-white p-6 shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-extrabold text-wine">{t("ao.recentUsers")}</h2>
              <Link href="/admin/users" className="flex items-center gap-1 text-xs font-bold text-brand hover:underline">
                {t("ao.all")}
                <Arrow size={12} />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush text-sm font-extrabold text-brand">
                    {u.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-wine">{u.name}</p>
                    <p className="truncate text-[11px] text-mist" dir="ltr">{u.email}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      u.role === "admin" ? "bg-wine text-gold" : "bg-blush text-brand"
                    }`}
                  >
                    {u.role === "admin" ? t("ao.adminTag") : t("ao.memberTag")}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <Link
            href="/admin/slots"
            className="group flex items-center gap-4 rounded-[1.75rem] bg-gradient-to-l from-wine to-brand-deep p-6 text-white shadow-soft transition hover:-translate-y-1"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <MonitorSmartphone size={20} />
            </span>
            <div>
              <p className="font-extrabold">{t("ao.slotsCard")}</p>
              <p className="mt-0.5 text-xs text-rose-100/80">{t("ao.slotsCardSub")}</p>
            </div>
            <Arrow size={17} className="ms-auto transition group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
