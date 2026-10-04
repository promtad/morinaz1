import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { fail, isResponse, ok, requireApiAdmin } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireApiAdmin();
  if (isResponse(admin)) return admin;

  const { id } = await params;
  const userId = Number(id);
  if (userId === admin.id) return fail("لا يمكنكِ تغيير دورك / You cannot change your own role");

  const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const target = rows[0];
  if (!target) return fail("العضوة غير موجودة / Not found", 404);

  const next = target.role === "admin" ? "member" : "admin";
  await db.update(users).set({ role: next }).where(eq(users.id, userId));
  revalidatePath("/", "layout");
  return ok({ message: "تم تحديث الصلاحية / Role updated" });
}
