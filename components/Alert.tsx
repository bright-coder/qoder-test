import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme';

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  style?: ViewStyle;
}

export interface AlertTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export interface AlertDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export const Alert: React.FC<AlertProps> = ({ 
  children, 
  variant = 'default',
  style 
}) => {
  const theme = useTheme();

  const getAlertStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      padding: theme.spacing[4],
    };

    const variantStyles: Record<string, ViewStyle> = {
      default: {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border,
      },
      destructive: {
        backgroundColor: theme.colors.destructive + '10',
        borderColor: theme.colors.destructive + '30',
      },
      success: {
        backgroundColor: theme.colors.success + '10',
        borderColor: theme.colors.success + '30',
      },
      warning: {
        backgroundColor: theme.colors.warning + '10',
        borderColor: theme.colors.warning + '30',
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...style,
    };
  };

  return (
    <View style={getAlertStyle()}>
      {children}
    </View>
  );
};

export const AlertTitle: React.FC<AlertTitleProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <Text
      style={[
        {
          fontSize: theme.typography.base,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.foreground,
          marginBottom: theme.spacing[1],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, style }) => {
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