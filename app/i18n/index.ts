import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import es from './translations/es.json';
import en from './translations/en.json';

const deviceLocale = Localization.getLocales()[0]?.languageCode || 'es';

// i18next's named `use` export is unbound, so it has to be called on the instance.
// eslint-disable-next-line import/no-named-as-default-member
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
