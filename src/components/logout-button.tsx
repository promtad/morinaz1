"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { useT } from "@/lib/i18n-client";

export default function LogoutButton({
  variant = "icon",
  className,
  label,
}: {
  variant?: "icon" | "full";
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const { t } = useT();
  const [pending, startTransition] = useTransition();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    startTransition(() => {
      router.push("/");
      router.refresh();
    });
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={logout}
        disabled={pending}
        className={className ?? "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"}
      >
        {pending ? <Loader2 size={17} className="animate-spin" /> : <LogOut size={17} />}
        {label ?? t("ad.logout")}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      title={label ?? t("nav.logout")}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-rosewash bg-white text-mist transition hover:border-brand hover:text-brand"
    >
      {pending ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />}
    </button>
  );
}
