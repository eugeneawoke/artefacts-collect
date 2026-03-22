import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const artifacts = pgTable("artifacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: text("category").notNull(), // "epistemic" | "pragmatic" | "regulation"
  type: text("type").notNull(),
  description: text("description").notNull(),
  feeling: text("feeling").notNull(),
  lesson: text("lesson").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const todos = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  parentId: uuid("parent_id"),
  isCompleted: boolean("is_completed").default(false).notNull(),
  artifactId: uuid("artifact_id"),
  sortOrder: text("sort_order").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reminders = pgTable("reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
  time: text("time").notNull(), // "HH:MM"
  isActive: boolean("is_active").default(true).notNull(),
  todoId: uuid("todo_id"),
  todoTitle: text("todo_title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  endpoint: text("endpoint").notNull(),
  keysP256dh: text("keys_p256dh").notNull(),
  keysAuth: text("keys_auth").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
