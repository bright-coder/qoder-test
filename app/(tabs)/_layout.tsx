import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme';

export default function TabLayout() {
  const { t } = useTranslation();
  const theme = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.primaryForeground,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeight.bold,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.home'),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: t('navigation.products'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons 
              name={focused ? 'inventory' : 'inventory-2'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pos"
        options={{
          title: t('navigation.pos'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons 
              name={focused ? 'point-of-sale' : 'storefront'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: t('navigation.customers'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons 
              name={focused ? 'people' : 'people-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('navigation.orders'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons 
              name={focused ? 'receipt-long' : 'receipt'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="showcase"
        options={{
          title: t('navigation.uiShowcase'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons 
              name={focused ? 'dashboard' : 'dashboard-customize'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: t('navigation.about'),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'information-circle' : 'information-circle-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}