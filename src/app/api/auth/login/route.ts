import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { fail, ok } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

function safeNext(next: string): string {
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  return "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const next = safeNext(String(body.next ?? ""));

    if (!email || !password) return fail("أدخلي البريد الإلكتروني وكلمة المرور");

    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = rows[0];
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return fail("بيانات الدخول غير صحيحة");
    }

    await createSession(user.id);
    return ok({ target: next || (user.role === "admin" ? "/admin" : "/dashboard") });
  } catch (e) {
    console.error("login error:", e);
    return fail("حدث خطأ أثناء تسجيل الدخول", 500);
  }
}
