import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 140 }).notNull(),
  email: varchar("email", { length: 190 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("member"), // admin | member
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameAr: varchar("name_ar", { length: 140 }).notNull(),
  nameEn: varchar("name_en", { length: 140 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  description: text("description").notNull().default(""),
  icon: varchar("icon", { length: 60 }).notNull().default("sparkles"),
  image: text("image").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 190 }).notNull(),
  description: text("description").notNull().default(""),
  price: integer("price").notNull().default(0),
  oldPrice: integer("old_price"),
  productUrl: text("product_url").notNull().default(""),
  images: text("images").notNull().default("[]"), // JSON array of URLs / data-URLs
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  featured: boolean("featured").notNull().default(false),
  status: varchar("status", { length: 20 }).notNull().default("active"), // active | paused
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adSlots = pgTable("ad_slots", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  position: varchar("position", { length: 20 }).notNull(), // header | middle | sidebar | footer
  imageUrl: text("image_url").notNull().default(""),
  linkUrl: text("link_url").notNull().default(""),
  htmlCode: text("html_code").notNull().default(""),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  key: varchar("key", { length: 120 }).primaryKey(),
  value: text("value").notNull().default(""),
});

export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Ad = typeof ads.$inferSelect;
export type AdSlot = typeof adSlots.$inferSelect;
