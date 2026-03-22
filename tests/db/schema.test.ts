import { describe, it, expect } from "vitest";
import { artifacts, todos, reminders, pushSubscriptions } from "@/db/schema";
import { getTableName } from "drizzle-orm";

describe("Database Schema", () => {
  it("exports artifacts table with correct name", () => {
    expect(getTableName(artifacts)).toBe("artifacts");
  });

  it("exports todos table with correct name", () => {
    expect(getTableName(todos)).toBe("todos");
  });

  it("exports reminders table with correct name", () => {
    expect(getTableName(reminders)).toBe("reminders");
  });

  it("exports push_subscriptions table with correct name", () => {
    expect(getTableName(pushSubscriptions)).toBe("push_subscriptions");
  });

  it("artifacts has required columns", () => {
    const cols = Object.keys(artifacts);
    expect(cols).toContain("id");
    expect(cols).toContain("category");
    expect(cols).toContain("type");
    expect(cols).toContain("description");
    expect(cols).toContain("feeling");
    expect(cols).toContain("lesson");
    expect(cols).toContain("createdAt");
  });

  it("todos has required columns", () => {
    const cols = Object.keys(todos);
    expect(cols).toContain("id");
    expect(cols).toContain("title");
    expect(cols).toContain("parentId");
    expect(cols).toContain("isCompleted");
    expect(cols).toContain("artifactId");
    expect(cols).toContain("sortOrder");
  });

  it("reminders has required columns", () => {
    const cols = Object.keys(reminders);
    expect(cols).toContain("id");
    expect(cols).toContain("time");
    expect(cols).toContain("isActive");
    expect(cols).toContain("todoId");
    expect(cols).toContain("todoTitle");
  });

  it("pushSubscriptions has required columns", () => {
    const cols = Object.keys(pushSubscriptions);
    expect(cols).toContain("id");
    expect(cols).toContain("endpoint");
    expect(cols).toContain("keysP256dh");
    expect(cols).toContain("keysAuth");
  });
});
