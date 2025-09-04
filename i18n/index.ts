import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import translation files
import th from './locales/th.json';
import en from './locales/en.json';

// Get device locale, fallback to Thai if not supported
const getDeviceLanguage = (): string => {
  const locale = Localization.getLocales()[0];
  const languageCode = locale?.languageCode || 'th';
  
  // Only support Thai and English
  if (languageCode === 'en') return 'en';
  return 'th'; // Default to Thai
};

const resources = {
  th: {
    translation: th,
  },
  en: {
    translation: en,
  },
};

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4', // For React Native compatibility
    resources,
    lng: getDeviceLanguage(), // Default language
    fallbackLng: 'th', // Fallback to Thai
    debug: __DEV__, // Enable debug in development
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  });

export default i18next;