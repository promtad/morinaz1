"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useT } from "@/lib/i18n-client";

export default function SearchBar({
  className = "",
  compact = false,
  initial = "",
}: {
  className?: string;
  compact?: boolean;
  initial?: string;
}) {
  const router = useRouter();
  const { t } = useT();
  const [q, setQ] = useState(initial);

  return (
    <form
      className={`relative ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      }}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("nav.searchPh")}
        className={`w-full rounded-full border-[1.5px] border-rosewash bg-white pe-11 text-sm text-wine outline-none transition placeholder:text-mist/70 focus:border-brand focus:shadow-[0_0_0_4px_rgba(194,24,91,0.12)] ${
          compact ? "py-2.5 ps-4" : "py-3.5 ps-5"
        }`}
      />
      <button
        type="submit"
        aria-label={t("nav.search")}
        className="absolute end-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-white transition hover:scale-105"
      >
        <Search size={15} />
      </button>
    </form>
  );
}
