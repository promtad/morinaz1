import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { fail, ok } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const nextRaw = String(body.next ?? "");
    const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "";

    if (name.length < 2) return fail("فضلاً أدخلي الاسم الكامل");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("البريد الإلكتروني غير صالح");
    if (password.length < 8) return fail("كلمة المرور يجب أن تكون 8 أحرف على الأقل");

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length) return fail("هذا البريد مسجل مسبقاً — جرّبي تسجيل الدخول");

    const inserted = await db
      .insert(users)
      .values({ name, email, passwordHash: hashPassword(password), role: "member" })
      .returning({ id: users.id });

    await createSession(inserted[0].id);
    return ok({ target: next || "/dashboard" });
  } catch (e) {
    console.error("register error:", e);
    return fail("حدث خطأ أثناء إنشاء الحساب", 500);
  }
}
