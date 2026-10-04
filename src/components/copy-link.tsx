"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { useT } from "@/lib/i18n-client";

export default function CopyLink() {
  const { t } = useT();
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // ignore
        }
      }}
      className="btn-ghost !px-4 !py-2.5 text-sm"
    >
      {copied ? <Check size={15} className="text-green-600" /> : <Share2 size={15} />}
      {copied ? t("ad.copied") : t("ad.share")}
    </button>
  );
}
