"use client";

import { useState } from "react";
import { subscribeToPush } from "@/lib/push";

type PushState = "idle" | "requesting" | "subscribed" | "denied" | "unsupported";

export function usePush() {
  const [state, setState] = useState<PushState>(() => {
    if (typeof window === "undefined") return "idle";
    if (!("serviceWorker" in navigator) || !("PushManager" in window))
      return "unsupported";
    if (Notification.permission === "granted") return "subscribed";
    if (Notification.permission === "denied") return "denied";
    return "idle";
  });

  async function enable() {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return;

    setState("requesting");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setState("denied");
      return;
    }

    const sub = await subscribeToPush(vapidKey);
    if (!sub) {
      setState("unsupported");
      return;
    }

    const subJson = sub.toJSON() as {
      endpoint: string;
      keys: { p256dh: string; auth: string };
    };

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint: subJson.endpoint,
        keysP256dh: subJson.keys.p256dh,
        keysAuth: subJson.keys.auth,
      }),
    });

    setState("subscribed");
  }

  return { state, enable };
}
