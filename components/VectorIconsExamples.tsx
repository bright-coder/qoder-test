import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { 
  MaterialIcons, 
  Ionicons, 
  Feather,
  MaterialCommunityIcons 
} from '@expo/vector-icons';
import { useTheme } from '../theme';

/**
 * Practical examples of using @expo/vector-icons in common UI patterns
 */

// Example 1: Icon Button Component
interface IconButtonProps {
  onPress: () => void;
  iconName: string;
  iconFamily?: 'MaterialIcons' | 'Ionicons' | 'Feather';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: number;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  iconName,
  iconFamily = 'MaterialIcons',
  variant = 'primary',
  size = 24
}) => {
  const theme = useTheme();
  
  const getIconComponent = () => {
    const iconProps = { name: iconName, size, color: getIconColor() };
    
    switch (iconFamily) {
      case 'Ionicons':
        return <Ionicons {...iconProps} />;
      case 'Feather':
        return <Feather {...iconProps} />;
      default:
        return <MaterialIcons {...iconProps} />;
    }
  };
  
  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primaryForeground;
      case 'secondary':
        return theme.colors.secondaryForeground;
      case 'ghost':
        return theme.colors.foreground;
      default:
        return theme.colors.primaryForeground;
    }
  };
  
  const getButtonStyle = () => {
    const baseStyle = {
      padding: theme.spacing[3],
      borderRadius: theme.borderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minWidth: 44,
      minHeight: 44,
    };
    
    switch (variant) {
      case 'primary':
        return { ...baseStyle, backgroundColor: theme.colors.primary };
      case 'secondary':
        return { ...baseStyle, backgroundColor: theme.colors.secondary };
      case 'ghost':
        return { ...baseStyle, backgroundColor: 'transparent' };
      default:
        return { ...baseStyle, backgroundColor: theme.colors.primary };
    }
  };
  
  return (
    <TouchableOpacity onPress={onPress} style={getButtonStyle()}>
      {getIconComponent()}
    </TouchableOpacity>
  );
};

// Example 2: Favorite Toggle Button
export const FavoriteButton: React.FC<{ 
  isFavorite: boolean; 
  onToggle: () => void; 
}> = ({ isFavorite, onToggle }) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity onPress={onToggle} style={{ padding: theme.spacing[2] }}>
      <MaterialIcons
        name={isFavorite ? 'favorite' : 'favorite-border'}
        size={24}
        color={isFavorite ? theme.colors.destructive : theme.colors.mutedForeground}
      />
    </TouchableOpacity>
  );
};

// Example 3: Status Indicator
export const StatusIndicator: React.FC<{ 
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
}> = ({ status, message }) => {
  const theme = useTheme();
  
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return (
          <MaterialIcons 
            name="check-circle" 
            size={20} 
            color={theme.colors.primary} 
          />
        );
      case 'warning':
        return (
          <MaterialIcons 
            name="warning" 
            size={20} 
            color="#f59e0b" 
          />
        );
      case 'error':
        return (
          <MaterialIcons 
            name="error" 
            size={20} 
            color={theme.colors.destructive} 
          />
        );
      case 'info':
        return (
          <MaterialIcons 
            name="info" 
            size={20} 
            color="#3b82f6" 
          />
        );
    }
  };
  
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing[3],
      backgroundColor: theme.colors.muted,
      borderRadius: theme.borderRadius.md,
      marginVertical: theme.spacing[2]
    }}>
      {getStatusIcon()}
      <Text style={{
        marginLeft: theme.spacing[2],
        fontSize: theme.typography.sm,
        color: theme.colors.foreground
      }}>
        {message}
      </Text>
    </View>
  );
};

// Example 4: Navigation Header with Icons
export const HeaderWithIcons: React.FC<{
  title: string;
  onBack?: () => void;
  onMenu?: () => void;
  onSearch?: () => void;
}> = ({ title, onBack, onMenu, onSearch }) => {
  const theme = useTheme();
  
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      backgroundColor: theme.colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border
    }}>
      {/* Left Section */}
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={{ marginRight: theme.spacing[3] }}>
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={theme.colors.primaryForeground} 
            />
          </TouchableOpacity>
        )}
        
        {onMenu && (
          <TouchableOpacity onPress={onMenu} style={{ marginRight: theme.spacing[3] }}>
            <MaterialIcons 
              name="menu" 
              size={24} 
              color={theme.colors.primaryForeground} 
            />
          </TouchableOpacity>
        )}
        
        <Text style={{
          fontSize: theme.typography.lg,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.primaryForeground
        }}>
          {title}
        </Text>
      </View>
      
      {/* Right Section */}
      {onSearch && (
        <TouchableOpacity onPress={onSearch}>
          <Feather 
            name="search" 
            size={24} 
            color={theme.colors.primaryForeground} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Example 5: List Item with Icon
export const ListItemWithIcon: React.FC<{
  icon: string;
  iconFamily?: 'MaterialIcons' | 'Ionicons' | 'MaterialCommunityIcons';
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
}> = ({ 
  icon, 
  iconFamily = 'MaterialIcons', 
  title, 
  subtitle, 
  onPress, 
  showChevron = true 
}) => {
  const theme = useTheme();
  
  const getIconComponent = () => {
    const iconProps = { 
      name: icon, 
      size: 24, 
      color: theme.colors.primary 
    };
    
    switch (iconFamily) {
      case 'Ionicons':
        return <Ionicons {...iconProps} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons {...iconProps} />;
      default:
        return <MaterialIcons {...iconProps} />;
    }
  };
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[3],
        backgroundColor: theme.colors.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border
      }}
    >
      {/* Icon */}
      <View style={{
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.muted,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing[3]
      }}>
        {getIconComponent()}
      </View>
      
      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: theme.typography.base,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.foreground
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{
            fontSize: theme.typography.sm,
            color: theme.colors.mutedForeground,
            marginTop: 2
          }}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {/* Chevron */}
      {showChevron && (
        <MaterialIcons 
          name="chevron-right" 
          size={24} 
          color={theme.colors.mutedForeground} 
        />
      )}
    </TouchableOpacity>
  );
};

// Main Demo Component
export const VectorIconsExamples: React.FC = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const theme = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <HeaderWithIcons
        title="Vector Icons Examples"
        onBack={() => console.log('Back pressed')}
        onSearch={() => console.log('Search pressed')}
      />
      
      {/* Content */}
      <View style={{ padding: theme.spacing[4] }}>
        
        {/* Icon Buttons */}
        <Text style={{
          fontSize: theme.typography.lg,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.foreground,
          marginBottom: theme.spacing[4]
        }}>
          Icon Buttons
        </Text>
        
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-around',
          marginBottom: theme.spacing[6]
        }}>
          <IconButton
            iconName="add"
            onPress={() => console.log('Add pressed')}
            variant="primary"
          />
          <IconButton
            iconName="heart-outline"
            iconFamily="Ionicons"
            onPress={() => console.log('Heart pressed')}
            variant="secondary"
          />
          <IconButton
            iconName="settings"
            iconFamily="Feather"
            onPress={() => console.log('Settings pressed')}
            variant="ghost"
          />
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={() => setIsFavorite(!isFavorite)}
          />
        </View>
        
        {/* Status Indicators */}
        <Text style={{
          fontSize: theme.typography.lg,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.foreground,
          marginBottom: theme.spacing[4]
        }}>
          Status Indicators
        </Text>
        
        <StatusIndicator status="success" message="Operation completed successfully" />
        <StatusIndicator status="warning" message="Please check your input" />
        <StatusIndicator status="error" message="Something went wrong" />
        <StatusIndicator status="info" message="Here's some helpful information" />
        
        {/* List Items */}
        <Text style={{
          fontSize: theme.typography.lg,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.foreground,
          marginBottom: theme.spacing[4],
          marginTop: theme.spacing[6]
        }}>
          List Items
        </Text>
        
        <View style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.lg,
          overflow: 'hidden'
        }}>
          <ListItemWithIcon
            icon="person"
            title="Profile"
            subtitle="Manage your account settings"
            onPress={() => console.log('Profile pressed')}
          />
          <ListItemWithIcon
            icon="notifications-outline"
            iconFamily="Ionicons"
            title="Notifications"
            subtitle="Configure your alerts"
            onPress={() => console.log('Notifications pressed')}
          />
          <ListItemWithIcon
            icon="shield-check"
            iconFamily="MaterialCommunityIcons"
            title="Security"
            subtitle="Privacy and security settings"
            onPress={() => console.log('Security pressed')}
          />
        </View>
      </View>
    </View>
  );
};