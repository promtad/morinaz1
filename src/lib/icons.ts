import {
  Crown,
  Droplets,
  Flower2,
  Footprints,
  Gem,
  Gift,
  Heart,
  Palette,
  Scissors,
  Shirt,
  ShoppingBag,
  Sparkles,
  SprayCan,
  Star,
  type LucideIcon,
} from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  palette: Palette,
  shirt: Shirt,
  droplets: Droplets,
  "spray-can": SprayCan,
  "shopping-bag": ShoppingBag,
  footprints: Footprints,
  gem: Gem,
  scissors: Scissors,
  flower: Flower2,
  crown: Crown,
  heart: Heart,
  gift: Gift,
  star: Star,
};

export const iconOptions = Object.keys(categoryIcons);

export function getCategoryIcon(key: string): LucideIcon {
  return categoryIcons[key] ?? Sparkles;
}
