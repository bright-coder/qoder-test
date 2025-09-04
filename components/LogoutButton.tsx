import React from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { IconButton } from './IconButton';

export const LogoutButton: React.FC = () => {
  const { t } = useTranslation();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      t('auth.logout'),
      'Are you sure you want to sign out?',
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('auth.logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert(t('common.error'), 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return null;
  }

  return (
    <IconButton
      variant="destructive"
      size="sm"
      onPress={handleLogout}
      iconName="logout"
      iconFamily="MaterialIcons"
      iconPosition="left"
    >
      {t('auth.logout')}
    </IconButton>
  );
};
