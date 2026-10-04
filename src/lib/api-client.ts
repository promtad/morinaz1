"use client";

export type ApiResult = { ok: boolean; error?: string; message?: string; target?: string };

export async function apiPost(url: string, data: unknown = {}, method = "POST"): Promise<ApiResult> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = (await res.json().catch(() => ({}))) as ApiResult;
    if (!res.ok && json.error) return { ok: false, error: json.error };
    if (!res.ok) return { ok: false, error: "حدث خطأ غير متوقع — حاولي مرة أخرى" };
    return { ...json, ok: true };
  } catch {
    return { ok: false, error: "تعذر الاتصال بالخادم — تحققي من الشبكة" };
  }
}
