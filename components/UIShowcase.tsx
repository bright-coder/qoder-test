import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useTheme } from '../theme';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Alert,
  AlertTitle,
  AlertDescription,
  FormInput
} from './index';

export const UIShowcase: React.FC = () => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing[6] }}>
        
        {/* Header */}
        <View style={{ marginBottom: theme.spacing[8] }}>
          <Text style={{
            fontSize: theme.typography['3xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.foreground,
            marginBottom: theme.spacing[2]
          }}>
            shadcn/ui Components
          </Text>
          <Text style={{
            fontSize: theme.typography.base,
            color: theme.colors.mutedForeground
          }}>
            React Native implementation of shadcn/ui design system
          </Text>
        </View>

        {/* Buttons Section */}
        <Card style={{ marginBottom: theme.spacing[6] }}>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              Different button variants and sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ gap: theme.spacing[3] }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button disabled>Disabled</Button>
                <Button loading={loading} onPress={handleLoadingDemo}>
                  {loading ? 'Loading...' : 'Click me'}
                </Button>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Alerts Section */}
        <Card style={{ marginBottom: theme.spacing[6] }}>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>
              Different alert variants for various use cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ gap: theme.spacing[4] }}>
              <Alert>
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>
                  This is a default alert with some information.
                </AlertDescription>
              </Alert>
              
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again.
                </AlertDescription>
              </Alert>
              
              <Alert variant="success">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your action was completed successfully.
                </AlertDescription>
              </Alert>
              
              <Alert variant="warning">
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Please be aware of this important information.
                </AlertDescription>
              </Alert>
            </View>
          </CardContent>
        </Card>

        {/* Form Inputs Section */}
        <Card style={{ marginBottom: theme.spacing[6] }}>
          <CardHeader>
            <CardTitle>Form Inputs</CardTitle>
            <CardDescription>
              Input components with validation states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ gap: theme.spacing[4] }}>
              <FormInput
                label="Default Input"
                placeholder="Enter some text"
                value={inputValue}
                onChangeText={setInputValue}
              />
              
              <FormInput
                label="Password Input"
                placeholder="Enter your password"
                value=""
                onChangeText={() => {}}
                secureTextEntry
              />
              
              <FormInput
                label="Email Input"
                placeholder="Enter your email"
                value=""
                onChangeText={() => {}}
                keyboardType="email-address"
                autoComplete="email"
              />
              
              <FormInput
                label="Input with Error"
                placeholder="This has an error"
                value=""
                onChangeText={() => {}}
                error="This field is required"
              />
            </View>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <Card style={{ marginBottom: theme.spacing[6] }}>
          <CardHeader>
            <CardTitle>Card Example</CardTitle>
            <CardDescription>
              This is a card component with header, content, and footer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Text style={{ 
              color: theme.colors.foreground, 
              fontSize: theme.typography.sm,
              lineHeight: theme.typography.lineHeight.relaxed * theme.typography.sm
            }}>
              Cards are surfaces that display content and actions on a single topic. 
              They should be easy to scan for relevant and actionable information.
            </Text>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">Cancel</Button>
            <Button size="sm">Save</Button>
          </CardFooter>
        </Card>

        {/* Typography Section */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>
              Text styles and hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ gap: theme.spacing[3] }}>
              <Text style={{ 
                fontSize: theme.typography['3xl'], 
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.foreground 
              }}>
                Heading 1 (3xl)
              </Text>
              <Text style={{ 
                fontSize: theme.typography['2xl'], 
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.foreground 
              }}>
                Heading 2 (2xl)
              </Text>
              <Text style={{ 
                fontSize: theme.typography.xl, 
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.foreground 
              }}>
                Heading 3 (xl)
              </Text>
              <Text style={{ 
                fontSize: theme.typography.base, 
                color: theme.colors.foreground,
                lineHeight: theme.typography.lineHeight.relaxed * theme.typography.base
              }}>
                This is body text using the base font size. It demonstrates how text flows 
                and wraps within the design system.
              </Text>
              <Text style={{ 
                fontSize: theme.typography.sm, 
                color: theme.colors.mutedForeground 
              }}>
                Small text for captions and less important information.
              </Text>
            </View>
          </CardContent>
        </Card>

      </View>
    </ScrollView>
  );
};