import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import {
  BadgePercent,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Hash,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import AdCard from "@/components/ad-card";
import CopyLink from "@/components/copy-link";
import Gallery from "@/components/gallery";
import Reveal from "@/components/reveal";
import { db } from "@/db";
import { ads } from "@/db/schema";
import { discountPercent, formatPrice, parseImages, timeAgo } from "@/lib/format";
import { getT } from "@/lib/i18n-server";
import { getSettings } from "@/lib/settings";
import { getAdById, getRelatedAds } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getAdById(Number(id));
  if (!data) return {};
  const images = parseImages(data.ad.images);
  return {
    title: data.ad.title,
    description: data.ad.description.slice(0, 160) || data.ad.title,
    openGraph: images.length ? { images: [images[0]] } : undefined,
  };
}

export default async function AdDetailsPage({ params }: Props) {
  const { id } = await params;
  const adId = Number(id);
  if (!Number.isFinite(adId)) notFound();

  const data = await getAdById(adId);
  if (!data) notFound();

  // Increment views (fire and forget, non-critical)
  try {
    await db
      .update(ads)
      .set({ views: sql`${ads.views} + 1` })
      .where(eq(ads.id, adId));
  } catch {
    // ignore
  }

  const { ad, category, sellerName } = data;
  const images = parseImages(ad.images);
  const pct = discountPercent(ad.price, ad.oldPrice);
  const [{ locale, t }, settings, related] = await Promise.all([
    getT(),
    getSettings(),
    getRelatedAds(category.id, ad.id),
  ]);

  const Chevron = locale === "en" ? ChevronRight : ChevronLeft;
  const catName = locale === "en" ? category.nameEn : category.nameAr;

  return (
    <div className="shell py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-xs font-bold text-mist">
        <Link href="/" className="transition hover:text-brand">
          {t("common.home")}
        </Link>
        <Chevron size={13} />
        <Link href={`/category/${category.slug}`} className="transition hover:text-brand">
          {catName}
        </Link>
        <Chevron size={13} />
        <span className="max-w-60 truncate text-wine">{ad.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Gallery */}
        <Reveal>
          <Gallery images={images} title={ad.title} />
        </Reveal>

        {/* Info */}
        <Reveal delay={0.1}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/category/${category.slug}`}
                className="rounded-full bg-blush px-3.5 py-1.5 text-xs font-extrabold text-brand transition hover:bg-rosewash"
              >
                {catName}
              </Link>
              {ad.featured && (
                <span className="flex items-center gap-1 rounded-full bg-wine px-3.5 py-1.5 text-xs font-bold text-gold">
                  <Sparkles size={12} />
                  {t("ad.featuredLabel")}
                </span>
              )}
              {ad.status !== "active" && (
                <span className="rounded-full bg-amber-100 px-3.5 py-1.5 text-xs font-bold text-amber-700">
                  {t("ad.pausedLabel")}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold leading-relaxed text-wine sm:text-3xl">
              {ad.title}
            </h1>

            {/* Price card */}
            <div className="relative overflow-hidden rounded-[1.75rem] border border-rosewash bg-gradient-to-l from-blush to-white p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-[11px] font-bold text-mist">{t("ad.priceNow")}</p>
                  <p className="mt-1 text-4xl font-extrabold text-brand">
                    {formatPrice(ad.price)}
                    <span className="ms-2 text-sm font-bold">{settings.currency}</span>
                  </p>
                </div>
                {ad.oldPrice && ad.oldPrice > ad.price && (
                  <div className="border-s border-rosewash ps-4">
                    <p className="text-[11px] font-bold text-mist">{t("ad.priceBefore")}</p>
                    <p className="mt-1 text-xl font-bold text-mist line-through">
                      {formatPrice(ad.oldPrice)}
                    </p>
                  </div>
                )}
                {pct > 0 && (
                  <span className="ms-auto flex items-center gap-1.5 rounded-2xl bg-gradient-to-l from-brand to-brand-deep px-4 py-2.5 text-sm font-extrabold text-white shadow-soft">
                    <BadgePercent size={16} />
                    {t("ad.youSave")} {pct}%
                  </span>
                )}
              </div>
              {ad.oldPrice && ad.oldPrice > ad.price && (
                <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-xs font-bold text-brand">
                  {t("ad.realSaving")} {formatPrice(ad.oldPrice - ad.price)} {settings.currency}
                </p>
              )}
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <div className="rounded-2xl border border-rosewash bg-white p-3 text-center">
                <Hash size={15} className="mx-auto mb-1 text-brand" />
                <p className="font-extrabold text-wine">#{ad.id}</p>
                <p className="text-[10px] text-mist">{t("ad.number")}</p>
              </div>
              <div className="rounded-2xl border border-rosewash bg-white p-3 text-center">
                <Eye size={15} className="mx-auto mb-1 text-brand" />
                <p className="font-extrabold text-wine">{ad.views + 1}</p>
                <p className="text-[10px] text-mist">{t("ad.views")}</p>
              </div>
              <div className="rounded-2xl border border-rosewash bg-white p-3 text-center">
                <Calendar size={15} className="mx-auto mb-1 text-brand" />
                <p className="font-extrabold text-wine">{timeAgo(ad.createdAt, locale)}</p>
                <p className="text-[10px] text-mist">{t("ad.published")}</p>
              </div>
              <div className="rounded-2xl border border-rosewash bg-white p-3 text-center">
                <UserRound size={15} className="mx-auto mb-1 text-brand" />
                <p className="truncate font-extrabold text-wine">{sellerName}</p>
                <p className="text-[10px] text-mist">{t("ad.seller")}</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              {ad.productUrl ? (
                <a
                  href={ad.productUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="btn-primary flex-1 !py-4 text-base"
                >
                  <ExternalLink size={18} />
                  {t("ad.visit")}
                </a>
              ) : (
                <div className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blush px-6 py-4 text-sm font-extrabold text-plum">
                  <ShieldCheck size={17} className="text-brand" />
                  {t("ad.contact")}
                </div>
              )}
              <CopyLink />
            </div>

            {ad.description && (
              <div className="rounded-[1.75rem] border border-rosewash bg-white p-6">
                <h2 className="mb-3 text-sm font-extrabold text-wine">
                  {t("ad.details")}
                  <span className="ms-2 font-display text-[9px] tracking-[0.3em] text-brand">DETAILS</span>
                </h2>
                <p className="whitespace-pre-line text-sm leading-8 text-plum/90">{ad.description}</p>
              </div>
            )}

            <div className="flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold/5 px-4 py-3 text-[11px] font-bold text-gold">
              <ShieldCheck size={15} />
              {t("ad.tip")}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <div className="mb-8">
            <p className="font-display text-xs tracking-[0.45em] text-brand">SIMILAR ITEMS</p>
            <h2 className="mt-2 text-2xl font-extrabold text-wine">{t("ad.similar")}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map(({ ad: r, category: c }, i) => (
              <Reveal key={r.id} delay={(i % 4) * 0.05}>
                <AdCard
                  ad={r}
                  categoryName={locale === "en" ? c.nameEn : c.nameAr}
                  currency={settings.currency}
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
