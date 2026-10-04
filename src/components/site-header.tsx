"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Crown,
  LayoutDashboard,
  LogIn,
  Menu,
  Plus,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import LanguageSwitch from "./language-switch";
import LogoutButton from "./logout-button";
import SearchBar from "./search-bar";
import { useT } from "@/lib/i18n-client";

type HeaderCategory = { nameAr: string; nameEn: string; slug: string };

export default function SiteHeader({
  user,
  siteName,
  categories,
}: {
  user: { name: string; role: string } | null;
  siteName: string;
  categories: HeaderCategory[];
}) {
  const pathname = usePathname();
  const { locale, t } = useT();
  const [open, setOpen] = useState(false);
  const [arName, enName] = siteName.split("|").map((s) => s.trim());

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const catName = (c: HeaderCategory) => (locale === "en" ? c.nameEn : c.nameAr);

  return (
    <header className="sticky top-0 z-50 border-b border-rosewash/70 glass">
      <div className="shell flex h-[4.25rem] items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-soft">
            <Sparkles size={19} />
          </span>
          <span className="leading-none">
            <span className="block text-lg font-extrabold text-wine">{arName || siteName}</span>
            <span className="block font-display text-[10px] tracking-[0.45em] text-brand">
              {enName || "LAMSA"}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink href="/" active={isActive("/")}>
            {t("nav.home")}
          </NavLink>
          <div className="group relative">
            <button
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold transition ${
                pathname.startsWith("/category") ? "text-brand" : "text-plum hover:text-brand"
              }`}
            >
              {t("nav.sections")}
              <ChevronDown size={14} className="transition group-hover:rotate-180" />
            </button>
            <div className="invisible absolute start-0 top-full z-50 w-56 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="overflow-hidden rounded-2xl border border-rosewash bg-white p-2 shadow-soft">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="block rounded-xl px-4 py-2.5 text-sm font-bold text-plum transition hover:bg-blush hover:text-brand"
                  >
                    {catName(c)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <NavLink href="/#latest" active={false}>
            {t("nav.latest")}
          </NavLink>
          <NavLink href="/#deals" active={false}>
            {t("nav.deals")}
          </NavLink>
        </nav>

        {/* Desktop search */}
        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <SearchBar compact className="w-full max-w-md" />
        </div>

        <div className="ms-auto flex shrink-0 items-center gap-2 md:ms-0">
          <div className="hidden sm:block">
            <LanguageSwitch compact />
          </div>
          {user ? (
            <>
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                className="hidden items-center gap-1.5 rounded-full border border-rosewash bg-white px-4 py-2 text-sm font-bold text-plum transition hover:border-brand hover:text-brand sm:flex"
              >
                {user.role === "admin" ? <ShieldCheck size={15} /> : <LayoutDashboard size={15} />}
                <span className="max-w-28 truncate">{user.name}</span>
              </Link>
              <div className="hidden sm:block">
                <LogoutButton />
              </div>
              <Link href="/dashboard/new" className="btn-primary hidden !px-5 !py-2.5 md:inline-flex">
                <Plus size={16} />
                {t("nav.addAd")}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-plum transition hover:text-brand sm:flex"
              >
                <LogIn size={15} />
                {t("nav.login")}
              </Link>
              <Link href="/register" className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
                <Crown size={15} />
                {t("nav.register")}
              </Link>
            </>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-rosewash bg-white text-plum lg:hidden"
            aria-label={t("nav.menu")}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-rosewash/70 lg:hidden"
          >
            <div className="shell flex flex-col gap-1 py-4">
              <SearchBar className="mb-2 w-full" />
              <div className="mb-2">
                <LanguageSwitch />
              </div>
              <MobileLink href="/" onClick={() => setOpen(false)}>
                {t("nav.home")}
              </MobileLink>
              <p className="mt-2 px-3 text-[10px] font-extrabold tracking-widest text-mist">
                {t("nav.sections")} — SECTIONS
              </p>
              <div className="grid grid-cols-2 gap-1">
                {categories.map((c) => (
                  <MobileLink key={c.slug} href={`/category/${c.slug}`} onClick={() => setOpen(false)}>
                    {catName(c)}
                  </MobileLink>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                {user ? (
                  <>
                    <Link
                      href={user.role === "admin" ? "/admin" : "/dashboard"}
                      onClick={() => setOpen(false)}
                      className="btn-ghost flex-1 !py-2.5 text-sm"
                    >
                      {t("nav.myPanel")}
                    </Link>
                    <Link
                      href="/dashboard/new"
                      onClick={() => setOpen(false)}
                      className="btn-primary flex-1 !py-2.5 text-sm"
                    >
                      {t("nav.addAd")}
                    </Link>
                    <LogoutButton label={t("nav.logout")} />
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost flex-1 !py-2.5 text-sm">
                      {t("nav.login")}
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)} className="btn-primary flex-1 !py-2.5 text-sm">
                      {t("nav.register")}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
        active ? "text-brand" : "text-plum hover:text-brand"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-xl px-3 py-2.5 text-sm font-bold text-plum transition hover:bg-blush hover:text-brand"
    >
      {children}
    </Link>
  );
}
