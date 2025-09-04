import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Link, useRouter } from 'expo-router';
import { useCustomers } from '../../contexts/CustomerContext';
import { IconButton } from '../../components/IconButton';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Alert as AlertComponent, AlertDescription } from '../../components/Alert';
import { FormInput } from '../../components/FormInput';
import { Customer } from '../../types/customer';
import { useTheme } from '../../theme';
import { withAuth } from '../../components/withAuth';
import { Button } from '../../components/Button';

const CustomerCard: React.FC<{ 
  customer: Customer; 
  onEdit: (id: string) => void; 
  onDelete: (id: string) => void;
}> = ({ customer, onEdit, onDelete }) => {
  const theme = useTheme();

  const handleDelete = () => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete "${customer.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(customer.id),
        },
      ]
    );
  };

  const formatLocation = (location?: { lat: number; lng: number }) => {
    if (!location) return null;
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
  };

  return (
    <Card style={{ marginBottom: theme.spacing[4] }}>
      <CardHeader>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <CardTitle>{customer.name}</CardTitle>
            <Text style={{
              fontSize: theme.typography.sm,
              color: theme.colors.mutedForeground,
              marginTop: theme.spacing[1]
            }}>
              {customer.phone}
              {customer.email && ` • ${customer.email}`}
            </Text>
            {customer.companyName && (
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.primary,
                marginTop: theme.spacing[1],
                fontWeight: theme.typography.fontWeight.medium
              }}>
                {customer.companyName}
              </Text>
            )}
          </View>
        </View>
      </CardHeader>
      
      <CardContent>
        <View style={{ gap: theme.spacing[2] }}>
          {customer.addressLine && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{
                fontSize: theme.typography.xs,
                color: theme.colors.mutedForeground,
                width: 80
              }}>
                Address:
              </Text>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.foreground,
                flex: 1
              }}>
                {customer.addressLine}
              </Text>
            </View>
          )}

          {customer.location && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{
                fontSize: theme.typography.xs,
                color: theme.colors.mutedForeground,
                width: 80
              }}>
                Location:
              </Text>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.foreground,
                flex: 1
              }}>
                {formatLocation(customer.location)}
              </Text>
            </View>
          )}

          {customer.taxId && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{
                fontSize: theme.typography.xs,
                color: theme.colors.mutedForeground,
                width: 80
              }}>
                Tax ID:
              </Text>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.foreground,
                flex: 1
              }}>
                {customer.taxId}
              </Text>
            </View>
          )}
          
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'flex-end', 
            gap: theme.spacing[2],
            marginTop: theme.spacing[3]
          }}>
            <IconButton
              variant="outline"
              size="sm"
              onPress={() => onEdit(customer.id)}
              iconName="edit"
              iconFamily="MaterialIcons"
              iconPosition="left"
            >
              Edit
            </IconButton>
            <IconButton
              variant="destructive"
              size="sm"
              onPress={handleDelete}
              iconName="delete"
              iconFamily="MaterialIcons"
              iconPosition="left"
            >
              Delete
            </IconButton>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

function CustomersTabScreen() {
  const { 
    customers, 
    isLoading, 
    error, 
    loadCustomers, 
    deleteCustomer, 
    searchCustomers 
  } = useCustomers();
  const router = useRouter();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleEdit = (id: string) => {
    router.push(`/update-customer/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomer(id);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete customer');
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      await loadCustomers();
    } else {
      await searchCustomers(query);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing[4] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: theme.spacing[6] 
        }}>
          <View>
            <Text style={{
              fontSize: theme.typography['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.foreground,
            }}>
              Customers
            </Text>
            <Text style={{
              fontSize: theme.typography.sm,
              color: theme.colors.mutedForeground,
            }}>
              {customers.length} customer{customers.length !== 1 ? 's' : ''} total
            </Text>
          </View>
          
          <Link href="/create-customer" asChild>
            <IconButton
              iconName="person-add"
              iconFamily="MaterialIcons"
              iconPosition="left"
            >
              Add Customer
            </IconButton>
          </Link>
        </View>

        {/* Search */}
        <View style={{ marginBottom: theme.spacing[4] }}>
          <FormInput
            label=""
            placeholder="Search customers by name, phone, email, or company..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Error State */}
        {error && (
          <AlertComponent variant="destructive" style={{ marginBottom: theme.spacing[4] }}>
            <AlertDescription>{error}</AlertDescription>
          </AlertComponent>
        )}

        {/* Loading State */}
        {isLoading && customers.length === 0 && (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingVertical: theme.spacing[16] 
          }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ 
              color: theme.colors.mutedForeground,
              fontSize: theme.typography.base,
              marginTop: theme.spacing[4]
            }}>
              Loading customers...
            </Text>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && customers.length === 0 && !error && (
          <Card>
            <CardContent style={{ alignItems: 'center', paddingVertical: theme.spacing[16] }}>
              <Text style={{
                fontSize: theme.typography.lg,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.foreground,
                marginBottom: theme.spacing[2]
              }}>
                {searchQuery ? 'No customers found' : 'No customers yet'}
              </Text>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.mutedForeground,
                textAlign: 'center',
                marginBottom: theme.spacing[6]
              }}>
                {searchQuery 
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first customer'}
              </Text>
              {!searchQuery && (
                <Link href="/create-customer" asChild>
                  <Button>Add Your First Customer</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Customers List */}
        {customers.map(customer => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Export the component wrapped with authentication
export default withAuth(CustomersTabScreen);