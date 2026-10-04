import Link from "next/link";
import { AtSign, Camera, Heart, Mail, Sparkles } from "lucide-react";
import { getT } from "@/lib/i18n-server";
import { getSettings } from "@/lib/settings";
import { getCategories } from "@/lib/queries";
import NewsletterForm from "./newsletter-form";

export default async function SiteFooter() {
  const [{ locale, t }, settings, categories] = await Promise.all([getT(), getSettings(), getCategories()]);
  const [arName, enName] = settings.siteName.split("|").map((s) => s.trim());
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden bg-wine text-rose-100">
      <div className="pointer-events-none absolute -top-32 start-1/3 h-72 w-72 rounded-full bg-brand/25 blur-3xl" />
      <div className="shell relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr]">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-soft">
              <Sparkles size={20} />
            </span>
            <span className="leading-none">
              <span className="block text-xl font-extrabold text-white">{arName || settings.siteName}</span>
              <span className="block font-display text-[10px] tracking-[0.45em] text-gold">
                {enName || "LAMSA"}
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-rose-200/70">{settings.siteDescription}</p>
          <div className="mt-5 flex gap-2">
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-rose-100 transition hover:bg-brand"
              aria-label="Instagram"
            >
              <Camera size={17} />
            </a>
            <a
              href={settings.twitter}
              target="_blank"
              rel="noopener"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-rose-100 transition hover:bg-brand"
              aria-label="X"
            >
              <AtSign size={17} />
            </a>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-rose-100 transition hover:bg-brand"
              aria-label="Email"
            >
              <Mail size={17} />
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="mb-4 text-sm font-extrabold text-white">
            {t("footer.sections")}
            <span className="ms-2 font-display text-[10px] tracking-[0.3em] text-gold">SECTIONS</span>
          </h4>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 7).map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="text-rose-200/70 transition hover:text-white">
                  {locale === "en" ? c.nameEn : c.nameAr}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="mb-4 text-sm font-extrabold text-white">
            {t("footer.links")}
            <span className="ms-2 font-display text-[10px] tracking-[0.3em] text-gold">LINKS</span>
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="text-rose-200/70 transition hover:text-white">{t("footer.home")}</Link></li>
            <li><Link href="/register" className="text-rose-200/70 transition hover:text-white">{t("footer.register")}</Link></li>
            <li><Link href="/login" className="text-rose-200/70 transition hover:text-white">{t("footer.login")}</Link></li>
            <li><Link href="/dashboard/new" className="text-rose-200/70 transition hover:text-white">{t("footer.postAd")}</Link></li>
            <li><Link href="/ads.txt" className="text-rose-200/70 transition hover:text-white">{t("footer.adsTxt")}</Link></li>
            <li><Link href="/sitemap.xml" className="text-rose-200/70 transition hover:text-white">{t("footer.sitemap")}</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="mb-4 text-sm font-extrabold text-white">
            {t("footer.newsletter")}
            <span className="ms-2 font-display text-[10px] tracking-[0.3em] text-gold">NEWSLETTER</span>
          </h4>
          <p className="mb-4 text-sm leading-7 text-rose-200/70">{t("footer.newsletterSub")}</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-3 py-5 text-center text-xs text-rose-200/60 sm:flex-row">
          <p>
            © {year} {settings.siteName} — {t("footer.rights")}
          </p>
          <p className="flex items-center gap-1">
            <Heart size={12} className="fill-brand text-brand" />
            {t("footer.madeFor")}
          </p>
        </div>
      </div>
    </footer>
  );
}
