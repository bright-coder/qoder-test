import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

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
    <TouchableOpacity
      className="bg-red-500 px-4 py-2 rounded-lg active:bg-red-600"
      onPress={handleLogout}
    >
      <Text className="text-white text-sm font-semibold">
        Sign Out
      </Text>
    </TouchableOpacity>
  );
};
