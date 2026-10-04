import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Category } from "@/db/schema";
import { getCategoryIcon } from "@/lib/icons";
import { getT } from "@/lib/i18n-server";

export default async function CategoryCard({
  category,
  adsCount,
}: {
  category: Category;
  adsCount: number;
}) {
  const { locale, t } = await getT();
  const Icon = getCategoryIcon(category.icon);
  const Arrow = locale === "en" ? ArrowRight : ArrowLeft;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block h-60 overflow-hidden rounded-[1.75rem] shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft"
    >
      {category.image ? (
        <img
          src={category.image}
          alt={category.nameAr}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand-deep to-wine" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-wine/95 via-wine/35 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div className="min-w-0">
          <span className="font-display text-[10px] tracking-[0.35em] text-rose-200/80">
            {category.nameEn.toUpperCase()}
          </span>
          <h3 className="mt-1 text-lg font-extrabold text-white">
            {locale === "en" ? category.nameEn : category.nameAr}
          </h3>
          <p className="mt-0.5 text-[11px] text-rose-200/80">
            {adsCount} {t("common.adsAvailable")}
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur transition duration-300 group-hover:bg-brand">
          <Icon size={20} />
        </span>
      </div>

      <span className="absolute end-4 top-4 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <Arrow size={15} />
      </span>
    </Link>
  );
}
