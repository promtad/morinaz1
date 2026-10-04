"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgePercent, Gem, LayoutGrid, ShieldCheck, Sparkles, Users } from "lucide-react";
import SearchBar from "./search-bar";
import { useT } from "@/lib/i18n-client";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Hero({
  stats,
}: {
  stats: { ads: number; users: number; categories: number };
}) {
  const { t } = useT();

  return (
    <section className="relative overflow-hidden">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blush via-cream to-cream" />
      <div className="pointer-events-none absolute inset-0 pattern-dots opacity-60" />
      <div className="pointer-events-none absolute -top-24 -start-24 h-96 w-96 rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -end-32 h-[28rem] w-[28rem] rounded-full bg-gold/15 blur-3xl" />

      <div className="shell relative grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-16">
        {/* Copy */}
        <motion.div variants={container} initial="hidden" animate="show" className="text-center lg:text-start">
          <motion.div
            variants={item}
            className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-rosewash bg-white/80 px-4 py-1.5 text-xs font-bold text-brand shadow-sm lg:mx-0"
          >
            <Sparkles size={13} />
            <span>{t("hero.badge")}</span>
            <span className="font-display tracking-[0.25em]">WOMEN FIRST</span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl font-extrabold leading-[1.25] text-wine sm:text-5xl lg:text-[3.4rem]"
          >
            {t("hero.titleA")}
            <br />
            <span className="text-gradient">{t("hero.titleB")}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-xl text-base leading-8 text-mist lg:mx-0"
          >
            {t("hero.sub")}
          </motion.p>

          <motion.div variants={item} className="mt-7">
            <SearchBar className="mx-auto max-w-xl lg:mx-0" />
          </motion.div>

          <motion.div variants={item} className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link href="/#categories" className="btn-primary">
              <LayoutGrid size={17} />
              {t("hero.browse")}
            </Link>
            <Link href="/dashboard/new" className="btn-ghost">
              <Sparkles size={16} className="text-brand" />
              {t("hero.post")}
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-center lg:mx-0"
          >
            <Stat icon={<Gem size={18} />} value={`+${stats.ads}`} label={t("hero.statAds")} />
            <Stat icon={<Users size={18} />} value={`+${stats.users}`} label={t("hero.statUsers")} />
            <Stat icon={<BadgePercent size={18} />} value={`${stats.categories}`} label={t("hero.statCats")} />
          </motion.div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-brand/25 via-transparent to-gold/25 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.75rem] border-4 border-white shadow-soft">
            <img
              src="/images/hero.jpg"
              alt={t("hero.alt")}
              className="aspect-[5/4] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wine/30 via-transparent to-transparent" />
          </div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -start-4 top-8 rounded-3xl border border-rosewash bg-white/95 p-4 shadow-soft backdrop-blur sm:-start-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-white">
                <BadgePercent size={20} />
              </span>
              <div>
                <p className="text-sm font-extrabold text-wine">{t("hero.float1a")}</p>
                <p className="text-[11px] text-mist">{t("hero.float1b")}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute -end-3 bottom-10 rounded-3xl border border-rosewash bg-white/95 p-4 shadow-soft backdrop-blur sm:-end-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-brand-deep text-white">
                <ShieldCheck size={20} />
              </span>
              <div>
                <p className="text-sm font-extrabold text-wine">{t("hero.float2a")}</p>
                <p className="text-[11px] text-mist">{t("hero.float2b")}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-rosewash bg-white/80 px-3 py-4 shadow-sm backdrop-blur">
      <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blush text-brand">
        {icon}
      </span>
      <p className="text-lg font-extrabold text-wine">{value}</p>
      <p className="text-[11px] font-bold text-mist">{label}</p>
    </div>
  );
}
