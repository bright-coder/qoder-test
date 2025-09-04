import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme';
import { useOrders } from '../../contexts/OrderContext';
import { withAuth } from '../../components/withAuth';
import { 
  IconButton,
  FormInput,
  OrderCard,
  OrderSummaryCard,
  OrderFilterModal,
  Alert as AlertComponent,
  AlertDescription
} from '../../components';
import { OrderFilters, OrderStatus } from '../../types/order';

function OrdersTabScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const {
    orders,
    isLoading,
    error,
    summary,
    searchOrders,
    filterOrders,
    loadOrders,
    markOrderAsCompleted,
    markOrderAsCancelled,
    markOrderAsRefunded,
    clearError
  } = useOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<OrderFilters>({});
  const [refreshing, setRefreshing] = useState(false);

  // Handle search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        searchOrders(searchQuery);
      } else if (!hasActiveFilters()) {
        loadOrders();
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Check if there are active filters
  const hasActiveFilters = () => {
    return Object.keys(activeFilters).some(key => 
      activeFilters[key as keyof OrderFilters] !== undefined && 
      activeFilters[key as keyof OrderFilters] !== ''
    );
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadOrders();
    } finally {
      setRefreshing(false);
    }
  };

  // Handle filter application
  const handleApplyFilters = async (filters: OrderFilters) => {
    setActiveFilters(filters);
    await filterOrders(filters);
  };

  // Handle order actions with confirmation
  const handleCompleteOrder = (orderId: string) => {
    Alert.alert(
      'Complete Order',
      'Are you sure you want to mark this order as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              await markOrderAsCompleted(orderId);
            } catch (error) {
              Alert.alert('Error', 'Failed to complete order');
            }
          }
        }
      ]
    );
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Cancel Order',
          style: 'destructive',
          onPress: async () => {
            try {
              await markOrderAsCancelled(orderId);
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel order');
            }
          }
        }
      ]
    );
  };

  const handleRefundOrder = (orderId: string) => {
    Alert.alert(
      'Refund Order',
      'Are you sure you want to refund this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Refund',
          style: 'destructive',
          onPress: async () => {
            try {
              await markOrderAsRefunded(orderId);
            } catch (error) {
              Alert.alert('Error', 'Failed to refund order');
            }
          }
        }
      ]
    );
  };

  // Navigate to order details
  const handleOrderPress = (orderId: string) => {
    router.push(`/order-details/${orderId}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing[4] }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: theme.spacing[4] 
        }}>
          <Text style={{
            fontSize: theme.typography['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.foreground,
          }}>
            {t('orders.title')}
          </Text>
          <IconButton
            variant="outline"
            size="sm"
            onPress={() => setShowFilterModal(true)}
            iconName="filter-list"
            iconFamily="MaterialIcons"
          >
            Filter
          </IconButton>
        </View>

        {/* Order Summary */}
        {summary && <OrderSummaryCard summary={summary} />}

        {/* Search and Filters */}
        <View style={{ marginBottom: theme.spacing[4] }}>
          <FormInput
            label="Search Orders"
            placeholder="Search by order number, customer, or product"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          {/* Active Filters Indicator */}
          {hasActiveFilters() && (
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginTop: theme.spacing[2] 
            }}>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.primary,
                marginRight: theme.spacing[2],
              }}>
                Filters active
              </Text>
              <IconButton
                variant="ghost"
                size="sm"
                onPress={() => handleApplyFilters({})}
                iconName="clear"
                iconFamily="MaterialIcons"
              >
                Clear
              </IconButton>
            </View>
          )}
        </View>

        {/* Error State */}
        {error && (
          <AlertComponent variant="destructive" style={{ marginBottom: theme.spacing[4] }}>
            <AlertDescription>{error}</AlertDescription>
            <IconButton
              variant="ghost"
              size="sm"
              onPress={clearError}
              iconName="close"
              iconFamily="MaterialIcons"
              style={{ marginTop: theme.spacing[2] }}
            >
              Dismiss
            </IconButton>
          </AlertComponent>
        )}

        {/* Loading State */}
        {isLoading && !refreshing && (
          <View style={{ 
            padding: theme.spacing[4], 
            alignItems: 'center' 
          }}>
            <Text style={{
              fontSize: theme.typography.sm,
              color: theme.colors.mutedForeground,
            }}>
              Loading orders...
            </Text>
          </View>
        )}

        {/* Orders List */}
        {!isLoading && orders.length === 0 ? (
          <View style={{ 
            padding: theme.spacing[6], 
            alignItems: 'center',
            backgroundColor: theme.colors.muted,
            borderRadius: theme.borderRadius.lg,
          }}>
            <Text style={{
              fontSize: theme.typography.lg,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.foreground,
              marginBottom: theme.spacing[2],
            }}>
              No Orders Found
            </Text>
            <Text style={{
              fontSize: theme.typography.sm,
              color: theme.colors.mutedForeground,
              textAlign: 'center',
              marginBottom: theme.spacing[4],
            }}>
              {searchQuery || hasActiveFilters() 
                ? 'No orders match your search criteria. Try adjusting your search or filters.'
                : 'No orders have been created yet. Create your first order from the POS page.'
              }
            </Text>
            {(searchQuery || hasActiveFilters()) && (
              <IconButton
                variant="outline"
                onPress={() => {
                  setSearchQuery('');
                  handleApplyFilters({});
                }}
                iconName="refresh"
                iconFamily="MaterialIcons"
              >
                Show All Orders
              </IconButton>
            )}
          </View>
        ) : (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => handleOrderPress(order.id)}
              onMarkAsCompleted={handleCompleteOrder}
              onMarkAsCancelled={handleCancelOrder}
              onMarkAsRefunded={handleRefundOrder}
            />
          ))
        )}

        {/* Bottom Spacing */}
        <View style={{ height: theme.spacing[6] }} />
      </ScrollView>

      {/* Filter Modal */}
      <OrderFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={activeFilters}
      />
    </SafeAreaView>
  );
}

// Export the component wrapped with authentication
export default withAuth(OrdersTabScreen);