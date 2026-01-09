import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import es from './translations/es.json';
import en from './translations/en.json';

const deviceLocale = Localization.getLocales()[0]?.languageCode || 'es';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: deviceLocale,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
