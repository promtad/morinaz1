import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, PlusCircle } from "lucide-react";
import AdForm from "@/components/ad-form";
import { requireUser } from "@/lib/auth";
import { getT } from "@/lib/i18n-server";
import { getCategories } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("dash.metaNew") };
}

export default async function NewAdPage() {
  await requireUser();
  const [{ locale, t }, categories, settings] = await Promise.all([
    getT(),
    getCategories(),
    getSettings(),
  ]);

  const BackArrow = locale === "en" ? ArrowLeft : ArrowRight;

  return (
    <div className="shell max-w-3xl py-12">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-mist transition hover:text-brand">
        <BackArrow size={15} />
        {t("dash.backPanel")}
      </Link>

      <div className="mb-8">
        <p className="flex items-center gap-2 font-display text-xs tracking-[0.4em] text-brand">
          <PlusCircle size={14} />
          NEW LISTING
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-wine">{t("dash.newTitle")}</h1>
        <p className="mt-2 text-sm leading-7 text-mist">{t("dash.newSub")}</p>
      </div>

      <div className="rounded-[2rem] border border-rosewash bg-white p-7 shadow-card sm:p-9">
        <AdForm
          mode="create"
          categories={categories.map((c) => ({ id: c.id, nameAr: c.nameAr, nameEn: c.nameEn }))}
          currency={settings.currency}
        />
      </div>
    </div>
  );
}
