import type { ReactNode } from "react";
import AdminShell from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="shell grid gap-8 py-10 lg:grid-cols-[290px_minmax(0,1fr)]">
      <AdminShell userName={user.name} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
