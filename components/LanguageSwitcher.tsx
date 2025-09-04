import React, { useState } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useI18n } from '../contexts/I18nContext';
import { IconButton } from './IconButton';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { useTheme } from '../theme';

interface LanguageSwitcherProps {
  showLabel?: boolean;
  size?: 'sm' | 'lg';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  showLabel = false, 
  size = 'sm' 
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { currentLanguage, changeLanguage, isChangingLanguage, supportedLanguages } = useI18n();
  const [showModal, setShowModal] = useState(false);

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode);
    setShowModal(false);
  };

  const getCurrentLanguageName = () => {
    const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);
    return currentLang?.nativeName || currentLanguage.toUpperCase();
  };

  return (
    <>
      <IconButton
        variant="ghost"
        size={size}
        onPress={() => setShowModal(true)}
        disabled={isChangingLanguage}
        iconName="language"
        iconFamily="MaterialIcons"
        iconPosition={showLabel ? "left" : "only"}
      >
        {showLabel ? getCurrentLanguageName() : undefined}
      </IconButton>

      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: theme.spacing[4],
        }}>
          <View style={{
            backgroundColor: theme.colors.card,
            borderRadius: theme.borderRadius.lg,
            width: '100%',
            maxWidth: 400,
          }}>
            <Card>
              <CardHeader>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <CardTitle>{t('language.changeLanguage')}</CardTitle>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onPress={() => setShowModal(false)}
                    iconName="close"
                    iconFamily="MaterialIcons"
                  />
                </View>
              </CardHeader>
              <CardContent>
                <View style={{ gap: theme.spacing[2] }}>
                   
                  {supportedLanguages.map((language) => (
                    <Pressable
                      key={language.code}
                      onPress={() => handleLanguageChange(language.code)}
                      disabled={isChangingLanguage}
                      style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: theme.spacing[4],
                        backgroundColor: currentLanguage === language.code 
                          ? theme.colors.primary + '20' 
                          : pressed 
                            ? theme.colors.muted 
                            : 'transparent',
                        borderRadius: theme.borderRadius.md,
                        borderWidth: currentLanguage === language.code ? 1 : 0,
                        borderColor: currentLanguage === language.code ? theme.colors.primary : 'transparent',
                        opacity: isChangingLanguage ? 0.6 : 1,
                      })}
                    >
                      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View>
                            <Text style={{
                          fontSize: 16,
                          fontWeight: currentLanguage === language.code 
                            ? '700' 
                            : '500',
                          color: currentLanguage === language.code 
                            ? theme.colors.primary 
                            : theme.colors.foreground,
                        }}>
                          {language.nativeName}
                        </Text>
                        <Text style={{
                          fontSize: 14,
                          color: theme.colors.mutedForeground,
                          marginTop: 4,
                        }}>
                          {language.name}
                        </Text>
                        </View>
                        
                        
                        
                      </View>
                      
                    </Pressable>
                  ))}
                </View>
                
                {isChangingLanguage && (
                  <View style={{
                    marginTop: theme.spacing[4],
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontSize: theme.typography.sm,
                      color: theme.colors.mutedForeground,
                    }}>
                      {t('common.loading')}
                    </Text>
                  </View>
                )}
              </CardContent>
            </Card>
          </View>
        </View>
      </Modal>
    </>
  );
};