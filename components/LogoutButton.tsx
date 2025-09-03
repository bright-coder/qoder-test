import React from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';

export const LogoutButton: React.FC = () => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
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
    <Button
      variant="destructive"
      size="sm"
      onPress={handleLogout}
    >
      Sign Out
    </Button>
  );
};
