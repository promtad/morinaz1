import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { adSlots } from "@/db/schema";
import { fail, isResponse, ok, requireApiAdmin } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const POSITIONS = ["header", "middle", "sidebar", "footer"] as const;

export async function POST(req: Request) {
  const admin = await requireApiAdmin();
  if (isResponse(admin)) return admin;

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = Number(body.id ?? 0);
  const name = String(body.name ?? "").trim();
  const position = String(body.position ?? "");
  const imageUrl = String(body.imageUrl ?? "").trim();
  const linkUrl = String(body.linkUrl ?? "").trim();
  const htmlCode = String(body.htmlCode ?? "");

  if (name.length < 2) return fail("اسم المساحة الإعلانية مطلوب / Placement name is required");
  if (!(POSITIONS as readonly string[]).includes(position)) return fail("موضع غير صالح / Invalid position");
  if (!imageUrl && !htmlCode.trim()) return fail("أضيفي صورة للإعلان أو كود HTML / Add an image or HTML code");

  if (id) {
    await db.update(adSlots).set({ name, position, imageUrl, linkUrl, htmlCode }).where(eq(adSlots.id, id));
  } else {
    await db.insert(adSlots).values({ name, position, imageUrl, linkUrl, htmlCode });
  }

  revalidatePath("/", "layout");
  return ok({ message: "تم حفظ المساحة الإعلانية بنجاح / Placement saved" });
}
