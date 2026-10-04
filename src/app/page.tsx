import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgePercent, Inbox, Sparkles } from "lucide-react";
import AdBanner from "@/components/ad-banner";
import AdCard from "@/components/ad-card";
import CategoryCard from "@/components/category-card";
import Hero from "@/components/hero";
import Marquee from "@/components/marquee";
import Reveal from "@/components/reveal";
import { getT, type TFn } from "@/lib/i18n-server";
import type { Locale } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import {
  getCategoriesWithCounts,
  getFeaturedAds,
  getLatestAds,
  getSiteStats,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

function SectionHead({
  en,
  title,
  sub,
  href,
  light = false,
  t,
  locale,
}: {
  en: string;
  title: string;
  sub?: string;
  href?: string;
  light?: boolean;
  t: TFn;
  locale: Locale;
}) {
  const Arrow = locale === "en" ? ArrowRight : ArrowLeft;
  return (
    <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className={`font-display text-xs tracking-[0.45em] ${light ? "text-gold" : "text-brand"}`}>
          {en}
        </p>
        <h2 className={`mt-2 text-2xl font-extrabold sm:text-3xl ${light ? "text-white" : "text-wine"}`}>
          {title}
        </h2>
        {sub && <p className={`mt-2 max-w-xl text-sm leading-7 ${light ? "text-rose-200/70" : "text-mist"}`}>{sub}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className={`flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-bold transition ${
            light
              ? "border-white/20 text-white hover:bg-white/10"
              : "border-rosewash bg-white text-plum hover:border-brand hover:text-brand"
          }`}
        >
          {t("common.viewAll")}
          <Arrow size={15} />
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [{ locale, t }, settings, stats, categories, featured, latest] = await Promise.all([
    getT(),
    getSettings(),
    getSiteStats(),
    getCategoriesWithCounts(),
    getFeaturedAds(8),
    getLatestAds(12),
  ]);

  const catName = (c: { nameAr: string; nameEn: string }) => (locale === "en" ? c.nameEn : c.nameAr);

  return (
    <>
      <Hero stats={stats} />
      <Marquee />

      {/* Categories */}
      <section id="categories" className="shell scroll-mt-28 py-16">
        <SectionHead
          en="SHOP BY SECTION"
          title={t("home.sectionsTitle")}
          sub={t("home.sectionsSub")}
          t={t}
          locale={locale}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ category, adsCount }, i) => (
            <Reveal key={category.id} delay={(i % 4) * 0.06}>
              <CategoryCard category={category} adsCount={adsCount} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured deals */}
      <section id="deals" className="relative scroll-mt-28 overflow-hidden bg-wine py-16">
        <div className="pointer-events-none absolute inset-0 pattern-dots opacity-20" />
        <div className="pointer-events-none absolute -end-24 -top-24 h-80 w-80 rounded-full bg-brand/30 blur-3xl" />
        <div className="shell relative">
          <SectionHead
            light
            en="FEATURED DEALS"
            title={t("home.dealsTitle")}
            sub={t("home.dealsSub")}
            t={t}
            locale={locale}
          />
          {featured.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map(({ ad, category }, i) => (
                <Reveal key={ad.id} delay={(i % 4) * 0.06}>
                  <AdCard ad={ad} categoryName={catName(category)} currency={settings.currency} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/15 bg-white/5 p-10 text-center text-sm font-bold text-rose-200">
              <BadgePercent className="mx-auto mb-3 text-gold" size={30} />
              {t("home.dealsEmpty")}
            </div>
          )}
        </div>
      </section>

      {/* Middle ad placements */}
      <div className="py-14">
        <AdBanner position="middle" />
      </div>

      {/* Latest ads */}
      <section id="latest" className="shell scroll-mt-28 pb-4">
        <SectionHead
          en="FRESH LISTINGS"
          title={t("home.latestTitle")}
          sub={t("home.latestSub")}
          t={t}
          locale={locale}
        />
        {latest.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map(({ ad, category }, i) => (
              <Reveal key={ad.id} delay={(i % 4) * 0.05}>
                <AdCard ad={ad} categoryName={catName(category)} currency={settings.currency} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[2rem] border-2 border-dashed border-rosewash bg-white/60 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blush text-brand">
              <Inbox size={24} />
            </span>
            <p className="font-bold text-plum">{t("home.emptyAds")}</p>
            <Link href="/dashboard/new" className="btn-primary !px-5 !py-2.5 text-sm">
              <Sparkles size={15} />
              {t("home.beFirst")}
            </Link>
          </div>
        )}
      </section>

      {/* CTA band */}
      <section className="shell py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-l from-brand via-brand-deep to-wine p-10 text-center text-white shadow-soft sm:p-14">
            <div className="pointer-events-none absolute -start-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -end-10 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
            <p className="relative font-display text-xs tracking-[0.5em] text-rose-200">JOIN LAMSA</p>
            <h2 className="relative mt-3 text-2xl font-extrabold leading-relaxed sm:text-4xl">
              {t("home.ctaTitle")}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-8 text-rose-100/90">
              {t("home.ctaSub")}
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-brand shadow-lg transition hover:-translate-y-0.5"
              >
                {t("home.ctaJoin")}
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/10"
              >
                {t("home.ctaLogin")}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
