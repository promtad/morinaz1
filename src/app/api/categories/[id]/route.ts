import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { isResponse, ok, requireApiAdmin } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireApiAdmin();
  if (isResponse(admin)) return admin;

  const { id } = await params;
  await db.delete(categories).where(eq(categories.id, Number(id)));
  revalidatePath("/", "layout");
  return ok({ message: "تم حذف القسم / Section deleted" });
}
