"use client";

import { createContext, useContext, useEffect, useState } from "react";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

type Permission = NotificationPermission | "unsupported";

interface PushCtx {
  permission: Permission;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<void>;
}

const Ctx = createContext<PushCtx>({
  permission: "default",
  subscribe: async () => false,
  unsubscribe: async () => {},
});

export function usePush() {
  return useContext(Ctx);
}

export function PushProvider({ children }: { children: React.ReactNode }) {
  const [permission, setPermission] = useState<Permission>("default");

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  async function subscribe(): Promise<boolean> {
    if (!("Notification" in window) || !("PushManager" in window)) return false;
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm !== "granted") return false;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ""
        ),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      return true;
    } catch {
      return false;
    }
  }

  async function unsubscribe() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) return;
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
      await sub.unsubscribe();
    } catch {}
  }

  return <Ctx.Provider value={{ permission, subscribe, unsubscribe }}>{children}</Ctx.Provider>;
}
