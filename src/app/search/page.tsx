import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import AdCard from "@/components/ad-card";
import Reveal from "@/components/reveal";
import SearchBar from "@/components/search-bar";
import { getT } from "@/lib/i18n-server";
import { getSettings } from "@/lib/settings";
import { searchAds } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("search.meta") };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const [{ locale, t }, settings] = await Promise.all([getT(), getSettings()]);
  const results = query ? await searchAds(query) : [];
  const catName = (c: { nameAr: string; nameEn: string }) => (locale === "en" ? c.nameEn : c.nameAr);

  return (
    <div className="shell py-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-display text-xs tracking-[0.45em] text-brand">SEARCH</p>
        <h1 className="mt-2 text-3xl font-extrabold text-wine">{t("search.title")}</h1>
        <SearchBar className="mt-6" initial={query} />
      </div>

      {query && (
        <div className="mt-12">
          <p className="mb-6 text-sm font-bold text-plum">
            {t("search.resultsFor")} <span className="text-brand">«{query}»</span>
            <span className="ms-2 text-mist">
              ({results.length} {t("search.count")})
            </span>
          </p>

          {results.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {results.map(({ ad, category }, i) => (
                <Reveal key={ad.id} delay={(i % 4) * 0.05}>
                  <AdCard ad={ad} categoryName={catName(category)} currency={settings.currency} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-[2rem] border-2 border-dashed border-rosewash bg-white/60 py-20 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blush text-brand">
                <SearchX size={24} />
              </span>
              <p className="font-bold text-plum">{t("search.empty")}</p>
              <p className="text-xs text-mist">{t("search.emptySub")}</p>
              <Link href="/" className="btn-ghost mt-2 !px-5 !py-2.5 text-sm">
                {t("search.backHome")}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
