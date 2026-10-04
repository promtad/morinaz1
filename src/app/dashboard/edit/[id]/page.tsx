import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, ArrowRight, PencilLine } from "lucide-react";
import AdForm from "@/components/ad-form";
import { db } from "@/db";
import { ads } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { parseImages } from "@/lib/format";
import { getT } from "@/lib/i18n-server";
import { getCategories } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("dash.metaEdit") };
}

export default async function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const adId = Number(id);
  if (!Number.isFinite(adId)) notFound();

  const rows = await db.select().from(ads).where(eq(ads.id, adId)).limit(1);
  const ad = rows[0];
  if (!ad) notFound();
  if (ad.userId !== user.id && user.role !== "admin") notFound();

  const [{ locale, t }, categories, settings] = await Promise.all([
    getT(),
    getCategories(),
    getSettings(),
  ]);

  const BackArrow = locale === "en" ? ArrowLeft : ArrowRight;

  return (
    <div className="shell max-w-3xl py-12">
      <Link
        href={user.role === "admin" ? "/admin/ads" : "/dashboard"}
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-mist transition hover:text-brand"
      >
        <BackArrow size={15} />
        {t("dash.backList")}
      </Link>

      <div className="mb-8">
        <p className="flex items-center gap-2 font-display text-xs tracking-[0.4em] text-brand">
          <PencilLine size={14} />
          EDIT LISTING
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-wine">
          {t("dash.editTitle")} #{ad.id}
        </h1>
      </div>

      <div className="rounded-[2rem] border border-rosewash bg-white p-7 shadow-card sm:p-9">
        <AdForm
          mode="edit"
          categories={categories.map((c) => ({ id: c.id, nameAr: c.nameAr, nameEn: c.nameEn }))}
          currency={settings.currency}
          initial={{
            id: ad.id,
            title: ad.title,
            description: ad.description,
            price: ad.price,
            oldPrice: ad.oldPrice,
            productUrl: ad.productUrl,
            categoryId: ad.categoryId,
            images: parseImages(ad.images),
          }}
        />
      </div>
    </div>
  );
}
