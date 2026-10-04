import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { fail, isResponse, ok, requireApiAdmin } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireApiAdmin();
  if (isResponse(admin)) return admin;

  const { id } = await params;
  const userId = Number(id);
  if (userId === admin.id) return fail("لا يمكنكِ حذف حسابك / You cannot delete your own account");

  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/", "layout");
  return ok({ message: "تم حذف العضوة / Member deleted" });
}
