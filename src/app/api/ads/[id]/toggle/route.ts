import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { ads } from "@/db/schema";
import { fail, isResponse, ok, requireApiUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser();
  if (isResponse(user)) return user;

  const { id } = await params;
  const adId = Number(id);
  const rows = await db.select().from(ads).where(eq(ads.id, adId)).limit(1);
  const ad = rows[0];
  if (!ad) return fail("الإعلان غير موجود", 404);
  if (ad.userId !== user.id && user.role !== "admin") return fail("غير مصرح", 403);

  const next = ad.status === "active" ? "paused" : "active";
  await db.update(ads).set({ status: next }).where(eq(ads.id, adId));
  revalidatePath("/", "layout");
  return ok({ message: next === "active" ? "تم تفعيل الإعلان" : "تم إيقاف الإعلان مؤقتاً" });
}
