import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Inbox } from "lucide-react";
import AdBanner from "@/components/ad-banner";
import AdCard from "@/components/ad-card";
import Reveal from "@/components/reveal";
import { getT } from "@/lib/i18n-server";
import { getCategoryIcon } from "@/lib/icons";
import { getSettings } from "@/lib/settings";
import { getAdsByCategory, getCategoriesWithCounts, getCategoryBySlug, type AdsSort } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

const SORTS: { value: AdsSort; labelKey: string }[] = [
  { value: "new", labelKey: "cat.new" },
  { value: "cheap", labelKey: "cat.cheap" },
  { value: "expensive", labelKey: "cat.expensive" },
  { value: "popular", labelKey: "cat.popular" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.nameAr} | ${category.nameEn}`,
    description: category.description || `Browse ads in ${category.nameEn} with the best prices and discounts`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort: rawSort } = await searchParams;
  const sort: AdsSort = ["new", "cheap", "expensive", "popular"].includes(rawSort ?? "")
    ? (rawSort as AdsSort)
    : "new";

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [{ locale, t }, items, allCategories, settings] = await Promise.all([
    getT(),
    getAdsByCategory(category.id, sort),
    getCategoriesWithCounts(),
    getSettings(),
  ]);

  const Icon = getCategoryIcon(category.icon);
  const catName = (c: { nameAr: string; nameEn: string }) => (locale === "en" ? c.nameEn : c.nameAr);

  return (
    <div className="shell py-10">
      {/* Header */}
      <div className="relative mb-10 overflow-hidden rounded-[2.5rem] bg-gradient-to-l from-wine via-plum to-brand-deep p-8 text-white sm:p-12">
        {category.image && (
          <img
            src={category.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-l from-wine/90 via-wine/70 to-wine/40" />
        <div className="relative flex flex-wrap items-center gap-5">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
            <Icon size={30} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[10px] tracking-[0.4em] text-gold">
              {category.nameEn.toUpperCase()}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{catName(category)}</h1>
            {category.description && (
              <p className="mt-2 max-w-xl text-sm leading-7 text-rose-100/80">{category.description}</p>
            )}
          </div>
          <span className="ms-auto rounded-full bg-white/15 px-5 py-2 text-sm font-bold backdrop-blur">
            {items.length} {t("common.ads")}
          </span>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        {/* Listings */}
        <div className="min-w-0">
          {/* Sort */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold text-mist">{t("cat.sort")}</span>
            {SORTS.map((s) => (
              <Link
                key={s.value}
                href={`/category/${category.slug}?sort=${s.value}`}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  sort === s.value
                    ? "bg-gradient-to-l from-brand to-brand-deep text-white shadow-soft"
                    : "border border-rosewash bg-white text-plum hover:border-brand hover:text-brand"
                }`}
              >
                {t(s.labelKey)}
              </Link>
            ))}
          </div>

          {items.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map(({ ad, category: cat }, i) => (
                <Reveal key={ad.id} delay={(i % 3) * 0.05}>
                  <AdCard ad={ad} categoryName={catName(cat)} currency={settings.currency} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-[2rem] border-2 border-dashed border-rosewash bg-white/60 py-20 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blush text-brand">
                <Inbox size={24} />
              </span>
              <p className="font-bold text-plum">{t("cat.empty")}</p>
              <p className="text-xs text-mist">{t("cat.emptySub")}</p>
              <Link href="/dashboard/new" className="btn-primary mt-2 !px-5 !py-2.5 text-sm">
                {t("cat.postAd")}
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-8">
          <div className="rounded-[1.75rem] border border-rosewash bg-white p-5 shadow-card">
            <h3 className="mb-4 text-sm font-extrabold text-wine">
              {t("cat.other")}
              <span className="ms-2 font-display text-[9px] tracking-[0.3em] text-brand">SECTIONS</span>
            </h3>
            <div className="flex flex-col gap-1">
              {allCategories.map(({ category: c, adsCount }) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                    c.id === category.id
                      ? "bg-blush text-brand"
                      : "text-plum hover:bg-blush hover:text-brand"
                  }`}
                >
                  {catName(c)}
                  <span className="rounded-full bg-blush px-2 py-0.5 text-[10px] text-brand">
                    {adsCount}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <AdBanner position="sidebar" />
        </aside>
      </div>
    </div>
  );
}
