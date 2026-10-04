import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { adSlots } from "@/db/schema";
import { isResponse, ok, requireApiAdmin } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireApiAdmin();
  if (isResponse(admin)) return admin;

  const { id } = await params;
  await db.delete(adSlots).where(eq(adSlots.id, Number(id)));
  revalidatePath("/", "layout");
  return ok({ message: "تم حذف المساحة / Placement deleted" });
}
