import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import '../i18n'; // Import i18n configuration

const LANGUAGE_STORAGE_KEY = 'app_language';

interface I18nContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => Promise<void>;
  isChangingLanguage: boolean;
  supportedLanguages: { code: string; name: string; nativeName: string }[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const supportedLanguages = [
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'en', name: 'English', nativeName: 'English' }
  ];

  // Load saved language preference on app start
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === 'th' || savedLanguage === 'en')) {
        await changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    }
  };

  const changeLanguage = async (languageCode: string): Promise<void> => {
    if (languageCode === currentLanguage) return;

    setIsChangingLanguage(true);
    try {
      // Change i18next language
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      
      // Save language preference
      await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, languageCode);
      
      console.log(`Language changed to: ${languageCode}`);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsChangingLanguage(false);
    }
  };

  const contextValue: I18nContextType = {
    currentLanguage,
    changeLanguage,
    isChangingLanguage,
    supportedLanguages,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

// Custom hook to use the I18n context
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export default I18nContext;