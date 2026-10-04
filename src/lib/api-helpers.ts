import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@/db/schema";

export function ok(data: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: true, ...data });
}

export function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function requireApiUser(): Promise<User | NextResponse> {
  const user = await getCurrentUser();
  if (!user) return fail("يجب تسجيل الدخول أولاً", 401);
  return user;
}

export async function requireApiAdmin(): Promise<User | NextResponse> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return fail("غير مصرح — صلاحيات الأدمن مطلوبة", 403);
  return user;
}

export function isResponse(x: unknown): x is NextResponse {
  return x instanceof NextResponse;
}

// ── Ad payload validation shared by create/update ─────────────
export type AdPayload = {
  title: string;
  description: string;
  price: number;
  oldPrice: number | null;
  productUrl: string;
  categoryId: number;
  images: string[];
};

export function parseAdPayload(body: unknown): AdPayload | string {
  const b = (body ?? {}) as Record<string, unknown>;
  const title = String(b.title ?? "").trim();
  const description = String(b.description ?? "").trim();
  const price = Math.max(0, Math.round(Number(b.price ?? 0) || 0));
  const oldPriceRaw = b.oldPrice === null || b.oldPrice === undefined || b.oldPrice === "" ? null : Number(b.oldPrice);
  const oldPrice = oldPriceRaw === null ? null : Math.max(0, Math.round(oldPriceRaw || 0));
  const productUrl = String(b.productUrl ?? "").trim();
  const categoryId = Number(b.categoryId ?? 0);
  const images = Array.isArray(b.images)
    ? (b.images.filter((x) => typeof x === "string" && x.length > 0) as string[]).slice(0, 6)
    : [];

  if (title.length < 4) return "عنوان الإعلان يجب أن يكون 4 أحرف على الأقل";
  if (!categoryId) return "اختاري قسم الإعلان";
  if (price <= 0) return "أدخلي سعراً صحيحاً";
  if (oldPrice !== null && oldPrice <= price) return "السعر قبل التخفيض يجب أن يكون أكبر من السعر الحالي";
  if (productUrl && !/^https?:\/\/.+/.test(productUrl)) return "رابط المنتج يجب أن يبدأ بـ http:// أو https://";

  return { title, description, price, oldPrice, productUrl, categoryId, images };
}

export async function categoryExists(id: number): Promise<boolean> {
  const rows = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, id)).limit(1);
  return rows.length > 0;
}
