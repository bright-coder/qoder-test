import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCustomers } from '../../contexts/CustomerContext';
import { CustomerForm } from '../../components/CustomerForm';
import { CustomerFormData, UpdateCustomerData, Customer } from '../../types/customer';
import { useTheme } from '../../theme';
import { withAuth } from '../../components/withAuth';

function UpdateCustomerScreen() {
  const { updateCustomer, getCustomerById } = useCustomers();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (id) {
      loadCustomer();
    } else {
      setError('Customer ID is required');
      setIsLoadingCustomer(false);
    }
  }, [id]);

  const loadCustomer = async () => {
    try {
      setIsLoadingCustomer(true);
      setError(undefined);
      
      if (!id) {
        throw new Error('Customer ID is required');
      }

      const customerData = await getCustomerById(id);
      if (!customerData) {
        throw new Error('Customer not found');
      }

      setCustomer(customerData);
    } catch (error) {
      console.error('Error loading customer:', error);
      setError(error instanceof Error ? error.message : 'Failed to load customer');
    } finally {
      setIsLoadingCustomer(false);
    }
  };

  const handleSubmit = async (formData: CustomerFormData) => {
    try {
      setIsLoading(true);
      setError(undefined);

      if (!id) {
        throw new Error('Customer ID is required');
      }

      // Transform form data to update data
      const customerData: UpdateCustomerData = {
        id,
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

      await updateCustomer(customerData);
      
      Alert.alert(
        'Success',
        'Customer has been updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error updating customer:', error);
      setError(error instanceof Error ? error.message : 'Failed to update customer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoadingCustomer) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: theme.spacing[4]
        }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ 
            color: theme.colors.mutedForeground,
            fontSize: theme.typography.base,
            marginTop: theme.spacing[4]
          }}>
            Loading customer...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !customer) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: theme.spacing[4]
        }}>
          <Text style={{ 
            color: theme.colors.destructive,
            fontSize: theme.typography.lg,
            fontWeight: theme.typography.fontWeight.medium,
            marginBottom: theme.spacing[2]
          }}>
            Error Loading Customer
          </Text>
          <Text style={{ 
            color: theme.colors.mutedForeground,
            fontSize: theme.typography.base,
            textAlign: 'center',
            marginBottom: theme.spacing[6]
          }}>
            {error}
          </Text>
          <View style={{ flexDirection: 'row', gap: theme.spacing[3] }}>
            <View style={{ minWidth: 120 }}>
              <Text 
                style={{ 
                  color: theme.colors.primary,
                  fontSize: theme.typography.base,
                  textAlign: 'center',
                  padding: theme.spacing[3],
                  borderWidth: 1,
                  borderColor: theme.colors.primary,
                  borderRadius: theme.borderRadius.md
                }}
                onPress={loadCustomer}
              >
                Retry
              </Text>
            </View>
            <View style={{ minWidth: 120 }}>
              <Text 
                style={{ 
                  color: theme.colors.mutedForeground,
                  fontSize: theme.typography.base,
                  textAlign: 'center',
                  padding: theme.spacing[3],
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.md
                }}
                onPress={handleCancel}
              >
                Go Back
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      
      <View style={{ flex: 1 }}>
        <CustomerForm
          mode="update"
          initialData={customer || undefined}
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
export default withAuth(UpdateCustomerScreen);