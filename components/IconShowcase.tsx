import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../theme';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { 
  HomeIcon, 
  PackageIcon, 
  PaletteIcon, 
  InfoIcon, 
  UserIcon, 
  SettingsIcon, 
  PlusIcon, 
  SearchIcon, 
  GridIcon 
} from './Icons';

export const IconShowcase: React.FC = () => {
  const theme = useTheme();

  const iconSets = [
    {
      title: 'Navigation Icons',
      icons: [
        { name: 'Home', component: HomeIcon },
        { name: 'Products', component: PackageIcon },
        { name: 'Grid/Showcase', component: GridIcon },
        { name: 'Info/About', component: InfoIcon },
      ]
    },
    {
      title: 'User Interface Icons',
      icons: [
        { name: 'User Profile', component: UserIcon },
        { name: 'Settings', component: SettingsIcon },
        { name: 'Search', component: SearchIcon },
        { name: 'Add/Plus', component: PlusIcon },
      ]
    },
    {
      title: 'Creative Icons',
      icons: [
        { name: 'Palette/Design', component: PaletteIcon },
      ]
    }
  ];

  const IconDemo = ({ IconComponent, name }: { IconComponent: React.FC<any>, name: string }) => (
    <View style={{ 
      alignItems: 'center', 
      margin: theme.spacing[4],
      minWidth: 80 
    }}>
      {/* Normal size */}
      <View style={{ 
        padding: theme.spacing[3], 
        backgroundColor: theme.colors.muted,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing[2]
      }}>
        <IconComponent 
          size={24} 
          color={theme.colors.foreground}
          focused={false}
        />
      </View>
      
      {/* Active/Primary color */}
      <View style={{ 
        padding: theme.spacing[2], 
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing[2]
      }}>
        <IconComponent 
          size={20} 
          color={theme.colors.primaryForeground}
          focused={true}
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
    </View>
  );

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
            Minimal Icons
          </Text>
          <Text style={{
            fontSize: theme.typography.base,
            color: theme.colors.mutedForeground,
            textAlign: 'center'
          }}>
            Clean, minimal SVG icons for your app
          </Text>
        </View>

        {/* Icon Sets */}
        {iconSets.map((set, setIndex) => (
          <Card key={setIndex} style={{ marginBottom: theme.spacing[6] }}>
            <CardHeader>
              <CardTitle>{set.title}</CardTitle>
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
                    IconComponent={icon.component}
                    name={icon.name}
                  />
                ))}
              </View>
            </CardContent>
          </Card>
        ))}

        {/* Size Variations */}
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
                <HomeIcon size={16} color={theme.colors.foreground} focused={false} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[2]
                }}>
                  16px
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <HomeIcon size={24} color={theme.colors.foreground} focused={false} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[2]
                }}>
                  24px
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <HomeIcon size={32} color={theme.colors.foreground} focused={false} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[2]
                }}>
                  32px
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <HomeIcon size={48} color={theme.colors.foreground} focused={false} />
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
        <Card>
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
                <PackageIcon size={32} color={theme.colors.primary} focused={false} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[1]
                }}>
                  Primary
                </Text>
              </View>
              
              <View style={{ alignItems: 'center', margin: theme.spacing[2] }}>
                <PackageIcon size={32} color={theme.colors.secondary} focused={false} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[1]
                }}>
                  Secondary
                </Text>
              </View>
              
              <View style={{ alignItems: 'center', margin: theme.spacing[2] }}>
                <PackageIcon size={32} color={theme.colors.destructive} focused={false} />
                <Text style={{ 
                  fontSize: theme.typography.xs, 
                  color: theme.colors.mutedForeground,
                  marginTop: theme.spacing[1]
                }}>
                  Destructive
                </Text>
              </View>
              
              <View style={{ alignItems: 'center', margin: theme.spacing[2] }}>
                <PackageIcon size={32} color={theme.colors.mutedForeground} focused={false} />
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

      </View>
    </ScrollView>
  );
};