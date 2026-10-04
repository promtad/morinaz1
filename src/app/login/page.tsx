import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { KeyRound, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth-forms";
import { getCurrentUser } from "@/lib/auth";
import { getT } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("auth.metaLogin") };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(next?.startsWith("/") ? next : user.role === "admin" ? "/admin" : "/dashboard");

  const { t } = await getT();

  return (
    <div className="shell grid items-center gap-10 py-14 lg:grid-cols-2">
      {/* Form */}
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-soft">
            <KeyRound size={22} />
          </span>
          <p className="font-display text-xs tracking-[0.45em] text-brand">WELCOME BACK</p>
          <h1 className="mt-2 text-3xl font-extrabold text-wine">{t("auth.welcomeBack")}</h1>
          <p className="mt-2 text-sm text-mist">{t("auth.loginSub")}</p>
        </div>

        <div className="rounded-[2rem] border border-rosewash bg-white p-7 shadow-card">
          <LoginForm next={next?.startsWith("/") ? next : ""} />
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-gold/30 bg-gold/5 p-4 text-center text-[11px] leading-6 text-plum">
          <p className="font-extrabold text-gold">{t("auth.demo")}</p>
          <p dir="ltr" className="mt-1 font-mono">
            admin@lamsa.app / admin123456 — {t("auth.demoAdmin")}
            <br />
            sara@lamsa.app / user123456 — {t("auth.demoUser")}
          </p>
        </div>
      </div>

      {/* Visual */}
      <div className="relative hidden lg:block">
        <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-brand/20 to-gold/20 blur-2xl" />
        <div className="relative overflow-hidden rounded-[2.75rem] border-4 border-white shadow-soft">
          <img src="/images/hero.jpg" alt="LAMSA" className="aspect-[4/3.4] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-wine/70 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <Sparkles className="mb-3 text-gold" size={22} />
            <p className="text-xl font-extrabold leading-relaxed">{t("auth.quote")}</p>
            <p className="mt-1 font-display text-xs tracking-[0.4em] text-rose-200">LAMSA COMMUNITY</p>
          </div>
        </div>
      </div>
    </div>
  );
}
