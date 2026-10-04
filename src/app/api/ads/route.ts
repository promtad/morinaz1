import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { ads } from "@/db/schema";
import { categoryExists, fail, isResponse, ok, parseAdPayload, requireApiUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await requireApiUser();
  if (isResponse(user)) return user;

  const body = await req.json().catch(() => ({}));
  const data = parseAdPayload(body);
  if (typeof data === "string") return fail(data);
  if (!(await categoryExists(data.categoryId))) return fail("القسم المختار غير موجود");

  await db.insert(ads).values({
    title: data.title,
    description: data.description,
    price: data.price,
    oldPrice: data.oldPrice,
    productUrl: data.productUrl,
    categoryId: data.categoryId,
    userId: user.id,
    images: JSON.stringify(data.images),
  });

  revalidatePath("/", "layout");
  return ok({ target: "/dashboard", message: "تم نشر إعلانك بنجاح" });
}
