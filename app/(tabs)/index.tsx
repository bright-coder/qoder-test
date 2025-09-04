import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { LogoutButton } from '../../components/LogoutButton';
import { IconButton } from '../../components/IconButton';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/Card';
import { useTheme } from '../../theme';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Language Switcher */}
      <View style={{
        position: 'absolute',
        top: theme.spacing[12],
        right: theme.spacing[4],
        zIndex: 10,
      }}>
        <LanguageSwitcher showLabel={true} />
      </View>
      
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        paddingHorizontal: theme.spacing[6],
        paddingVertical: theme.spacing[8] 
      }}>
        <Card style={{ marginBottom: theme.spacing[6] }}>
          <CardHeader>
            <CardTitle>{t('home.welcomeBack')}</CardTitle>
            <CardDescription>
              {t('home.welcomeMessage', { username: user?.username })}
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
                  {t('home.goToAbout')}
                </IconButton>
              </Link>
              
              <Link href="/rbac-demo" asChild>
                <IconButton 
                  variant="outline"
                  iconName="shield-outline"
                  iconFamily="Ionicons"
                  iconPosition="left"
                >
                  {t('home.rbacDemo')}
                </IconButton>
              </Link>
              
              <Link href="/showcase" asChild>
                <IconButton
                  iconName="palette"
                  iconFamily="MaterialIcons"
                  iconPosition="left"
                >
                  {t('home.viewUiShowcase')}
                </IconButton>
              </Link>
              
              <Link href="/products" asChild>
                <IconButton 
                  variant="secondary"
                  iconName="inventory"
                  iconFamily="MaterialIcons"
                  iconPosition="left"
                >
                  {t('home.manageProducts')}
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
