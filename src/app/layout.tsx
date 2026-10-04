import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Italiana, Tajawal } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import AdBanner from "@/components/ad-banner";
import { getLocale } from "@/lib/i18n-server";
import { getSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/auth";
import { getCategories } from "@/lib/queries";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
});

const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italiana",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${s.siteName} — ${s.siteTagline}`,
      template: `%s | ${s.siteName}`,
    },
    description: s.siteDescription,
    keywords: s.siteKeywords
      .split("،")
      .flatMap((part) => part.split(","))
      .map((k) => k.trim())
      .filter(Boolean),
    openGraph: {
      title: `${s.siteName} — ${s.siteTagline}`,
      description: s.siteDescription,
      type: "website",
      locale: "ar_AR",
      siteName: s.siteName,
      images: ["/images/hero.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [locale, settings, user, categories] = await Promise.all([
    getLocale(),
    getSettings(),
    getCurrentUser(),
    getCategories(),
  ]);

  return (
    <html lang={locale} dir={locale === "en" ? "ltr" : "rtl"}>
      <body className={`${tajawal.variable} ${italiana.variable} font-sans antialiased`}>
        <SiteHeader
          user={user ? { name: user.name, role: user.role } : null}
          siteName={settings.siteName}
          categories={categories.map((c) => ({ nameAr: c.nameAr, nameEn: c.nameEn, slug: c.slug }))}
        />
        <div className="pt-5">
          <AdBanner position="header" />
        </div>
        <main className="min-h-[60vh]">{children}</main>
        <div className="mt-4">
          <AdBanner position="footer" />
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
