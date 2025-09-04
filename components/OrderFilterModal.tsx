import React, { useState } from 'react';
import { View, Text, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { IconButton } from './IconButton';
import { Button } from './Button';
import { Select } from './Select';
import { FormInput } from './FormInput';
import { useTheme } from '../theme';
import { 
  OrderFilters, 
  OrderStatus, 
  PaymentStatus, 
  PaymentMethod,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS
} from '../types/order';

interface OrderFilterProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: OrderFilters) => void;
  initialFilters?: OrderFilters;
}

export const OrderFilterModal: React.FC<OrderFilterProps> = ({
  visible,
  onClose,
  onApplyFilters,
  initialFilters = {}
}) => {
  const theme = useTheme();
  
  const [filters, setFilters] = useState<OrderFilters>(initialFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: OrderFilters = {};
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
  };

  const updateFilter = (key: keyof OrderFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const statusOptions = [
    { label: 'All Statuses', value: '' },
    ...ORDER_STATUSES.map(status => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: status
    }))
  ];

  const paymentStatusOptions = [
    { label: 'All Payment Statuses', value: '' },
    ...PAYMENT_STATUSES.map(status => ({
      label: status.replace('_', ' ').toUpperCase(),
      value: status
    }))
  ];

  const paymentMethodOptions = [
    { label: 'All Payment Methods', value: '' },
    ...PAYMENT_METHODS.map(method => ({
      label: method.replace('_', ' ').toUpperCase(),
      value: method
    }))
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ padding: theme.spacing[4], flex: 1 }}>
          {/* Header */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: theme.spacing[4]
          }}>
            <Text style={{
              fontSize: theme.typography.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.foreground,
            }}>
              Filter Orders
            </Text>
            <IconButton
              variant="ghost"
              size="sm"
              onPress={onClose}
              iconName="close"
              iconFamily="MaterialIcons"
            />
          </View>

          <ScrollView style={{ flex: 1 }}>
            {/* Search Query */}
            <Card style={{ marginBottom: theme.spacing[4] }}>
              <CardHeader>
                <CardTitle>Search</CardTitle>
              </CardHeader>
              <CardContent>
                <FormInput
                  label="Search Orders"
                  placeholder="Order number, customer name, phone, or product"
                  value={filters.searchQuery || ''}
                  onChangeText={(value) => updateFilter('searchQuery', value)}
                />
              </CardContent>
            </Card>

            {/* Status Filters */}
            <Card style={{ marginBottom: theme.spacing[4] }}>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <View style={{ gap: theme.spacing[3] }}>
                  <Select
                    label="Order Status"
                    options={statusOptions}
                    value={filters.status || ''}
                    onValueChange={(value) => updateFilter('status', value || undefined)}
                    placeholder="Select order status"
                  />
                  
                  <Select
                    label="Payment Status"
                    options={paymentStatusOptions}
                    value={filters.paymentStatus || ''}
                    onValueChange={(value) => updateFilter('paymentStatus', value || undefined)}
                    placeholder="Select payment status"
                  />
                </View>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card style={{ marginBottom: theme.spacing[4] }}>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  label="Payment Method"
                  options={paymentMethodOptions}
                  value={filters.paymentMethod || ''}
                  onValueChange={(value) => updateFilter('paymentMethod', value || undefined)}
                  placeholder="Select payment method"
                />
              </CardContent>
            </Card>

            {/* Date Range - Simplified for now */}
            <Card style={{ marginBottom: theme.spacing[4] }}>
              <CardHeader>
                <CardTitle>Date Range</CardTitle>
              </CardHeader>
              <CardContent>
                <Text style={{
                  fontSize: theme.typography.sm,
                  color: theme.colors.mutedForeground,
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}>
                  Date range filtering coming soon
                </Text>
              </CardContent>
            </Card>
          </ScrollView>

          {/* Action Buttons */}
          <View style={{ 
            flexDirection: 'row', 
            gap: theme.spacing[3],
            paddingTop: theme.spacing[4],
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
          }}>
            <Button
              variant="outline"
              onPress={handleClear}
              style={{ flex: 1 }}
            >
              Clear All
            </Button>
            <Button
              variant="default"
              onPress={handleApply}
              style={{ flex: 1 }}
            >
              Apply Filters
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};