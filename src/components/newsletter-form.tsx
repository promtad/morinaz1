"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { useT } from "@/lib/i18n-client";

export default function NewsletterForm() {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setDone(true);
      }}
      className="relative"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("footer.emailPh")}
        className="w-full rounded-full border border-white/15 bg-white/10 py-3 pe-28 ps-4 text-sm text-white outline-none transition placeholder:text-rose-200/50 focus:border-brand"
      />
      <button
        type="submit"
        className="absolute end-1.5 top-1/2 flex h-9 -translate-y-1/2 items-center gap-1.5 rounded-full bg-gradient-to-l from-brand to-brand-deep px-4 text-xs font-extrabold text-white transition hover:opacity-90"
      >
        {done ? <Check size={14} /> : <Send size={13} />}
        {done ? t("footer.subscribed") : t("footer.subscribe")}
      </button>
    </form>
  );
}
