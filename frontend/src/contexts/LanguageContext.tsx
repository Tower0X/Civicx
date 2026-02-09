import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import en from "../locales/en.json";
import fr from "../locales/fr.json";

type Lang = "en" | "fr";

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
  toggle: () => void;
};

const translations: Record<Lang, Record<string, any>> = {
  en,
  fr,
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: string, fallback = "") => {
    const parts = key.split(".");
    let cur: any = translations[lang];
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in cur) cur = cur[p];
      else {
        return fallback || key;
      }
    }
    return typeof cur === "string" ? cur : fallback || key;
  };

  const toggle = () => setLang((l) => (l === "en" ? "fr" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export default LanguageContext;
