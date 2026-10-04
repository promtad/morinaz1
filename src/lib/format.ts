export function formatPrice(value: number): string {
  return value.toLocaleString("en-US");
}

export function discountPercent(price: number, oldPrice: number | null): number {
  if (!oldPrice || oldPrice <= price || price < 0) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

export function parseImages(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === "string" && x.length > 0);
    }
  } catch {
    // ignore
  }
  return [];
}

export function timeAgo(date: Date, locale: "ar" | "en" = "ar"): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (locale === "en") {
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return days === 1 ? "yesterday" : `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`;
    const years = Math.floor(months / 12);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
  if (seconds < 60) return "الآن";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days < 30) return days === 1 ? "منذ يوم" : days === 2 ? "منذ يومين" : `منذ ${days} أيام`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? "منذ شهر" : `منذ ${months} أشهر`;
  const years = Math.floor(months / 12);
  return years === 1 ? "منذ سنة" : `منذ ${years} سنوات`;
}

export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || `section-${Math.floor(Math.random() * 100000)}`;
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}
