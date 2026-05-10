"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

function applyDark(v: boolean) {
  localStorage.setItem("dark-mode", String(v));
  document.documentElement.setAttribute("data-dark", v ? "true" : "false");
  window.dispatchEvent(new Event("dark-mode-change"));
}

function applyLang(l: string) {
  localStorage.setItem("language", l);
  window.dispatchEvent(new Event("lang-change"));
}

export default function RealtimePrefsSync() {
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let cleanup: (() => void) | undefined;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      // Load initial prefs from DB (source of truth for new devices)
      fetch("/api/preferences")
        .then(r => r.ok ? r.json() : null)
        .then(prefs => {
          if (!prefs) return;
          if (prefs.dark_mode !== undefined && prefs.dark_mode !== null) applyDark(prefs.dark_mode);
          if (prefs.language) applyLang(prefs.language);
        })
        .catch(() => {});

      // Subscribe to real-time profile changes (other devices saving prefs)
      const channel = supabase
        .channel(`prefs:${user.id}`)
        .on(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          "postgres_changes" as any,
          { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
          (payload: { new: Record<string, unknown> }) => {
            const { dark_mode, language } = payload.new;
            if (typeof dark_mode === "boolean") applyDark(dark_mode);
            if (typeof language === "string") applyLang(language);
          }
        )
        .subscribe();

      cleanup = () => { supabase.removeChannel(channel); };
    });

    return () => cleanup?.();
  }, []);

  return null;
}
