import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en/translation.json";
import deTranslation from "./locales/de/translation.json";

export type Translate = (key: string) => string;

export const resources = {
  en: { translation: enTranslation },
  de: { translation: deTranslation },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: Object.keys(resources),
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    },
  });

function setHtmlLang(lng: string) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lng;
}

setHtmlLang(i18n.resolvedLanguage || i18n.language);
i18n.on("languageChanged", (lng) => setHtmlLang(lng));

export default i18n;
