import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '../../theme';
import { HomeIcon, PackageIcon, GridIcon, InfoIcon } from '../../components/Icons';

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
          tabBarIcon: ({ focused }) => (
            <HomeIcon 
              size={24} 
              color={focused ? theme.colors.primary : theme.colors.mutedForeground}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ focused }) => (
            <PackageIcon 
              size={24} 
              color={focused ? theme.colors.primary : theme.colors.mutedForeground}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="showcase"
        options={{
          title: 'UI Showcase',
          tabBarIcon: ({ focused }) => (
            <GridIcon 
              size={24} 
              color={focused ? theme.colors.primary : theme.colors.mutedForeground}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ focused }) => (
            <InfoIcon 
              size={24} 
              color={focused ? theme.colors.primary : theme.colors.mutedForeground}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}