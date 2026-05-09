// Note: this i18next setup is for Client Components only.
// For Server Components (RSC) in Next.js App Router, import translations directly
// or use a server-compatible i18n library like next-intl.
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import es from './locales/es.json'
import en from './locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    interpolation: { escapeValue: false },
  })

export default i18n
