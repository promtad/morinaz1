import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { fail, isResponse, ok, requireApiAdmin } from "@/lib/api-helpers";
import { slugify } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const admin = await requireApiAdmin();
  if (isResponse(admin)) return admin;

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = Number(body.id ?? 0);
  const nameAr = String(body.nameAr ?? "").trim();
  const nameEn = String(body.nameEn ?? "").trim();
  const description = String(body.description ?? "").trim();
  const icon = String(body.icon ?? "sparkles").trim();
  const image = String(body.image ?? "").trim();

  if (nameAr.length < 2) return fail("اسم القسم بالعربية مطلوب / Arabic name is required");
  if (nameEn.length < 2) return fail("اسم القسم بالإنجليزية مطلوب / English name is required");

  const slug = slugify(String(body.slug ?? "").trim() || nameEn);
  const clash = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  if (clash.length && clash[0].id !== id) return fail("الرابط المختصر مستخدم لقسم آخر / Slug already taken");

  if (id) {
    await db.update(categories).set({ nameAr, nameEn, slug, description, icon, image }).where(eq(categories.id, id));
  } else {
    await db.insert(categories).values({ nameAr, nameEn, slug, description, icon, image });
  }

  revalidatePath("/", "layout");
  return ok({ message: id ? "تم تحديث القسم بنجاح / Section updated" : "تمت إضافة القسم بنجاح / Section added" });
}
