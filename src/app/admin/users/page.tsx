import type { Metadata } from "next";
import { count, desc, eq } from "drizzle-orm";
import { ShieldCheck, ShieldOff, Trash2, Users } from "lucide-react";
import ActionButton from "@/components/action-button";
import { db } from "@/db";
import { ads, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getT } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("au.meta") };
}

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  const { locale, t } = await getT();

  const rows = await db
    .select({ user: users, adsCount: count(ads.id) })
    .from(users)
    .leftJoin(ads, eq(ads.userId, users.id))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-display text-xs tracking-[0.4em] text-brand">MEMBERS</p>
        <h1 className="mt-2 text-3xl font-extrabold text-wine">{t("au.title")}</h1>
        <p className="mt-1 text-sm text-mist">{t("au.sub")}</p>
      </div>

      <section className="rounded-[1.75rem] border border-rosewash bg-white p-6 shadow-card">
        <h2 className="mb-5 flex items-center gap-2 font-extrabold text-wine">
          <Users size={17} className="text-brand" />
          {t("au.all")} ({rows.length})
        </h2>

        <div className="flex flex-col gap-3">
          {rows.map(({ user, adsCount }) => (
            <div
              key={user.id}
              className="flex flex-col gap-3 rounded-2xl border border-blush bg-cream/50 p-4 sm:flex-row sm:items-center"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-base font-extrabold text-white">
                {user.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-wine">
                  {user.name}
                  {user.id === admin.id && (
                    <span className="ms-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold">
                      {t("au.you")}
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-mist">
                  <span dir="ltr">{user.email}</span> · {adsCount} {t("common.ads")} · {t("au.joined")}{" "}
                  {user.createdAt.toLocaleDateString(locale === "en" ? "en-US" : "ar", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                    user.role === "admin" ? "bg-wine text-gold" : "bg-blush text-brand"
                  }`}
                >
                  {user.role === "admin" ? t("ao.adminTag") : t("ao.memberTag")}
                </span>
                {user.id !== admin.id && (
                  <>
                    <ActionButton
                      endpoint={`/api/users/${user.id}/role`}
                      title={user.role === "admin" ? t("au.demote") : t("au.promote")}
                      confirm={user.role === "admin" ? t("au.confirmDemote") : t("au.confirmPromote")}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-rosewash bg-white text-plum transition hover:border-brand hover:text-brand"
                    >
                      {user.role === "admin" ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                    </ActionButton>
                    <ActionButton
                      endpoint={`/api/users/${user.id}`}
                      method="DELETE"
                      confirm={`${t("au.confirmDelete")} (${adsCount})`}
                      title={t("common.delete")}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-rosewash bg-white text-red-400 transition hover:border-red-400 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </ActionButton>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
