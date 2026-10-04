"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Megaphone,
  MonitorSmartphone,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import LogoutButton from "./logout-button";
import { useT } from "@/lib/i18n-client";

export default function AdminShell({ userName }: { userName: string }) {
  const pathname = usePathname();
  const { locale, t } = useT();

  const LINKS = [
    { href: "/admin", labelKey: "ad.overview", en: "OVERVIEW", icon: LayoutDashboard, exact: true },
    { href: "/admin/categories", labelKey: "ad.sections", en: "SECTIONS", icon: FolderOpen },
    { href: "/admin/ads", labelKey: "ad.ads", en: "ADS", icon: Megaphone },
    { href: "/admin/slots", labelKey: "ad.slots", en: "PLACEMENTS", icon: MonitorSmartphone },
    { href: "/admin/users", labelKey: "ad.users", en: "MEMBERS", icon: Users },
    { href: "/admin/settings", labelKey: "ad.settings", en: "SEO", icon: Settings },
    { href: "/ads.txt", labelKey: "ad.adsTxt", en: "ADS.TXT", icon: FileText, external: true },
  ];

  const BackArrow = locale === "en" ? ArrowLeft : ArrowRight;

  return (
    <aside className="flex flex-col gap-1 rounded-[2rem] border border-rosewash bg-white p-4 shadow-card lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
      <div className="mb-3 flex items-center gap-3 rounded-2xl bg-gradient-to-l from-wine to-plum p-4 text-white">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <ShieldCheck size={20} className="text-gold" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold">{userName}</p>
          <p className="font-display text-[9px] tracking-[0.3em] text-rose-200">ADMIN PANEL</p>
        </div>
      </div>

      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;
        const cls = `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
          active
            ? "bg-gradient-to-l from-brand to-brand-deep text-white shadow-soft"
            : "text-plum hover:bg-blush hover:text-brand"
        }`;
        if (link.external) {
          return (
            <a key={link.href} href={link.href} target="_blank" rel="noopener" className={cls}>
              <Icon size={17} />
              <span className="flex-1">{t(link.labelKey)}</span>
              <span className="font-display text-[9px] tracking-[0.2em] opacity-60">{link.en}</span>
            </a>
          );
        }
        return (
          <Link key={link.href} href={link.href} className={cls}>
            <Icon size={17} />
            <span className="flex-1">{t(link.labelKey)}</span>
            <span className="font-display text-[9px] tracking-[0.2em] opacity-60">{link.en}</span>
          </Link>
        );
      })}

      <div className="mt-3 space-y-1 border-t border-blush pt-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-plum transition hover:bg-blush hover:text-brand"
        >
          <BackArrow size={17} />
          {t("ad.backSite")}
        </Link>
        <LogoutButton variant="full" />
      </div>
    </aside>
  );
}
