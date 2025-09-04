import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from './FormInput';
import { IconButton } from './IconButton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Alert, AlertDescription } from './Alert';
import { CustomerFormData, Customer } from '../types/customer';
import { useTheme } from '../theme';

// Validation schema
const customerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  phone: z.string()
    .min(8, 'Phone number must be at least 8 characters')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  addressLine: z.string()
    .max(200, 'Address must be less than 200 characters')
    .optional(),
  email: z.string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  latitude: z.string()
    .regex(/^-?([0-8]?[0-9](\.\d+)?|90(\.0+)?)$/, 'Latitude must be between -90 and 90')
    .optional()
    .or(z.literal('')),
  longitude: z.string()
    .regex(/^-?((1[0-7][0-9])|([0-9]?[0-9]))(\.\d+)?$|^-?180(\.0+)?$/, 'Longitude must be between -180 and 180')
    .optional()
    .or(z.literal('')),
  taxId: z.string()
    .max(50, 'Tax ID must be less than 50 characters')
    .optional(),
  companyName: z.string()
    .max(100, 'Company name must be less than 100 characters')
    .optional(),
});

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading: boolean;
  error?: string;
  initialData?: Customer;
  mode: 'create' | 'update';
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  error,
  initialData,
  mode,
}) => {
  const theme = useTheme();
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      phone: initialData?.phone || '',
      addressLine: initialData?.addressLine || '',
      email: initialData?.email || '',
      latitude: initialData?.location?.lat?.toString() || '',
      longitude: initialData?.location?.lng?.toString() || '',
      taxId: initialData?.taxId || '',
      companyName: initialData?.companyName || '',
    },
  });

  const handleFormSubmit = async (data: CustomerFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ padding: theme.spacing[4] }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === 'create' ? 'Add New Customer' : 'Update Customer'}
            </CardTitle>
            <CardDescription>
              {mode === 'create' 
                ? 'Enter the customer details below to add a new customer.'
                : 'Update the customer information below.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" style={{ marginBottom: theme.spacing[4] }}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <View style={{ gap: theme.spacing[4] }}>
              {/* Basic Information */}
              <View>
                <Text style={{
                  fontSize: theme.typography.lg,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.foreground,
                  marginBottom: theme.spacing[4],
                }}>
                  Basic Information
                </Text>
                
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      label="Customer Name *"
                      placeholder="Enter customer name"
                      value={value}
                      onChangeText={onChange}
                      error={errors.name?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      label="Phone Number *"
                      placeholder="Enter phone number"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="phone-pad"
                      error={errors.phone?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      label="Email Address"
                      placeholder="Enter email address"
                      value={value || ''}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="companyName"
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      label="Company Name"
                      placeholder="Enter company name"
                      value={value || ''}
                      onChangeText={onChange}
                      error={errors.companyName?.message}
                    />
                  )}
                />
              </View>

              {/* Address Information */}
              <View>
                <Text style={{
                  fontSize: theme.typography.lg,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.foreground,
                  marginBottom: theme.spacing[4],
                }}>
                  Address Information
                </Text>

                <Controller
                  control={control}
                  name="addressLine"
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      label="Address Line"
                      placeholder="Enter street address"
                      value={value || ''}
                      onChangeText={onChange}
                      error={errors.addressLine?.message}
                    />
                  )}
                />

                <View style={{ 
                  flexDirection: 'row', 
                  gap: theme.spacing[3] 
                }}>
                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      name="latitude"
                      render={({ field: { onChange, value } }) => (
                        <FormInput
                          label="Latitude"
                          placeholder="e.g., 13.7563"
                          value={value || ''}
                          onChangeText={onChange}
                          keyboardType="numeric"
                          error={errors.latitude?.message}
                        />
                      )}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      name="longitude"
                      render={({ field: { onChange, value } }) => (
                        <FormInput
                          label="Longitude"
                          placeholder="e.g., 100.5018"
                          value={value || ''}
                          onChangeText={onChange}
                          keyboardType="numeric"
                          error={errors.longitude?.message}
                        />
                      )}
                    />
                  </View>
                </View>
              </View>

              {/* Business Information */}
              <View>
                <Text style={{
                  fontSize: theme.typography.lg,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.foreground,
                  marginBottom: theme.spacing[4],
                }}>
                  Business Information
                </Text>

                <Controller
                  control={control}
                  name="taxId"
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      label="Tax ID"
                      placeholder="Enter tax identification number"
                      value={value || ''}
                      onChangeText={onChange}
                      error={errors.taxId?.message}
                    />
                  )}
                />
              </View>

              {/* Action Buttons */}
              <View style={{ 
                flexDirection: 'row', 
                gap: theme.spacing[3], 
                marginTop: theme.spacing[6] 
              }}>
                {onCancel && (
                  <IconButton
                    variant="outline"
                    onPress={onCancel}
                    disabled={isLoading}
                    style={{ flex: 1 }}
                    iconName="close"
                    iconFamily="MaterialIcons"
                    iconPosition="left"
                  >
                    Cancel
                  </IconButton>
                )}
                <IconButton
                  onPress={handleSubmit(handleFormSubmit)}
                  disabled={isLoading}
                  loading={isLoading}
                  style={{ flex: onCancel ? 1 : undefined }}
                  iconName={mode === 'create' ? 'person-add' : 'save'}
                  iconFamily="MaterialIcons"
                  iconPosition="left"
                >
                  {mode === 'create' ? 'Add Customer' : 'Update Customer'}
                </IconButton>
              </View>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};