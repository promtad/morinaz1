import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { adSlots } from "@/db/schema";
import { fail, isResponse, ok, requireApiAdmin } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireApiAdmin();
  if (isResponse(admin)) return admin;

  const { id } = await params;
  const rows = await db.select().from(adSlots).where(eq(adSlots.id, Number(id))).limit(1);
  const slot = rows[0];
  if (!slot) return fail("المساحة غير موجودة / Not found", 404);

  await db.update(adSlots).set({ isActive: !slot.isActive }).where(eq(adSlots.id, slot.id));
  revalidatePath("/", "layout");
  return ok({ message: slot.isActive ? "تم إخفاء المساحة / Hidden" : "تم إظهار المساحة / Visible" });
}
