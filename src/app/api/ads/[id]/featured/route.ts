import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { ads } from "@/db/schema";
import { fail, isResponse, ok, requireApiAdmin } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireApiAdmin();
  if (isResponse(admin)) return admin;

  const { id } = await params;
  const adId = Number(id);
  const rows = await db.select().from(ads).where(eq(ads.id, adId)).limit(1);
  const ad = rows[0];
  if (!ad) return fail("الإعلان غير موجود", 404);

  await db.update(ads).set({ featured: !ad.featured }).where(eq(ads.id, adId));
  revalidatePath("/", "layout");
  return ok({ message: ad.featured ? "أُزيل من المميزة" : "أصبح إعلاناً مميزاً" });
}
