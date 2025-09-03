import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const theme = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      ...theme.shadows.sm,
    };

    // Size variations
    const sizeStyles: Record<string, ViewStyle> = {
      default: {
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[2],
        minHeight: 40,
      },
      sm: {
        paddingHorizontal: theme.spacing[3],
        paddingVertical: theme.spacing[1],
        minHeight: 36,
      },
      lg: {
        paddingHorizontal: theme.spacing[8],
        paddingVertical: theme.spacing[3],
        minHeight: 44,
      },
      icon: {
        width: 40,
        height: 40,
        paddingHorizontal: 0,
        paddingVertical: 0,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      default: {
        backgroundColor: theme.colors.primary,
      },
      destructive: {
        backgroundColor: theme.colors.destructive,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
      },
      ghost: {
        backgroundColor: 'transparent',
        ...theme.shadows.none,
      },
      link: {
        backgroundColor: 'transparent',
        ...theme.shadows.none,
      },
    };

    // Disabled state
    const disabledStyle: ViewStyle = disabled || loading ? {
      opacity: 0.5,
    } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyle,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: theme.typography.fontWeight.medium,
      textAlign: 'center',
    };

    // Size text styles
    const sizeTextStyles: Record<string, TextStyle> = {
      default: {
        fontSize: theme.typography.sm,
      },
      sm: {
        fontSize: theme.typography.xs,
      },
      lg: {
        fontSize: theme.typography.base,
      },
      icon: {
        fontSize: theme.typography.sm,
      },
    };

    // Variant text styles
    const variantTextStyles: Record<string, TextStyle> = {
      default: {
        color: theme.colors.primaryForeground,
      },
      destructive: {
        color: theme.colors.destructiveForeground,
      },
      outline: {
        color: theme.colors.foreground,
      },
      secondary: {
        color: theme.colors.secondaryForeground,
      },
      ghost: {
        color: theme.colors.foreground,
      },
      link: {
        color: theme.colors.primary,
        textDecorationLine: 'underline',
      },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.foreground : theme.colors.primaryForeground}
          style={{ marginRight: theme.spacing[2] }}
        />
      )}
      <Text style={getTextStyle()}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};