import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useCustomers } from '../contexts/CustomerContext';
import { CustomerForm } from '../components/CustomerForm';
import { CustomerFormData, CreateCustomerData } from '../types/customer';
import { useTheme } from '../theme';
import { withAuth } from '../components/withAuth';

function CreateCustomerScreen() {
  const { createCustomer } = useCustomers();
  const router = useRouter();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (formData: CustomerFormData) => {
    try {
      setIsLoading(true);
      setError(undefined);

      // Transform form data to create data
      const customerData: CreateCustomerData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        addressLine: formData.addressLine?.trim() || undefined,
        email: formData.email?.trim() || undefined,
        location: formData.latitude && formData.longitude 
          ? {
              lat: parseFloat(formData.latitude),
              lng: parseFloat(formData.longitude)
            }
          : undefined,
        taxId: formData.taxId?.trim() || undefined,
        companyName: formData.companyName?.trim() || undefined,
      };

      await createCustomer(customerData);
      
      Alert.alert(
        'Success',
        'Customer has been created successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error creating customer:', error);
      setError(error instanceof Error ? error.message : 'Failed to create customer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      
      <View style={{ flex: 1 }}>
        <CustomerForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          error={error}
        />
      </View>
    </SafeAreaView>
  );
}

// Export the component wrapped with authentication
export default withAuth(CreateCustomerScreen);