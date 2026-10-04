import { Sparkle } from "lucide-react";

const WORDS = [
  "MAKEUP",
  "FASHION",
  "SKINCARE",
  "PERFUMES",
  "HANDBAGS",
  "JEWELRY",
  "SHOES",
  "HAIRCARE",
  "NEW DEALS",
  "BEAUTY",
];

export default function Marquee() {
  const loop = [...WORDS, ...WORDS];
  return (
    <div dir="ltr" className="overflow-hidden border-y border-wine/10 bg-wine py-3.5">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {loop.map((word, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-sm tracking-[0.4em] text-rose-200/90"
          >
            {word}
            <Sparkle size={12} className="text-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}
