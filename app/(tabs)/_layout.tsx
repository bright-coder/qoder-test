import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export default function TabLayout() {
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
          title: 'Home',
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
          title: 'Products',
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
          title: 'POS',
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
          title: 'Customers',
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
        name="showcase"
        options={{
          title: 'UI Showcase',
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
          title: 'About',
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