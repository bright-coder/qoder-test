# shadcn/ui Theme Implementation for React Native

This React Native Expo project now includes a comprehensive implementation of the shadcn/ui design system, providing consistent styling and components that match the popular web design system.

## 🎨 Theme System

### Colors
The theme includes the complete shadcn/ui color palette with both light and dark variants:

- **Primary Colors**: `primary`, `primaryForeground`
- **Secondary Colors**: `secondary`, `secondaryForeground`
- **Background Colors**: `background`, `foreground`, `muted`, `mutedForeground`
- **Interactive Colors**: `accent`, `accentForeground`
- **Semantic Colors**: `destructive`, `success`, `warning`, `info`
- **UI Colors**: `border`, `input`, `ring`, `card`, `cardForeground`, `popover`, `popoverForeground`

### Typography
Font sizes, weights, and line heights following shadcn/ui specifications:
- Font sizes: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`
- Font weights: `normal`, `medium`, `semibold`, `bold`
- Line heights: `tight`, `snug`, `normal`, `relaxed`, `loose`

### Spacing & Layout
Consistent spacing scale: `0`, `1`, `2`, `3`, `4`, `5`, `6`, `8`, `10`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `56`, `64`

### Border Radius
Rounded corner options: `none`, `sm`, `base`, `md`, `lg`, `xl`, `2xl`, `3xl`, `full`

### Shadows
Shadow system with multiple levels: `none`, `sm`, `base`, `md`, `lg`, `xl`, `2xl`

## 🧩 Components

### Button
A versatile button component with multiple variants and sizes:

```tsx
import { Button } from './components';

// Variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
```

### Card
Flexible card components for content organization:

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <Text>Main card content</Text>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

### Alert
Status and notification components:

```tsx
import { Alert, AlertTitle, AlertDescription } from './components';

<Alert variant="default">
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>Alert message content</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong</AlertDescription>
</Alert>
```

### FormInput
Enhanced input component with validation and focus states:

```tsx
import { FormInput } from './components';

<FormInput
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  error={emailError}
/>
```

## 🎯 Usage

### Setting up the Theme
The theme is automatically available throughout your app via the ThemeProvider in `_layout.tsx`:

```tsx
import { useTheme } from '../theme';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{
      backgroundColor: theme.colors.background,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.sm
    }}>
      <Text style={{
        color: theme.colors.foreground,
        fontSize: theme.typography.lg,
        fontWeight: theme.typography.fontWeight.medium
      }}>
        Hello World
      </Text>
    </View>
  );
};
```

### Switching Between Light and Dark Themes
Update the ThemeProvider in `app/_layout.tsx`:

```tsx
<ThemeProvider isDark={false}> // Light theme
<ThemeProvider isDark={true}>  // Dark theme
```

## 📁 File Structure

```
theme/
├── colors.ts          # Color definitions for light and dark themes
├── typography.ts      # Font sizes, weights, spacing, and border radius
├── shadows.ts         # Shadow definitions for elevation
├── ThemeProvider.tsx  # Theme context and provider
└── index.ts          # Theme exports

components/
├── Alert.tsx         # Alert component variants
├── Button.tsx        # Button component with variants and sizes
├── Card.tsx          # Card component family
├── FormInput.tsx     # Enhanced input component
├── LoginForm.tsx     # Updated login form using new components
├── UIShowcase.tsx    # Demo component showing all components
└── index.ts         # Component exports
```

## 🚀 Key Features

1. **Type Safety**: Full TypeScript support with proper type definitions
2. **Consistent Design**: Follows shadcn/ui design principles exactly
3. **Accessibility**: Proper contrast ratios and touch targets
4. **Performance**: Optimized inline styles for React Native
5. **Flexibility**: Easy customization and extension
6. **Developer Experience**: Clear component APIs and helpful TypeScript hints

## 🔧 Customization

To customize the theme, modify the files in the `theme/` directory:

- `colors.ts`: Update color values for brand customization
- `typography.ts`: Adjust font sizes, weights, and spacing
- `shadows.ts`: Modify shadow styles for different elevation feels

## 📱 Platform Considerations

This implementation uses inline styles instead of CSS classes to ensure maximum compatibility with React Native's styling system while maintaining the visual consistency of shadcn/ui.

## 🎪 Demo

Check out the `UIShowcase` component to see all available components and their variants in action. Import and use it in any screen to test the implementation:

```tsx
import { UIShowcase } from '../components';

export default function DemoScreen() {
  return <UIShowcase />;
}
```

---

**Note**: This implementation brings the beloved shadcn/ui design system to React Native, providing a consistent and beautiful user interface that matches modern web design standards.