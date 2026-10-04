import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { isResponse, ok, requireApiAdmin } from "@/lib/api-helpers";
import { SETTING_KEYS } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const admin = await requireApiAdmin();
  if (isResponse(admin)) return admin;

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  for (const key of SETTING_KEYS) {
    const value = String(body[key] ?? "");
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });
  }

  revalidatePath("/", "layout");
  return ok({ message: "saved" });
}
