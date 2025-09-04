import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../theme';
import { useOrders } from '../../contexts/OrderContext';
import { withAuth } from '../../components/withAuth';
import { 
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Alert as AlertComponent,
  AlertDescription
} from '../../components';
import { Order, OrderStatus, getOrderStatusColor, getPaymentStatusColor } from '../../types/order';

function OrderDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getOrderById,
    markOrderAsCompleted,
    markOrderAsCancelled,
    markOrderAsRefunded,
    error,
    clearError
  } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    setIsLoading(true);
    try {
      const orderData = await getOrderById(id!);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const color = getOrderStatusColor(status);
    return (
      <View style={{
        backgroundColor: color + '20',
        paddingHorizontal: theme.spacing[3],
        paddingVertical: theme.spacing[2],
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: color,
        alignSelf: 'flex-start',
      }}>
        <Text style={{
          fontSize: theme.typography.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: color,
          textTransform: 'uppercase',
        }}>
          {status}
        </Text>
      </View>
    );
  };

  const getPaymentBadge = (status: string) => {
    const color = getPaymentStatusColor(status as any);
    return (
      <View style={{
        backgroundColor: color + '20',
        paddingHorizontal: theme.spacing[3],
        paddingVertical: theme.spacing[2],
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: color,
        alignSelf: 'flex-start',
      }}>
        <Text style={{
          fontSize: theme.typography.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: color,
          textTransform: 'uppercase',
        }}>
          {status.replace('_', ' ')}
        </Text>
      </View>
    );
  };

  const handleCompleteOrder = () => {
    if (!order) return;
    
    Alert.alert(
      'Complete Order',
      'Are you sure you want to mark this order as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              await markOrderAsCompleted(order.id);
              await loadOrder(); // Refresh order data
            } catch (error) {
              Alert.alert('Error', 'Failed to complete order');
            }
          }
        }
      ]
    );
  };

  const handleCancelOrder = () => {
    if (!order) return;
    
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
              await markOrderAsCancelled(order.id);
              await loadOrder(); // Refresh order data
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel order');
            }
          }
        }
      ]
    );
  };

  const handleRefundOrder = () => {
    if (!order) return;
    
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
              await markOrderAsRefunded(order.id);
              await loadOrder(); // Refresh order data
            } catch (error) {
              Alert.alert('Error', 'Failed to refund order');
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <Text style={{
            fontSize: theme.typography.lg,
            color: theme.colors.mutedForeground,
          }}>
            Loading order details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
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
            fontSize: theme.typography.lg,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.foreground,
            marginBottom: theme.spacing[2],
          }}>
            Order Not Found
          </Text>
          <Text style={{
            fontSize: theme.typography.sm,
            color: theme.colors.mutedForeground,
            textAlign: 'center',
            marginBottom: theme.spacing[4],
          }}>
            The requested order could not be found.
          </Text>
          <IconButton
            variant="outline"
            onPress={() => router.back()}
            iconName="arrow-back"
            iconFamily="MaterialIcons"
          >
            Go Back
          </IconButton>
        </View>
      </SafeAreaView>
    );
  }

  const canComplete = order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING;
  const canCancel = order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING;
  const canRefund = order.status === OrderStatus.COMPLETED;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing[4] }}
      >
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: theme.spacing[4] 
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: theme.typography['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.foreground,
            }}>
              {order.orderNumber}
            </Text>
            <Text style={{
              fontSize: theme.typography.sm,
              color: theme.colors.mutedForeground,
              marginTop: theme.spacing[1],
            }}>
              Created {formatDate(order.createdAt)}
            </Text>
          </View>
          <IconButton
            variant="ghost"
            size="sm"
            onPress={() => router.back()}
            iconName="close"
            iconFamily="MaterialIcons"
          />
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

        {/* Order Status */}
        <Card style={{ marginBottom: theme.spacing[4] }}>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ gap: theme.spacing[3] }}>
              <View style={{ flexDirection: 'row', gap: theme.spacing[3] }}>
                {getStatusBadge(order.status)}
                {getPaymentBadge(order.paymentStatus)}
              </View>
              
              {order.completedAt && (
                <Text style={{
                  fontSize: theme.typography.sm,
                  color: theme.colors.mutedForeground,
                }}>
                  Completed: {formatDate(order.completedAt)}
                </Text>
              )}
              
              {order.cancelledAt && (
                <Text style={{
                  fontSize: theme.typography.sm,
                  color: theme.colors.mutedForeground,
                }}>
                  Cancelled: {formatDate(order.cancelledAt)}
                </Text>
              )}
              
              {order.refundedAt && (
                <Text style={{
                  fontSize: theme.typography.sm,
                  color: theme.colors.mutedForeground,
                }}>
                  Refunded: {formatDate(order.refundedAt)}
                </Text>
              )}
            </View>
          </CardContent>
        </Card>

        {/* Customer Information */}
        {order.customer && (
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <View style={{ gap: theme.spacing[2] }}>
                <Text style={{
                  fontSize: theme.typography.base,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.foreground,
                }}>
                  {order.customer.name}
                </Text>
                <Text style={{
                  fontSize: theme.typography.sm,
                  color: theme.colors.mutedForeground,
                }}>
                  Phone: {order.customer.phone}
                </Text>
                {order.customer.email && (
                  <Text style={{
                    fontSize: theme.typography.sm,
                    color: theme.colors.mutedForeground,
                  }}>
                    Email: {order.customer.email}
                  </Text>
                )}
                {order.customer.companyName && (
                  <Text style={{
                    fontSize: theme.typography.sm,
                    color: theme.colors.mutedForeground,
                  }}>
                    Company: {order.customer.companyName}
                  </Text>
                )}
                {order.customer.taxId && (
                  <Text style={{
                    fontSize: theme.typography.sm,
                    color: theme.colors.mutedForeground,
                  }}>
                    Tax ID: {order.customer.taxId}
                  </Text>
                )}
              </View>
            </CardContent>
          </Card>
        )}

        {/* Order Items */}
        <Card style={{ marginBottom: theme.spacing[4] }}>
          <CardHeader>
            <CardTitle>Items ({order.items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ gap: theme.spacing[3] }}>
              {order.items.map((item, index) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    paddingBottom: theme.spacing[3],
                    borderBottomWidth: index < order.items.length - 1 ? 1 : 0,
                    borderBottomColor: theme.colors.border,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: theme.typography.base,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.foreground,
                    }}>
                      {item.productName}
                    </Text>
                    <Text style={{
                      fontSize: theme.typography.sm,
                      color: theme.colors.mutedForeground,
                      marginTop: theme.spacing[1],
                    }}>
                      SKU: {item.productSku}
                    </Text>
                    <Text style={{
                      fontSize: theme.typography.sm,
                      color: theme.colors.mutedForeground,
                    }}>
                      {item.productCategory} • {item.productSize}kg • {item.productBrand.toUpperCase()}
                    </Text>
                    <Text style={{
                      fontSize: theme.typography.sm,
                      color: theme.colors.mutedForeground,
                      marginTop: theme.spacing[1],
                    }}>
                      ${item.unitPrice.toFixed(2)} × {item.quantity}
                    </Text>
                  </View>
                  <Text style={{
                    fontSize: theme.typography.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.foreground,
                  }}>
                    ${item.subtotal.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card style={{ marginBottom: theme.spacing[4] }}>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ gap: theme.spacing[3] }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: theme.colors.foreground }}>Subtotal:</Text>
                <Text style={{ color: theme.colors.foreground }}>${order.subtotal.toFixed(2)}</Text>
              </View>
              {order.discountPercentage > 0 && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.colors.mutedForeground }}>
                    Discount ({order.discountPercentage}%):
                  </Text>
                  <Text style={{ color: theme.colors.mutedForeground }}>
                    -${order.discountAmount.toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
                paddingTop: theme.spacing[3],
              }}>
                <Text style={{
                  fontSize: theme.typography.lg,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.foreground,
                }}>
                  Total:
                </Text>
                <Text style={{
                  fontSize: theme.typography.lg,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.foreground,
                }}>
                  ${order.total.toFixed(2)}
                </Text>
              </View>
              {order.paymentMethod && (
                <Text style={{
                  fontSize: theme.typography.sm,
                  color: theme.colors.mutedForeground,
                }}>
                  Payment Method: {order.paymentMethod.replace('_', ' ').toUpperCase()}
                </Text>
              )}
            </View>
          </CardContent>
        </Card>

        {/* Notes */}
        {order.notes && (
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.foreground,
                fontStyle: 'italic',
              }}>
                "{order.notes}"
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={{ gap: theme.spacing[3] }}>
          {canComplete && (
            <IconButton
              variant="default"
              onPress={handleCompleteOrder}
              iconName="check-circle"
              iconFamily="MaterialIcons"
              iconPosition="left"
            >
              Mark as Completed
            </IconButton>
          )}
          {canCancel && (
            <IconButton
              variant="outline"
              onPress={handleCancelOrder}
              iconName="cancel"
              iconFamily="MaterialIcons"
              iconPosition="left"
            >
              Cancel Order
            </IconButton>
          )}
          {canRefund && (
            <IconButton
              variant="outline"
              onPress={handleRefundOrder}
              iconName="undo"
              iconFamily="MaterialIcons"
              iconPosition="left"
            >
              Refund Order
            </IconButton>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: theme.spacing[6] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Export the component wrapped with authentication
export default withAuth(OrderDetailsScreen);