import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BadgePercent, Crown, Megaphone, Sparkles } from "lucide-react";
import { RegisterForm } from "@/components/auth-forms";
import { getCurrentUser } from "@/lib/auth";
import { getT } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("auth.metaRegister") };
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(next?.startsWith("/") ? next : "/dashboard");

  const { t } = await getT();

  const PERKS = [
    { icon: Megaphone, title: t("auth.perk1t"), desc: t("auth.perk1d") },
    { icon: BadgePercent, title: t("auth.perk2t"), desc: t("auth.perk2d") },
    { icon: Crown, title: t("auth.perk3t"), desc: t("auth.perk3d") },
  ];

  return (
    <div className="shell grid items-center gap-10 py-14 lg:grid-cols-2">
      {/* Form */}
      <div className="mx-auto w-full max-w-md lg:order-2">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-soft">
            <Sparkles size={22} />
          </span>
          <p className="font-display text-xs tracking-[0.45em] text-brand">JOIN US FREE</p>
          <h1 className="mt-2 text-3xl font-extrabold text-wine">{t("auth.registerTitle")}</h1>
          <p className="mt-2 text-sm text-mist">{t("auth.registerSub")}</p>
        </div>

        <div className="rounded-[2rem] border border-rosewash bg-white p-7 shadow-card">
          <RegisterForm next={next?.startsWith("/") ? next : ""} />
        </div>
      </div>

      {/* Perks */}
      <div className="relative hidden lg:block lg:order-1">
        <div className="overflow-hidden rounded-[2.75rem] bg-gradient-to-br from-wine via-plum to-brand-deep p-10 text-white shadow-soft">
          <div className="pointer-events-none absolute -start-10 -top-10 h-56 w-56 rounded-full bg-brand/30 blur-3xl" />
          <p className="relative font-display text-xs tracking-[0.4em] text-gold">WHY LAMSA</p>
          <h2 className="relative mt-3 text-3xl font-extrabold leading-relaxed">{t("auth.why")}</h2>
          <div className="relative mt-8 flex flex-col gap-5">
            {PERKS.map((perk) => (
              <div key={perk.title} className="flex items-start gap-4 rounded-3xl bg-white/10 p-5 backdrop-blur">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                  <perk.icon size={20} className="text-gold" />
                </span>
                <div>
                  <h3 className="font-extrabold">{perk.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-rose-100/80">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
