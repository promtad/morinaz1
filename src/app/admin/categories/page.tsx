import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { FolderOpen, Pencil, PlusCircle, Trash2, X } from "lucide-react";
import ActionButton from "@/components/action-button";
import CategoryForm from "@/components/category-form";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getCategoryIcon } from "@/lib/icons";
import { getT } from "@/lib/i18n-server";
import { getCategoriesWithCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("ac.meta") };
}

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin();
  const { edit } = await searchParams;
  const editId = Number(edit ?? 0);

  const [{ locale, t }, rows, all] = await Promise.all([
    getT(),
    getCategoriesWithCounts(),
    db.select().from(categories).orderBy(categories.id),
  ]);
  const editing = all.find((c) => c.id === editId);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-display text-xs tracking-[0.4em] text-brand">SECTIONS</p>
        <h1 className="mt-2 text-3xl font-extrabold text-wine">{t("ac.title")}</h1>
        <p className="mt-1 text-sm text-mist">{t("ac.sub")}</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[380px_1fr]">
        {/* Form */}
        <section className="h-fit rounded-[1.75rem] border border-rosewash bg-white p-6 shadow-card xl:sticky xl:top-24">
          <h2 className="mb-4 flex items-center gap-2 font-extrabold text-wine">
            {editing ? <Pencil size={17} className="text-brand" /> : <PlusCircle size={17} className="text-brand" />}
            {editing ? `${t("ac.edit")} ${locale === "en" ? editing.nameEn : editing.nameAr}` : t("ac.add")}
          </h2>
          {editing && (
            <Link
              href="/admin/categories"
              className="mb-4 flex items-center gap-1.5 rounded-xl bg-blush px-3 py-2 text-xs font-bold text-brand"
            >
              <X size={13} />
              {t("ac.cancelEdit")}
            </Link>
          )}
          <CategoryForm key={editing?.id ?? "new"} initial={editing} />
        </section>

        {/* List */}
        <section className="rounded-[1.75rem] border border-rosewash bg-white p-6 shadow-card">
          <h2 className="mb-5 flex items-center gap-2 font-extrabold text-wine">
            <FolderOpen size={17} className="text-brand" />
            {t("ac.current")} ({rows.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {rows.map(({ category, adsCount }) => {
              const Icon = getCategoryIcon(category.icon);
              return (
                <div
                  key={category.id}
                  className="flex items-center gap-3 rounded-2xl border border-blush bg-cream/50 p-3.5 transition hover:border-brand/30"
                >
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-blush">
                    {category.image ? (
                      <img src={category.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-brand">
                        <Icon size={19} />
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-wine">
                      {category.nameAr}
                      <span className="ms-2 font-display text-[9px] tracking-[0.2em] text-mist">
                        {category.nameEn.toUpperCase()}
                      </span>
                    </p>
                    <p className="text-[11px] text-mist">
                      <span dir="ltr">/{category.slug}</span> · {adsCount} {t("common.ads")}
                    </p>
                  </div>
                  <Link
                    href={`/admin/categories?edit=${category.id}`}
                    title={t("common.edit")}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-rosewash bg-white text-plum transition hover:border-brand hover:text-brand"
                  >
                    <Pencil size={14} />
                  </Link>
                  <ActionButton
                    endpoint={`/api/categories/${category.id}`}
                    method="DELETE"
                    confirm={`${t("ac.confirmDelete")} (${adsCount})`}
                    title={t("common.delete")}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-rosewash bg-white text-red-400 transition hover:border-red-400 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </ActionButton>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
