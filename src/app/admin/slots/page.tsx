import type { Metadata } from "next";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { Code2, MonitorSmartphone, Pencil, PlusCircle, Power, Trash2, X } from "lucide-react";
import ActionButton from "@/components/action-button";
import SlotForm from "@/components/slot-form";
import { db } from "@/db";
import { adSlots } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getT } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("as.meta") };
}

export default async function AdminSlotsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin();
  const { edit } = await searchParams;
  const editId = Number(edit ?? 0);

  const [{ t }, slots] = await Promise.all([
    getT(),
    db.select().from(adSlots).orderBy(asc(adSlots.position), asc(adSlots.id)),
  ]);
  const editing = slots.find((s) => s.id === editId);

  const POSITION_LABELS: Record<string, string> = {
    header: t("as.posHeader"),
    middle: t("as.posMiddle"),
    sidebar: t("as.posSidebar"),
    footer: t("as.posFooter"),
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-display text-xs tracking-[0.4em] text-brand">AD PLACEMENTS</p>
        <h1 className="mt-2 text-3xl font-extrabold text-wine">{t("as.title")}</h1>
        <p className="mt-1 text-sm leading-7 text-mist">{t("as.sub")}</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[400px_1fr]">
        {/* Form */}
        <section className="h-fit rounded-[1.75rem] border border-rosewash bg-white p-6 shadow-card xl:sticky xl:top-24">
          <h2 className="mb-4 flex items-center gap-2 font-extrabold text-wine">
            {editing ? <Pencil size={17} className="text-brand" /> : <PlusCircle size={17} className="text-brand" />}
            {editing ? `${t("as.edit")} ${editing.name}` : t("as.add")}
          </h2>
          {editing && (
            <Link
              href="/admin/slots"
              className="mb-4 flex items-center gap-1.5 rounded-xl bg-blush px-3 py-2 text-xs font-bold text-brand"
            >
              <X size={13} />
              {t("ac.cancelEdit")}
            </Link>
          )}
          <SlotForm key={editing?.id ?? "new"} initial={editing} />
        </section>

        {/* List */}
        <section className="rounded-[1.75rem] border border-rosewash bg-white p-6 shadow-card">
          <h2 className="mb-5 flex items-center gap-2 font-extrabold text-wine">
            <MonitorSmartphone size={17} className="text-brand" />
            {t("as.current")} ({slots.length})
          </h2>

          <div className="flex flex-col gap-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`flex flex-col gap-3 rounded-2xl border p-3.5 transition sm:flex-row sm:items-center ${
                  slot.isActive ? "border-blush bg-cream/50" : "border-dashed border-rosewash bg-white opacity-70"
                }`}
              >
                <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-blush">
                  {slot.imageUrl ? (
                    <img src={slot.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-brand/50">
                      <Code2 size={18} />
                    </span>
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-wine">{slot.name}</p>
                  <p className="mt-0.5 text-[11px] text-mist">
                    {POSITION_LABELS[slot.position] ?? slot.position}
                    {slot.htmlCode.trim() ? ` · ${t("as.customHtml")}` : ""}
                    {slot.linkUrl ? (
                      <>
                        {" · "}
                        <span dir="ltr" className="inline-block max-w-40 truncate align-bottom">
                          {slot.linkUrl}
                        </span>
                      </>
                    ) : (
                      ""
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      slot.isActive ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {slot.isActive ? t("as.visible") : t("as.hidden")}
                  </span>
                  <ActionButton
                    endpoint={`/api/slots/${slot.id}/toggle`}
                    title={t("as.showHide")}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-rosewash bg-white text-plum transition hover:border-brand hover:text-brand"
                  >
                    <Power size={14} />
                  </ActionButton>
                  <Link
                    href={`/admin/slots?edit=${slot.id}`}
                    title={t("common.edit")}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-rosewash bg-white text-plum transition hover:border-brand hover:text-brand"
                  >
                    <Pencil size={14} />
                  </Link>
                  <ActionButton
                    endpoint={`/api/slots/${slot.id}`}
                    method="DELETE"
                    confirm={t("as.confirmDelete")}
                    title={t("common.delete")}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-rosewash bg-white text-red-400 transition hover:border-red-400 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </ActionButton>
                </div>
              </div>
            ))}

            {!slots.length && (
              <p className="py-14 text-center text-sm font-bold text-mist">{t("as.empty")}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
