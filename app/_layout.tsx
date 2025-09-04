import '../global.css';
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ProductProvider } from '../contexts/ProductContext';
import { CustomerProvider } from '../contexts/CustomerContext';
import { OrderProvider } from '../contexts/OrderContext';
import { I18nProvider } from '../contexts/I18nContext';
import { ThemeProvider, useTheme } from '../theme';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const theme = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login';
    const inProductGroup = segments[0] === 'products' || 
                          segments[0] === 'create-product' || 
                          segments[0] === 'update-product';
    const inCustomerGroup = segments[0] === 'customers' || 
                          segments[0] === 'create-customer' || 
                          segments[0] === 'update-customer';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and trying to access protected routes
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main app if authenticated
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="products" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="create-product" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="update-product" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="create-customer" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="update-customer" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="pos" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="order-details" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider isDark={false}>
      <I18nProvider>
        <AuthProvider>
          <ProductProvider>
            <CustomerProvider>
              <OrderProvider>
                <RootLayoutNav />
              </OrderProvider>
            </CustomerProvider>
          </ProductProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}