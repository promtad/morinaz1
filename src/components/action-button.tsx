"use client";

import { useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api-client";

export default function ActionButton({
  endpoint,
  method = "POST",
  children,
  className,
  confirm,
  title,
}: {
  endpoint: string;
  method?: "POST" | "DELETE" | "PATCH";
  children: ReactNode;
  className?: string;
  confirm?: string;
  title?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      title={title}
      disabled={pending}
      className={className}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        startTransition(async () => {
          await apiPost(endpoint, {}, method);
          router.refresh();
        });
      }}
    >
      {pending ? <Loader2 size={14} className="animate-spin" /> : children}
    </button>
  );
}
