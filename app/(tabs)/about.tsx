import { Text, View, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { LogoutButton } from '../../components/LogoutButton';
import { IconButton } from '../../components/IconButton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/Card';
import { Alert, AlertTitle, AlertDescription } from '../../components/Alert';
import { useTheme } from '../../theme';

export default function AboutScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing[6] }}>
        
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: theme.spacing[8] }}>
          <Text style={{
            fontSize: theme.typography['3xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.foreground,
            marginBottom: theme.spacing[2]
          }}>
            About
          </Text>
          <Text style={{
            fontSize: theme.typography.base,
            color: theme.colors.mutedForeground,
            textAlign: 'center'
          }}>
            Learn more about this React Native Expo app with shadcn/ui theme
          </Text>
        </View>
        
        {/* User Information Card */}
        <Card style={{ marginBottom: theme.spacing[6] }}>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Your current session details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ gap: theme.spacing[2] }}>
              <Text style={{ color: theme.colors.foreground, fontSize: theme.typography.sm }}>
                <Text style={{ fontWeight: theme.typography.fontWeight.medium }}>Username:</Text> {user?.username}
              </Text>
              <Text style={{ color: theme.colors.foreground, fontSize: theme.typography.sm }}>
                <Text style={{ fontWeight: theme.typography.fontWeight.medium }}>Email:</Text> {user?.email || 'Not provided'}
              </Text>
              <Text style={{ color: theme.colors.foreground, fontSize: theme.typography.sm }}>
                <Text style={{ fontWeight: theme.typography.fontWeight.medium }}>User ID:</Text> {user?.id}
              </Text>
            </View>
          </CardContent>
        </Card>
        
        {/* Features Alert */}
        <Alert variant="success" style={{ marginBottom: theme.spacing[6] }}>
          <AlertTitle>Features Implemented</AlertTitle>
          <AlertDescription>
            ✓ shadcn/ui theme system{"\n"}
            ✓ Secure authentication with expo-secure-store{"\n"}
            ✓ Form validation with react-hook-form & zod{"\n"}
            ✓ Tab-based navigation{"\n"}
            ✓ Modern UI components{"\n"}
            ✓ Context-based state management
          </AlertDescription>
        </Alert>
        
        {/* Navigation Card */}
        <Card>
          <CardContent>
            <View style={{ gap: theme.spacing[4] }}>
              <Link href="/" asChild>
                <IconButton 
                  variant="outline"
                  iconName="home"
                  iconFamily="Ionicons"
                  iconPosition="left"
                >
                  Go back to Home
                </IconButton>
              </Link>
              
              <Link href="/showcase" asChild>
                <IconButton
                  iconName="palette"
                  iconFamily="MaterialIcons"
                  iconPosition="left"
                >
                  View UI Showcase
                </IconButton>
              </Link>
              
              <Link href="/products" asChild>
                <IconButton 
                  variant="secondary"
                  iconName="inventory"
                  iconFamily="MaterialIcons"
                  iconPosition="left"
                >
                  Manage Products
                </IconButton>
              </Link>
            </View>
          </CardContent>
          <CardFooter>
            <LogoutButton />
          </CardFooter>
        </Card>
        
      </View>
    </ScrollView>
  );
}
