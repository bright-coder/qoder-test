import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { LogoutButton } from '../../components/LogoutButton';
import { Button } from '../../components/Button';
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
                <Button variant="outline">Go to About</Button>
              </Link>
              
              <Link href="/showcase" asChild>
                <Button>View UI Showcase</Button>
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
