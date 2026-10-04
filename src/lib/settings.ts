import { cache } from "react";
import { db } from "@/db";
import { settings } from "@/db/schema";

export const SETTING_KEYS = [
  "siteName",
  "siteTagline",
  "siteDescription",
  "siteKeywords",
  "currency",
  "contactEmail",
  "instagram",
  "twitter",
  "adsTxt",
] as const;

export type SettingsMap = Record<(typeof SETTING_KEYS)[number], string>;

export const defaultSettings: SettingsMap = {
  siteName: "لمسة | LAMSA",
  siteTagline: "سوق الإعلانات النسائي الأول",
  siteDescription:
    "لمسة — منصة الإعلانات النسائية الأولى: مكياج، أزياء، عناية بالبشرة، عطور، حقائب، مجوهرات وكل ما يخص المرأة العصرية بأفضل الأسعار والتخفيضات.",
  siteKeywords:
    "إعلانات نسائية, مكياج, أزياء نسائية, عناية بالبشرة, عطور, حقائب نسائية, مجوهرات, تخفيضات, تسوق نسائي",
  currency: "ر.س",
  contactEmail: "hello@lamsa.app",
  instagram: "https://instagram.com",
  twitter: "https://x.com",
  adsTxt: `# ads.txt — ${new Date().getFullYear()}
# أضف سجلات بائعي الإعلانات المعتمدين هنا / Add your authorized sellers here
# مثال / Example:
# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0`,
};

export const getSettings = cache(async (): Promise<SettingsMap> => {
  try {
    const rows = await db.select().from(settings);
    const map: SettingsMap = { ...defaultSettings };
    for (const row of rows) {
      if ((SETTING_KEYS as readonly string[]).includes(row.key)) {
        map[row.key as keyof SettingsMap] = row.value;
      }
    }
    return map;
  } catch {
    return { ...defaultSettings };
  }
});

export async function getSetting(key: keyof SettingsMap): Promise<string> {
  const all = await getSettings();
  return all[key];
}
