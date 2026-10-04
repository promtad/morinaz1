import type { MetadataRoute } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { ads, categories } from "@/db/schema";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/login`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/register`, changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const cats = await db.select().from(categories);
    const activeAds = await db
      .select({ id: ads.id, createdAt: ads.createdAt })
      .from(ads)
      .where(eq(ads.status, "active"))
      .orderBy(desc(ads.createdAt))
      .limit(1000);

    return [
      ...staticPages,
      ...cats.map((c) => ({
        url: `${SITE_URL}/category/${c.slug}`,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
      ...activeAds.map((a) => ({
        url: `${SITE_URL}/ads/${a.id}`,
        lastModified: a.createdAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticPages;
  }
}
