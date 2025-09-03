import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from './FormInput';
import { LoginFormData } from '../types/auth';

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
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    await onSubmit(data);
  };

  return (
    <View className="bg-white p-6 rounded-xl shadow-sm mx-4">
      <Text className="text-3xl font-bold text-gray-900 text-center mb-8">
        Welcome Back
      </Text>
      
      {error && (
        <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <Text className="text-red-700 text-sm text-center">{error}</Text>
        </View>
      )}

      <View className="space-y-4">
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

      <TouchableOpacity
        className={`py-3 rounded-lg mb-4 mt-6 ${
          isLoading || !isValid 
            ? 'bg-gray-400' 
            : 'bg-blue-600 active:bg-blue-700'
        }`}
        onPress={handleSubmit(handleFormSubmit)}
        disabled={isLoading || !isValid}
      >
        {isLoading ? (
          <View className="flex-row items-center justify-center">
            <ActivityIndicator color="white" size="small" />
            <Text className="text-white text-center font-semibold text-base ml-2">
              Signing in...
            </Text>
          </View>
        ) : (
          <Text className="text-white text-center font-semibold text-base">
            Sign In
          </Text>
        )}
      </TouchableOpacity>

      <View className="mt-6 border-t border-gray-200 pt-4">
        <Text className="text-gray-600 text-sm text-center mb-2">
          Demo Accounts:
        </Text>
        <Text className="text-xs text-gray-500 text-center">
          admin/password123 • user1/123456 • demo/demo
        </Text>
      </View>
    </View>
  );
};