# @expo/vector-icons Implementation Guide

This guide shows you how to use `@expo/vector-icons` in your React Native Expo application.

## 📦 Installation

`@expo/vector-icons` is already included with Expo SDK 53. No additional installation is required!

```bash
# Already available in your project
npm list @expo/vector-icons
# qoder-test@1.0.0 C:\Users\kkanc\Desktop\qocder\qoder-test
# └─┬ expo@53.0.22
#   └── @expo/vector-icons@14.1.0
```

## 🎨 Available Icon Libraries

`@expo/vector-icons` includes several popular icon libraries:

### 1. **MaterialIcons** - Google's Material Design
```tsx
import { MaterialIcons } from '@expo/vector-icons';

<MaterialIcons name="home" size={24} color="black" />
<MaterialIcons name="person" size={24} color="blue" />
<MaterialIcons name="settings" size={24} color="gray" />
```

### 2. **MaterialCommunityIcons** - Extended Material Design
```tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';

<MaterialCommunityIcons name="account" size={24} color="black" />
<MaterialCommunityIcons name="heart" size={24} color="red" />
<MaterialCommunityIcons name="cart" size={24} color="green" />
```

### 3. **Ionicons** - Ionic Framework Icons
```tsx
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="home-outline" size={24} color="black" />
<Ionicons name="person-outline" size={24} color="blue" />
<Ionicons name="settings-outline" size={24} color="gray" />
```

### 4. **Feather** - Beautiful Minimal Icons
```tsx
import { Feather } from '@expo/vector-icons';

<Feather name="home" size={24} color="black" />
<Feather name="user" size={24} color="blue" />
<Feather name="settings" size={24} color="gray" />
```

### 5. **FontAwesome5** - Popular FontAwesome Icons
```tsx
import { FontAwesome5 } from '@expo/vector-icons';

<FontAwesome5 name="home" size={24} color="black" />
<FontAwesome5 name="user" size={24} color="blue" />
<FontAwesome5 name="cog" size={24} color="gray" />
```

### 6. **AntDesign** - Ant Design Icons
```tsx
import { AntDesign } from '@expo/vector-icons';

<AntDesign name="home" size={24} color="black" />
<AntDesign name="user" size={24} color="blue" />
<AntDesign name="setting" size={24} color="gray" />
```

## 🚀 Common Use Cases

### Tab Navigation Icons

Replace your custom SVG icons in tab navigation:

```tsx
// Before (Custom SVG)
import { HomeIcon, PackageIcon } from '../../components/Icons';

tabBarIcon: ({ focused }) => (
  <HomeIcon 
    size={24} 
    color={focused ? theme.colors.primary : theme.colors.mutedForeground}
    focused={focused}
  />
)

// After (@expo/vector-icons)
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

tabBarIcon: ({ focused, color, size }) => (
  <Ionicons 
    name={focused ? 'home' : 'home-outline'} 
    size={size} 
    color={color} 
  />
)
```

### Button Icons

```tsx
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../components/Button';

<Button variant="outline" size="sm">
  <MaterialIcons name="add" size={16} color={theme.colors.foreground} />
  Add Item
</Button>
```

### Header Icons

```tsx
import { Ionicons } from '@expo/vector-icons';

// In navigation options
headerRight: () => (
  <TouchableOpacity 
    onPress={() => {/* handle press */}}
    style={{ marginRight: 16 }}
  >
    <Ionicons name="settings-outline" size={24} color="white" />
  </TouchableOpacity>
)
```

## 🎨 Styling & Theming

### Using Theme Colors

```tsx
import { useTheme } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <MaterialIcons 
      name="favorite" 
      size={24} 
      color={theme.colors.primary} 
    />
  );
};
```

### Dynamic Icon States

```tsx
const [isFavorite, setIsFavorite] = useState(false);

<TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
  <MaterialIcons 
    name={isFavorite ? "favorite" : "favorite-border"} 
    size={24} 
    color={isFavorite ? theme.colors.destructive : theme.colors.mutedForeground} 
  />
</TouchableOpacity>
```

### Size Variations

```tsx
// Small icons for compact UI
<Feather name="search" size={16} color={theme.colors.foreground} />

// Standard size for most use cases
<Feather name="search" size={24} color={theme.colors.foreground} />

// Large icons for headers or emphasis
<Feather name="search" size={32} color={theme.colors.foreground} />

// Extra large for landing pages
<Feather name="search" size={48} color={theme.colors.foreground} />
```

## 🔍 Finding Icon Names

### 1. **Expo Vector Icons Directory**
Browse all available icons: https://icons.expo.fyi/

### 2. **Material Icons**
Search: https://fonts.google.com/icons

### 3. **Ionicons**
Browse: https://ionic.io/ionicons

### 4. **Feather Icons**
Browse: https://feathericons.com/

## 📱 Complete Tab Layout Example

Here's how to update your tab layout to use `@expo/vector-icons`:

```tsx
// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons 
              name="inventory" 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'settings' : 'settings-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
```

## 🆚 SVG Icons vs Vector Icons

### When to use @expo/vector-icons:
- ✅ **Quick prototyping** - Thousands of icons ready to use
- ✅ **Standard UI patterns** - Common icons (home, settings, search)
- ✅ **Consistent design** - Professional icon families
- ✅ **No custom design needed** - Pre-made icons fit your needs

### When to use Custom SVG Icons:
- ✅ **Brand consistency** - Need specific design language
- ✅ **Unique requirements** - Custom icons not available in icon fonts
- ✅ **Advanced animations** - Complex SVG animations
- ✅ **Design control** - Exact pixel-perfect control

## 🎯 Best Practices

### 1. **Consistent Icon Families**
Stick to one icon family per section for visual consistency:

```tsx
// Good - Consistent Ionicons throughout tab bar
<Ionicons name="home-outline" />
<Ionicons name="person-outline" />
<Ionicons name="settings-outline" />

// Avoid - Mixed icon families
<MaterialIcons name="home" />
<Feather name="user" />
<AntDesign name="setting" />
```

### 2. **Use Outline/Filled Variations**
Many libraries provide outline and filled versions for focus states:

```tsx
tabBarIcon: ({ focused, color, size }) => (
  <Ionicons 
    name={focused ? 'heart' : 'heart-outline'} 
    size={size} 
    color={color} 
  />
)
```

### 3. **Standard Sizes**
Use common sizes for consistency:
- **16px** - Small inline icons
- **20px** - Compact UI elements
- **24px** - Standard icons (default)
- **32px** - Larger buttons and headers
- **48px+** - Hero icons and landing pages

### 4. **Theme Integration**
Always use theme colors for consistency:

```tsx
const theme = useTheme();

<MaterialIcons 
  name="star" 
  size={24} 
  color={theme.colors.primary} // Good
  // color="#007AFF" // Avoid hardcoded colors
/>
```

## 🔧 Integration with Existing Code

You can gradually migrate from custom SVG icons to `@expo/vector-icons`:

1. **Keep existing SVG icons** for custom/branded elements
2. **Use @expo/vector-icons** for standard UI icons
3. **Update tab navigation** to use vector icons
4. **Replace common icons** (home, settings, search) with vector icons
5. **Maintain custom icons** for unique brand elements

## 📚 Additional Resources

- **Expo Vector Icons Documentation**: https://docs.expo.dev/guides/icons/
- **Icon Directory**: https://icons.expo.fyi/
- **Material Design Icons**: https://fonts.google.com/icons
- **Ionicons**: https://ionic.io/ionicons
- **Feather Icons**: https://feathericons.com/

## 🎉 Quick Start

1. **Import the library you want**:
   ```tsx
   import { MaterialIcons } from '@expo/vector-icons';
   ```

2. **Use in your component**:
   ```tsx
   <MaterialIcons name="home" size={24} color="black" />
   ```

3. **Check the demo**: Navigate to the "UI Showcase" tab → "Vector Icons" to see all available icons!

That's it! You now have access to thousands of professional icons in your React Native Expo app. 🚀