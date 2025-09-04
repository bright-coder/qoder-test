import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { 
  MaterialIcons, 
  Ionicons, 
  Feather,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5 
} from '@expo/vector-icons';
import { useTheme } from '../theme';

// Icon family types
type IconFamily = 'MaterialIcons' | 'Ionicons' | 'Feather' | 'MaterialCommunityIcons' | 'AntDesign' | 'FontAwesome5';

export interface IconButtonProps {
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  
  // Icon props
  iconName?: string;
  iconFamily?: IconFamily;
  iconSize?: number;
  iconPosition?: 'left' | 'right' | 'only';
  iconColor?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  style,
  textStyle,
  iconName,
  iconFamily = 'MaterialIcons',
  iconSize,
  iconPosition = 'left',
  iconColor,
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

  const getIconColor = (): string => {
    if (iconColor) return iconColor;
    
    switch (variant) {
      case 'default':
        return theme.colors.primaryForeground;
      case 'destructive':
        return theme.colors.destructiveForeground;
      case 'outline':
        return theme.colors.foreground;
      case 'secondary':
        return theme.colors.secondaryForeground;
      case 'ghost':
        return theme.colors.foreground;
      case 'link':
        return theme.colors.primary;
      default:
        return theme.colors.primaryForeground;
    }
  };

  const getIconSize = (): number => {
    if (iconSize) return iconSize;
    
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 20;
      case 'icon':
        return 24;
      default:
        return 18;
    }
  };

  const renderIcon = () => {
    if (!iconName) return null;

    const IconComponent = (() => {
      switch (iconFamily) {
        case 'Ionicons':
          return Ionicons;
        case 'Feather':
          return Feather;
        case 'MaterialCommunityIcons':
          return MaterialCommunityIcons;
        case 'AntDesign':
          return AntDesign;
        case 'FontAwesome5':
          return FontAwesome5;
        default:
          return MaterialIcons;
      }
    })();

    return (
      <IconComponent 
        name={iconName as any} 
        size={getIconSize()} 
        color={getIconColor()} 
      />
    );
  };

  const renderContent = () => {
    const icon = renderIcon();
    const hasText = children && iconPosition !== 'only';
    
    if (iconPosition === 'only') {
      return icon;
    }

    if (iconPosition === 'right') {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {hasText && (
            <Text style={getTextStyle()}>
              {children}
            </Text>
          )}
          {icon && hasText && <View style={{ width: theme.spacing[2] }} />}
          {icon}
        </View>
      );
    }

    // Default: left position
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon}
        {icon && hasText && <View style={{ width: theme.spacing[2] }} />}
        {hasText && (
          <Text style={getTextStyle()}>
            {children}
          </Text>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || variant === 'ghost' ? theme.colors.foreground : theme.colors.primaryForeground}
          />
          {children && iconPosition !== 'only' && (
            <>
              <View style={{ width: theme.spacing[2] }} />
              <Text style={getTextStyle()}>
                {children}
              </Text>
            </>
          )}
        </View>
      )}
      {!loading && renderContent()}
    </TouchableOpacity>
  );
};