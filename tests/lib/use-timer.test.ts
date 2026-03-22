import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTimer } from "@/lib/hooks/use-timer";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useTimer", () => {
  it("initializes with correct timeLeft", () => {
    const { result } = renderHook(() => useTimer(5));
    expect(result.current.timeLeft).toBe(5 * 60);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isComplete).toBe(false);
  });

  it("starts counting down after start()", () => {
    const { result } = renderHook(() => useTimer(5));
    act(() => {
      result.current.start();
    });
    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.timeLeft).toBe(5 * 60 - 3);
  });

  it("pauses when pause() is called", () => {
    const { result } = renderHook(() => useTimer(5));
    act(() => {
      result.current.start();
      vi.advanceTimersByTime(2000);
      result.current.pause();
    });
    const timeBefore = result.current.timeLeft;
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.timeLeft).toBe(timeBefore);
    expect(result.current.isRunning).toBe(false);
  });

  it("resumes after pause", () => {
    const { result } = renderHook(() => useTimer(5));
    act(() => {
      result.current.start();
      vi.advanceTimersByTime(2000);
      result.current.pause();
      result.current.resume();
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.timeLeft).toBe(5 * 60 - 4);
  });

  it("marks complete when timer reaches zero", () => {
    const { result } = renderHook(() => useTimer(1));
    act(() => {
      result.current.start();
      vi.advanceTimersByTime(60 * 1000 + 100);
    });
    expect(result.current.isComplete).toBe(true);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.timeLeft).toBe(0);
  });
});
