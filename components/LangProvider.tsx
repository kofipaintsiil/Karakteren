"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getTranslations, type Lang, type TKey } from "@/lib/i18n";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
}

const Ctx = createContext<LangCtx>({
  lang: "nb",
  setLang: () => {},
  t: getTranslations("nb"),
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("nb");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Lang | null;
    if (saved && ["nb", "nn", "en"].includes(saved)) setLangState(saved);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "language" && e.newValue) setLangState(e.newValue as Lang);
    };
    const onLangChange = () => {
      const l = localStorage.getItem("language") as Lang | null;
      if (l) setLangState(l);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("lang-change", onLangChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("lang-change", onLangChange);
    };
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("language", l);
    window.dispatchEvent(new Event("lang-change"));
  }

  return (
    <Ctx.Provider value={{ lang, setLang, t: getTranslations(lang) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang() {
  return useContext(Ctx);
}
