import type { Metadata } from "next";
import SettingsForm from "@/components/settings-form";
import { requireAdmin } from "@/lib/auth";
import { getT } from "@/lib/i18n-server";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("set.meta") };
}

export default async function AdminSettingsPage() {
  await requireAdmin();
  const [{ t }, settings] = await Promise.all([getT(), getSettings()]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-display text-xs tracking-[0.4em] text-brand">SETTINGS & SEO</p>
        <h1 className="mt-2 text-3xl font-extrabold text-wine">{t("set.title")}</h1>
        <p className="mt-1 text-sm leading-7 text-mist">{t("set.sub")}</p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
