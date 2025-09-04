import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { UIShowcase } from '../../components/UIShowcase';
import { VectorIconsDemo } from '../../components/VectorIconsDemo';
import { IconButton } from '../../components/IconButton';
import { useTheme } from '../../theme';

export default function ShowcaseScreen() {
  const [activeTab, setActiveTab] = useState<'components' | 'vector-icons'>('components');
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Tab Headers */}
      <View style={{ 
        flexDirection: 'row', 
        backgroundColor: theme.colors.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingHorizontal: theme.spacing[4],
        paddingTop: theme.spacing[2]
      }}>
        <IconButton
          variant={activeTab === 'components' ? 'default' : 'ghost'}
          size="sm"
          onPress={() => setActiveTab('components')}
          style={{ 
            marginRight: theme.spacing[2],
            borderRadius: theme.borderRadius.full
          }}
          iconName="widgets"
          iconFamily="MaterialIcons"
          iconPosition="left"
        >
          Components
        </IconButton>
        <IconButton
          variant={activeTab === 'vector-icons' ? 'default' : 'ghost'}
          size="sm"
          onPress={() => setActiveTab('vector-icons')}
          style={{ borderRadius: theme.borderRadius.full }}
          iconName="star"
          iconFamily="MaterialIcons"
          iconPosition="left"
        >
          Vector Icons
        </IconButton>
      </View>
      
      {/* Content */}
      {activeTab === 'components' ? (
        <UIShowcase />
      ) : (
        <VectorIconsDemo />
      )}
    </View>
  );
}