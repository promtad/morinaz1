import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { ads } from "@/db/schema";
import { categoryExists, fail, isResponse, ok, parseAdPayload, requireApiUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function loadOwnedAd(ctx: Ctx, userId: number, isAdmin: boolean) {
  const { id } = await ctx.params;
  const adId = Number(id);
  if (!Number.isFinite(adId)) return { error: fail("معرّف غير صالح") };
  const rows = await db.select().from(ads).where(eq(ads.id, adId)).limit(1);
  const ad = rows[0];
  if (!ad) return { error: fail("الإعلان غير موجود", 404) };
  if (ad.userId !== userId && !isAdmin) return { error: fail("لا تملكين صلاحية هذا الإعلان", 403) };
  return { ad };
}

export async function PATCH(req: Request, ctx: Ctx) {
  const user = await requireApiUser();
  if (isResponse(user)) return user;

  const { ad, error } = await loadOwnedAd(ctx, user.id, user.role === "admin");
  if (error || !ad) return error!;

  const body = await req.json().catch(() => ({}));
  const data = parseAdPayload(body);
  if (typeof data === "string") return fail(data);
  if (!(await categoryExists(data.categoryId))) return fail("القسم المختار غير موجود");

  await db
    .update(ads)
    .set({
      title: data.title,
      description: data.description,
      price: data.price,
      oldPrice: data.oldPrice,
      productUrl: data.productUrl,
      categoryId: data.categoryId,
      images: JSON.stringify(data.images),
    })
    .where(eq(ads.id, ad.id));

  revalidatePath("/", "layout");
  return ok({ target: user.role === "admin" ? "/admin/ads" : "/dashboard", message: "تم حفظ التعديلات" });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const user = await requireApiUser();
  if (isResponse(user)) return user;

  const { ad, error } = await loadOwnedAd(ctx, user.id, user.role === "admin");
  if (error || !ad) return error!;

  await db.delete(ads).where(eq(ads.id, ad.id));
  revalidatePath("/", "layout");
  return ok({ message: "تم حذف الإعلان" });
}
