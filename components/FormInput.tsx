import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { FormInputProps } from '../types/auth';
import { useTheme } from '../theme';

export const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  autoCapitalize = 'none',
  autoComplete = 'off',
  keyboardType = 'default',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  return (
    <View style={{ marginBottom: theme.spacing[6] }}>
      <Text style={{ 
        color: theme.colors.foreground, 
        fontSize: theme.typography.sm, 
        fontWeight: theme.typography.fontWeight.medium, 
        marginBottom: theme.spacing[2],
        marginLeft: theme.spacing[1]
      }}>
        {label}
      </Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderRadius: theme.borderRadius.md,
            paddingHorizontal: theme.spacing[3],
            paddingVertical: theme.spacing[3],
            fontSize: theme.typography.sm,
            fontWeight: theme.typography.fontWeight.normal,
            color: theme.colors.foreground,
            backgroundColor: theme.colors.background,
            borderColor: error 
              ? theme.colors.destructive 
              : isFocused 
                ? theme.colors.ring 
                : theme.colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.mutedForeground}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          keyboardType={keyboardType}
          autoCorrect={false}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: theme.spacing[3],
              top: theme.spacing[3],
              padding: theme.spacing[1],
            }}
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={{ color: theme.colors.mutedForeground, fontSize: theme.typography.base }}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={{ marginTop: theme.spacing[2] }}>
          <Text style={{ 
            color: theme.colors.destructive, 
            fontSize: theme.typography.sm, 
            marginLeft: theme.spacing[1],
            fontWeight: theme.typography.fontWeight.medium
          }}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};