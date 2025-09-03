import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export interface CardDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          padding: theme.spacing[6],
          paddingBottom: 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <Text
      style={[
        {
          fontSize: theme.typography.lg,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.cardForeground,
          marginBottom: theme.spacing[1],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <Text
      style={[
        {
          fontSize: theme.typography.sm,
          color: theme.colors.mutedForeground,
          lineHeight: theme.typography.lineHeight.relaxed * theme.typography.sm,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          padding: theme.spacing[6],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          padding: theme.spacing[6],
          paddingTop: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};