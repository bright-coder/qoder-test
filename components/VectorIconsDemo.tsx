import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { 
  AntDesign, 
  MaterialIcons, 
  MaterialCommunityIcons, 
  Ionicons, 
  FontAwesome, 
  FontAwesome5,
  Feather,
  Entypo 
} from '@expo/vector-icons';
import { useTheme } from '../theme';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface IconDemoProps {
  IconComponent: React.ComponentType<any>;
  name: string;
  iconName: string;
  color: string;
}

const IconDemo: React.FC<IconDemoProps> = ({ IconComponent, name, iconName, color }) => {
  const theme = useTheme();
  
  return (
    <View style={{ 
      alignItems: 'center', 
      margin: theme.spacing[3],
      minWidth: 80 
    }}>
      <View style={{ 
        padding: theme.spacing[3], 
        backgroundColor: theme.colors.muted,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing[2]
      }}>
        <IconComponent 
          name={iconName} 
          size={24} 
          color={color}
        />
      </View>
      
      <Text style={{
        fontSize: theme.typography.xs,
        color: theme.colors.mutedForeground,
        textAlign: 'center',
        fontWeight: theme.typography.fontWeight.medium
      }}>
        {name}
      </Text>
      
      <Text style={{
        fontSize: theme.typography.xs,
        color: theme.colors.mutedForeground,
        textAlign: 'center',
        opacity: 0.7
      }}>
        {iconName}
      </Text>
    </View>
  );
};

export const VectorIconsDemo: React.FC = () => {
  const theme = useTheme();

  const iconSets = [
    {
      title: 'Material Icons',
      description: 'Google\'s Material Design icons',
      Component: MaterialIcons,
      icons: [
        { name: 'Home', iconName: 'home' },
        { name: 'Person', iconName: 'person' },
        { name: 'Settings', iconName: 'settings' },
        { name: 'Search', iconName: 'search' },
        { name: 'Favorite', iconName: 'favorite' },
        { name: 'Add', iconName: 'add' },
        { name: 'Delete', iconName: 'delete' },
        { name: 'Edit', iconName: 'edit' }
      ]
    },
    {
      title: 'Material Community Icons',
      description: 'Extended Material Design icon pack',
      Component: MaterialCommunityIcons,
      icons: [
        { name: 'Account', iconName: 'account' },
        { name: 'Heart', iconName: 'heart' },
        { name: 'Star', iconName: 'star' },
        { name: 'Cart', iconName: 'cart' },
        { name: 'Bell', iconName: 'bell' },
        { name: 'Email', iconName: 'email' },
        { name: 'Phone', iconName: 'phone' },
        { name: 'Camera', iconName: 'camera' }
      ]
    },
    {
      title: 'Ionicons',
      description: 'Premium designed icons for Ionic',
      Component: Ionicons,
      icons: [
        { name: 'Home', iconName: 'home-outline' },
        { name: 'Person', iconName: 'person-outline' },
        { name: 'Settings', iconName: 'settings-outline' },
        { name: 'Search', iconName: 'search-outline' },
        { name: 'Heart', iconName: 'heart-outline' },
        { name: 'Add', iconName: 'add-outline' },
        { name: 'Trash', iconName: 'trash-outline' },
        { name: 'Create', iconName: 'create-outline' }
      ]
    },
    {
      title: 'Feather Icons',
      description: 'Beautiful minimal icons',
      Component: Feather,
      icons: [
        { name: 'Home', iconName: 'home' },
        { name: 'User', iconName: 'user' },
        { name: 'Settings', iconName: 'settings' },
        { name: 'Search', iconName: 'search' },
        { name: 'Heart', iconName: 'heart' },
        { name: 'Plus', iconName: 'plus' },
        { name: 'Trash', iconName: 'trash-2' },
        { name: 'Edit', iconName: 'edit' }
      ]
    },
    {
      title: 'AntDesign',
      description: 'Ant Design icon library',
      Component: AntDesign,
      icons: [
        { name: 'Home', iconName: 'home' },
        { name: 'User', iconName: 'user' },
        { name: 'Setting', iconName: 'setting' },
        { name: 'Search', iconName: 'search1' },
        { name: 'Heart', iconName: 'heart' },
        { name: 'Plus', iconName: 'plus' },
        { name: 'Delete', iconName: 'delete' },
        { name: 'Edit', iconName: 'edit' }
      ]
    },
    {
      title: 'FontAwesome 5',
      description: 'Popular FontAwesome icon pack',
      Component: FontAwesome5,
      icons: [
        { name: 'Home', iconName: 'home' },
        { name: 'User', iconName: 'user' },
        { name: 'Cog', iconName: 'cog' },
        { name: 'Search', iconName: 'search' },
        { name: 'Heart', iconName: 'heart' },
        { name: 'Plus', iconName: 'plus' },
        { name: 'Trash', iconName: 'trash' },
        { name: 'Edit', iconName: 'edit' }
      ]
    }
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing[4] }}>
        
        {/* Header */}
        <View style={{ 
          alignItems: 'center', 
          marginBottom: theme.spacing[8] 
        }}>
          <Text style={{
            fontSize: theme.typography['3xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.foreground,
            marginBottom: theme.spacing[2]
          }}>
            @expo/vector-icons
          </Text>
          <Text style={{
            fontSize: theme.typography.base,
            color: theme.colors.mutedForeground,
            textAlign: 'center'
          }}>
            Professional icon libraries for React Native
          </Text>
        </View>

        {/* Size Demonstration */}
        <Card style={{ marginBottom: theme.spacing[6] }}>
          <CardHeader>
            <CardTitle>Size Variations</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-around',
              paddingVertical: theme.spacing[4]
            }}>
              <View style={{ alignItems: 'center' }}>
                <MaterialIcons name="star" size={16} color={theme.colors.foreground} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[2]
                }}>
                  16px
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <MaterialIcons name="star" size={24} color={theme.colors.foreground} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[2]
                }}>
                  24px
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <MaterialIcons name="star" size={32} color={theme.colors.foreground} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[2]
                }}>
                  32px
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <MaterialIcons name="star" size={48} color={theme.colors.foreground} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[2]
                }}>
                  48px
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Color Variations */}
        <Card style={{ marginBottom: theme.spacing[6] }}>
          <CardHeader>
            <CardTitle>Color Variations</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              paddingVertical: theme.spacing[4]
            }}>
              <View style={{ alignItems: 'center', margin: theme.spacing[2] }}>
                <Ionicons name="heart" size={32} color={theme.colors.primary} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[1]
                }}>
                  Primary
                </Text>
              </View>
              
              <View style={{ alignItems: 'center', margin: theme.spacing[2] }}>
                <Ionicons name="heart" size={32} color={theme.colors.secondary} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[1]
                }}>
                  Secondary
                </Text>
              </View>
              
              <View style={{ alignItems: 'center', margin: theme.spacing[2] }}>
                <Ionicons name="heart" size={32} color={theme.colors.destructive} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[1]
                }}>
                  Destructive
                </Text>
              </View>
              
              <View style={{ alignItems: 'center', margin: theme.spacing[2] }}>
                <Ionicons name="heart" size={32} color={theme.colors.mutedForeground} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[1]
                }}>
                  Muted
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Icon Library Sets */}
        {iconSets.map((set, setIndex) => (
          <Card key={setIndex} style={{ marginBottom: theme.spacing[6] }}>
            <CardHeader>
              <CardTitle>{set.title}</CardTitle>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.mutedForeground,
                marginTop: theme.spacing[1]
              }}>
                {set.description}
              </Text>
            </CardHeader>
            <CardContent>
              <View style={{ 
                flexDirection: 'row', 
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                paddingVertical: theme.spacing[2]
              }}>
                {set.icons.map((icon, iconIndex) => (
                  <IconDemo
                    key={iconIndex}
                    IconComponent={set.Component}
                    name={icon.name}
                    iconName={icon.iconName}
                    color={theme.colors.foreground}
                  />
                ))}
              </View>
            </CardContent>
          </Card>
        ))}

        {/* Usage Examples */}
        <Card style={{ marginBottom: theme.spacing[6] }}>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ padding: theme.spacing[4] }}>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.foreground,
                marginBottom: theme.spacing[4],
                fontWeight: theme.typography.fontWeight.medium
              }}>
                Import and use any icon library:
              </Text>
              
              <View style={{
                backgroundColor: theme.colors.muted,
                padding: theme.spacing[4],
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing[4]
              }}>
                <Text style={{
                  fontSize: theme.typography.xs,
                  color: theme.colors.foreground,
                  fontFamily: 'monospace'
                }}>
                  {`import { MaterialIcons } from '@expo/vector-icons';

<MaterialIcons 
  name="home" 
  size={24} 
  color="#007AFF" 
/>`}
                </Text>
              </View>

              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.foreground,
                marginBottom: theme.spacing[2],
                fontWeight: theme.typography.fontWeight.medium
              }}>
                Tab Bar Example:
              </Text>
              
              <View style={{
                backgroundColor: theme.colors.muted,
                padding: theme.spacing[4],
                borderRadius: theme.borderRadius.md
              }}>
                <Text style={{
                  fontSize: theme.typography.xs,
                  color: theme.colors.foreground,
                  fontFamily: 'monospace'
                }}>
                  {`tabBarIcon: ({ focused, color, size }) => (
  <Ionicons 
    name={focused ? 'home' : 'home-outline'} 
    size={size} 
    color={color} 
  />
)`}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

      </View>
    </ScrollView>
  );
};