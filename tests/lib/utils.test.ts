import { describe, it, expect } from "vitest";
import { generateId, formatDate, formatDuration } from "@/lib/utils";

describe("generateId", () => {
  it("returns a non-empty string", () => {
    expect(typeof generateId()).toBe("string");
    expect(generateId().length).toBeGreaterThan(0);
  });

  it("returns unique values", () => {
    expect(generateId()).not.toBe(generateId());
  });
});

describe("formatDate", () => {
  it("formats a date to Russian locale string", () => {
    const date = new Date("2024-01-15T12:00:00Z");
    const result = formatDate(date);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("accepts date string", () => {
    const result = formatDate("2024-01-15T12:00:00Z");
    expect(typeof result).toBe("string");
  });
});

describe("formatDuration", () => {
  it("formats minutes as string with suffix", () => {
    expect(formatDuration(5)).toBe("5 мин");
    expect(formatDuration(10)).toBe("10 мин");
    expect(formatDuration(25)).toBe("25 мин");
  });
});
