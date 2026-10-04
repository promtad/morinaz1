import Link from "next/link";
import { Compass } from "lucide-react";
import { getT } from "@/lib/i18n-server";

export default async function NotFound() {
  const { t } = await getT();

  return (
    <div className="shell flex min-h-[55vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-8xl tracking-[0.2em] text-gradient">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-wine">{t("nf.title")}</h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-mist">{t("nf.sub")}</p>
      <Link href="/" className="btn-primary mt-8">
        <Compass size={17} />
        {t("nf.home")}
      </Link>
    </div>
  );
}
