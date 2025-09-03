import React from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from './FormInput';
import { Button } from './Button';
import { Alert, AlertDescription } from './Alert';
import { LoginFormData } from '../types/auth';
import { useTheme } from '../theme';

// Validation schema
const loginSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be less than 50 characters'),
});

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // Changed from 'onBlur' to 'onChange' for better UX
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    console.log('Form submitted with data:', { username: data.username, password: '***' });
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleButtonPress = () => {
    console.log('Sign in button pressed!');
    handleSubmit(handleFormSubmit)();
  };

  // Debug information
  console.log('Form state:', { isValid, isDirty, errors: Object.keys(errors), isLoading });

  return (
    <View>
      {error && (
        <Alert variant="destructive" style={{ marginBottom: theme.spacing[4] }}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <View style={{ gap: theme.spacing[4] }}>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Username"
              placeholder="Enter your username"
              value={value}
              onChangeText={onChange}
              error={errors.username?.message}
              autoCapitalize="none"
              autoComplete="username"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Password"
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              error={errors.password?.message}
              autoCapitalize="none"
              autoComplete="password"
            />
          )}
        />
      </View>

      <Button
        onPress={handleButtonPress}
        disabled={isLoading}
        loading={isLoading}
        style={{
          marginBottom: theme.spacing[4],
          marginTop: theme.spacing[4],
        }}
      >
        Sign In
      </Button>

      <View style={{
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: theme.spacing[4]
      }}>
        <Text style={{ 
          color: theme.colors.mutedForeground, 
          fontSize: theme.typography.sm, 
          textAlign: 'center', 
          marginBottom: theme.spacing[3], 
          fontWeight: theme.typography.fontWeight.medium
        }}>
          Demo Accounts
        </Text>
        <View style={{
          backgroundColor: theme.colors.muted,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing[3]
        }}>
          <Text style={{ 
            fontSize: theme.typography.xs, 
            color: theme.colors.mutedForeground, 
            textAlign: 'center', 
            lineHeight: theme.typography.lineHeight.relaxed * theme.typography.xs
          }}>
            <Text style={{ fontWeight: theme.typography.fontWeight.medium, color: theme.colors.foreground }}>admin</Text> / password123{"\n"}
            <Text style={{ fontWeight: theme.typography.fontWeight.medium, color: theme.colors.foreground }}>user1</Text> / 123456{"\n"}
            <Text style={{ fontWeight: theme.typography.fontWeight.medium, color: theme.colors.foreground }}>demo</Text> / demo
          </Text>
        </View>
      </View>
    </View>
  );
};