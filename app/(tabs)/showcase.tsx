import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { UIShowcase } from '../../components/UIShowcase';
import { IconShowcase } from '../../components/IconShowcase';
import { Button } from '../../components/Button';
import { useTheme } from '../../theme';

export default function ShowcaseScreen() {
  const [activeTab, setActiveTab] = useState<'components' | 'icons'>('components');
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
        <Button
          variant={activeTab === 'components' ? 'default' : 'ghost'}
          size="sm"
          onPress={() => setActiveTab('components')}
          style={{ 
            marginRight: theme.spacing[2],
            borderRadius: theme.borderRadius.full
          }}
        >
          Components
        </Button>
        <Button
          variant={activeTab === 'icons' ? 'default' : 'ghost'}
          size="sm"
          onPress={() => setActiveTab('icons')}
          style={{ borderRadius: theme.borderRadius.full }}
        >
          Icons
        </Button>
      </View>
      
      {/* Content */}
      {activeTab === 'components' ? <UIShowcase /> : <IconShowcase />}
    </View>
  );
}