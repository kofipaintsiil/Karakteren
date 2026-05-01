"use client";
import { useEffect } from "react";
export default function DarkModeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const apply = () => {
      const dark = localStorage.getItem("dark-mode") === "true";
      document.documentElement.setAttribute("data-dark", dark ? "true" : "false");
    };
    apply();
    window.addEventListener("dark-mode-change", apply);
    return () => window.removeEventListener("dark-mode-change", apply);
  }, []);
  return <>{children}</>;
}
