import { cache } from "react";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { ads, adSlots, categories, users } from "@/db/schema";

export const getCategories = cache(async () => {
  try {
    return await db.select().from(categories).orderBy(asc(categories.id));
  } catch {
    return [];
  }
});

export const getCategoriesWithCounts = cache(async () => {
  try {
    return await db
      .select({ category: categories, adsCount: count(ads.id) })
      .from(categories)
      .leftJoin(ads, and(eq(ads.categoryId, categories.id), eq(ads.status, "active")))
      .groupBy(categories.id)
      .orderBy(asc(categories.id));
  } catch {
    return [];
  }
});

export const getCategoryBySlug = cache(async (slug: string) => {
  const rows = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return rows[0] ?? null;
});

export const getSlots = cache(async (position: string) => {
  try {
    return await db
      .select()
      .from(adSlots)
      .where(and(eq(adSlots.position, position), eq(adSlots.isActive, true)))
      .orderBy(asc(adSlots.id));
  } catch {
    return [];
  }
});

export type AdWithCategory = {
  ad: typeof ads.$inferSelect;
  category: typeof categories.$inferSelect;
};

export const getFeaturedAds = cache(async (limit = 8): Promise<AdWithCategory[]> => {
  try {
    return await db
      .select({ ad: ads, category: categories })
      .from(ads)
      .innerJoin(categories, eq(categories.id, ads.categoryId))
      .where(and(eq(ads.status, "active"), eq(ads.featured, true)))
      .orderBy(desc(ads.createdAt))
      .limit(limit);
  } catch {
    return [];
  }
});

export const getLatestAds = cache(async (limit = 12): Promise<AdWithCategory[]> => {
  try {
    return await db
      .select({ ad: ads, category: categories })
      .from(ads)
      .innerJoin(categories, eq(categories.id, ads.categoryId))
      .where(eq(ads.status, "active"))
      .orderBy(desc(ads.createdAt))
      .limit(limit);
  } catch {
    return [];
  }
});

export type AdsSort = "new" | "cheap" | "expensive" | "popular";

export async function getAdsByCategory(
  categoryId: number,
  sort: AdsSort = "new"
): Promise<AdWithCategory[]> {
  const order =
    sort === "cheap"
      ? asc(ads.price)
      : sort === "expensive"
        ? desc(ads.price)
        : sort === "popular"
          ? desc(ads.views)
          : desc(ads.createdAt);
  return db
    .select({ ad: ads, category: categories })
    .from(ads)
    .innerJoin(categories, eq(categories.id, ads.categoryId))
    .where(and(eq(ads.categoryId, categoryId), eq(ads.status, "active")))
    .orderBy(order);
}

export async function searchAds(q: string): Promise<AdWithCategory[]> {
  const like = `%${q}%`;
  return db
    .select({ ad: ads, category: categories })
    .from(ads)
    .innerJoin(categories, eq(categories.id, ads.categoryId))
    .where(
      and(
        eq(ads.status, "active"),
        or(ilike(ads.title, like), ilike(ads.description, like), ilike(categories.nameAr, like))
      )
    )
    .orderBy(desc(ads.createdAt))
    .limit(60);
}

export const getAdById = cache(async (id: number) => {
  const rows = await db
    .select({ ad: ads, category: categories, sellerName: users.name, sellerId: users.id })
    .from(ads)
    .innerJoin(categories, eq(categories.id, ads.categoryId))
    .innerJoin(users, eq(users.id, ads.userId))
    .where(eq(ads.id, id))
    .limit(1);
  return rows[0] ?? null;
});

export async function getRelatedAds(categoryId: number, excludeId: number): Promise<AdWithCategory[]> {
  return db
    .select({ ad: ads, category: categories })
    .from(ads)
    .innerJoin(categories, eq(categories.id, ads.categoryId))
    .where(and(eq(ads.categoryId, categoryId), eq(ads.status, "active"), sql`${ads.id} != ${excludeId}`))
    .orderBy(desc(ads.views))
    .limit(4);
}

export const getSiteStats = cache(async () => {
  try {
    const [a] = await db.select({ value: count() }).from(ads);
    const [u] = await db.select({ value: count() }).from(users);
    const [c] = await db.select({ value: count() }).from(categories);
    const [v] = await db.select({ value: sql<number>`coalesce(sum(${ads.views}),0)` }).from(ads);
    return {
      ads: a?.value ?? 0,
      users: u?.value ?? 0,
      categories: c?.value ?? 0,
      views: Number(v?.value ?? 0),
    };
  } catch {
    return { ads: 0, users: 0, categories: 0, views: 0 };
  }
});
