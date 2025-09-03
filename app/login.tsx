import React, { useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LoginForm } from '../components/LoginForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { LoginFormData } from '../types/auth';
import { useTheme } from '../theme';

export default function LoginScreen() {
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  // Navigate to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, []);

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data);
      // Navigation will be handled by the useEffect above
    } catch (error) {
      // Error handling is managed by the AuthContext
      console.error('Login error:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.muted }}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            paddingHorizontal: theme.spacing[8], 
            paddingVertical: theme.spacing[16] 
          }}>
            {/* App Logo/Title */}
            <View style={{ alignItems: 'center', marginBottom: theme.spacing[16] }}>
              <View style={{ 
                width: 80, 
                height: 80, 
                backgroundColor: theme.colors.primary, 
                borderRadius: theme.borderRadius.full, 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: theme.spacing[8] 
              }}>
                <Text style={{ fontSize: theme.typography['2xl'], color: theme.colors.primaryForeground }}>📱</Text>
              </View>
              <Text style={{ 
                color: theme.colors.foreground, 
                fontSize: theme.typography['3xl'], 
                fontWeight: theme.typography.fontWeight.bold, 
                marginBottom: theme.spacing[2],
                textAlign: 'center'
              }}>
                Welcome Back
              </Text>
              <Text style={{ 
                color: theme.colors.mutedForeground, 
                fontSize: theme.typography.base,
                textAlign: 'center'
              }}>
                Sign in to your account
              </Text>
            </View>
            
            {/* Login Form */}
            <Card style={{ marginHorizontal: 0 }}>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm
                  onSubmit={handleLogin}
                  isLoading={isLoading}
                  error={error || undefined}
                />
              </CardContent>
            </Card>
            
            {/* Footer */}
            <View style={{ marginTop: theme.spacing[12], alignItems: 'center' }}>
              <Text style={{ color: theme.colors.mutedForeground, fontSize: theme.typography.sm, textAlign: 'center' }}>
                Don't have an account?{' '}
                <Text style={{ 
                  color: theme.colors.foreground, 
                  fontWeight: theme.typography.fontWeight.medium 
                }}>
                  Sign up
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}