import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { LogoutButton } from '../../components/LogoutButton';
import { IconButton } from '../../components/IconButton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/Card';
import { useTheme } from '../../theme';

export default function HomeScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        paddingHorizontal: theme.spacing[6],
        paddingVertical: theme.spacing[8] 
      }}>
        <Card style={{ marginBottom: theme.spacing[6] }}>
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>
              Hello, {user?.username}! You are successfully signed in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ gap: theme.spacing[4] }}>
              <Link href="/about" asChild>
                <IconButton 
                  variant="outline"
                  iconName="info-outline"
                  iconFamily="MaterialIcons"
                  iconPosition="left"
                >
                  Go to About
                </IconButton>
              </Link>
              
              <Link href="/rbac-demo" asChild>
                <IconButton 
                  variant="outline"
                  iconName="shield-outline"
                  iconFamily="Ionicons"
                  iconPosition="left"
                >
                  RBAC Demo
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
              
              <View style={{ alignItems: 'center', marginTop: theme.spacing[4] }}>
                <LogoutButton />
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
      
      <StatusBar style={theme.isDark ? "light" : "dark"} />
    </View>
  );
}
