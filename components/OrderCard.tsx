import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { IconButton } from './IconButton';
import { useTheme } from '../theme';
import { Order, OrderStatus, getOrderStatusColor, getPaymentStatusColor } from '../types/order';
import { useTranslation } from 'react-i18next';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
  onMarkAsCompleted?: (id: string) => void;
  onMarkAsCancelled?: (id: string) => void;
  onMarkAsRefunded?: (id: string) => void;
  showActions?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  onMarkAsCompleted,
  onMarkAsCancelled,
  onMarkAsRefunded,
  showActions = true
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    const color = getOrderStatusColor(status);
    return (
      <View style={{
        backgroundColor: color + '20', // Add transparency
        paddingHorizontal: theme.spacing[2],
        paddingVertical: theme.spacing[1],
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: color,
      }}>
        <Text style={{
          fontSize: theme.typography.xs,
          fontWeight: theme.typography.fontWeight.medium,
          color: color,
          textTransform: 'uppercase',
        }}>
          {t(`orderStatus.${status}`)}
        </Text>
      </View>
    );
  };

  const getPaymentBadge = (status: string) => {
    const color = getPaymentStatusColor(status as any);
    return (
      <View style={{
        backgroundColor: color + '20', // Add transparency
        paddingHorizontal: theme.spacing[2],
        paddingVertical: theme.spacing[1],
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: color,
      }}>
        <Text style={{
          fontSize: theme.typography.xs,
          fontWeight: theme.typography.fontWeight.medium,
          color: color,
          textTransform: 'uppercase',
        }}>
          {t(`paymentStatus.${status}`)}
        </Text>
      </View>
    );
  };

  const canComplete = order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING;
  const canCancel = order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING;
  const canRefund = order.status === OrderStatus.COMPLETED;

  return (
    <Card style={{ marginBottom: theme.spacing[3] }}>
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        <CardHeader>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <CardTitle>{order.orderNumber}</CardTitle>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.mutedForeground,
                marginTop: theme.spacing[1],
              }}>
                {formatDate(order.createdAt)}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: theme.spacing[1] }}>
              {getStatusBadge(order.status)}
              {getPaymentBadge(order.paymentStatus)}
            </View>
          </View>
        </CardHeader>

        <CardContent>
          {/* Customer Information */}
          {order.customer && (
            <View style={{ marginBottom: theme.spacing[3] }}>
              <Text style={{
                fontSize: theme.typography.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.foreground,
              }}>
                {order.customer.name}
              </Text>
              <Text style={{
                fontSize: theme.typography.xs,
                color: theme.colors.mutedForeground,
              }}>
                {order.customer.phone}
                {order.customer.companyName && ` • ${order.customer.companyName}`}
              </Text>
            </View>
          )}

          {/* Order Items Summary */}
          <View style={{ marginBottom: theme.spacing[3] }}>
            <Text style={{
              fontSize: theme.typography.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.foreground,
              marginBottom: theme.spacing[1],
            }}>
              Items ({order.items.length})
            </Text>
            {order.items.slice(0, 2).map((item, index) => (
              <Text
                key={item.id}
                style={{
                  fontSize: theme.typography.xs,
                  color: theme.colors.mutedForeground,
                }}
              >
                {item.quantity}× {item.productName} - ${item.subtotal.toFixed(2)}
              </Text>
            ))}
            {order.items.length > 2 && (
              <Text style={{
                fontSize: theme.typography.xs,
                color: theme.colors.primary,
                fontStyle: 'italic',
              }}>
                +{order.items.length - 2} more items
              </Text>
            )}
          </View>

          {/* Payment Method */}
          {order.paymentMethod && (
            <View style={{ marginBottom: theme.spacing[3] }}>
              <Text style={{
                fontSize: theme.typography.xs,
                color: theme.colors.mutedForeground,
              }}>
                Payment: {order.paymentMethod.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          )}

          {/* Total */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            paddingTop: theme.spacing[3],
            marginBottom: showActions ? theme.spacing[3] : 0,
          }}>
            <View>
              <Text style={{
                fontSize: theme.typography.lg,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.foreground,
              }}>
                ${order.total.toFixed(2)}
              </Text>
              {order.discountPercentage > 0 && (
                <Text style={{
                  fontSize: theme.typography.xs,
                  color: theme.colors.mutedForeground,
                }}>
                  Discount: {order.discountPercentage}%
                </Text>
              )}
            </View>
            {order.notes && (
              <Text style={{
                fontSize: theme.typography.xs,
                color: theme.colors.mutedForeground,
                fontStyle: 'italic',
                maxWidth: 150,
              }}>
                "{order.notes}"
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          {showActions && (
            <View style={{ 
              flexDirection: 'row', 
              gap: theme.spacing[2],
              flexWrap: 'wrap'
            }}>
              {canComplete && onMarkAsCompleted && (
                <IconButton
                  variant="default"
                  size="sm"
                  onPress={() => onMarkAsCompleted(order.id)}
                  iconName="check-circle"
                  iconFamily="MaterialIcons"
                  style={{ flex: 1, minWidth: 100 }}
                >
                  Complete
                </IconButton>
              )}
              {canCancel && onMarkAsCancelled && (
                <IconButton
                  variant="outline"
                  size="sm"
                  onPress={() => onMarkAsCancelled(order.id)}
                  iconName="cancel"
                  iconFamily="MaterialIcons"
                  style={{ flex: 1, minWidth: 100 }}
                >
                  Cancel
                </IconButton>
              )}
              {canRefund && onMarkAsRefunded && (
                <IconButton
                  variant="outline"
                  size="sm"
                  onPress={() => onMarkAsRefunded(order.id)}
                  iconName="undo"
                  iconFamily="MaterialIcons"
                  style={{ flex: 1, minWidth: 100 }}
                >
                  Refund
                </IconButton>
              )}
            </View>
          )}
        </CardContent>
      </Pressable>
    </Card>
  );
};