import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { useTheme } from '../theme';
import { OrderSummary } from '../types/order';

interface OrderSummaryCardProps {
  summary: OrderSummary;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ summary }) => {
  const theme = useTheme();

  const summaryItems = [
    {
      label: 'Total Orders',
      value: summary.totalOrders.toString(),
      color: theme.colors.primary,
      icon: '📊'
    },
    {
      label: 'Total Revenue',
      value: `$${summary.totalRevenue.toFixed(2)}`,
      color: theme.colors.primary,
      icon: '💰'
    },
    {
      label: 'Pending',
      value: summary.pendingOrders.toString(),
      color: '#f59e0b', // amber
      icon: '⏳'
    },
    {
      label: 'Completed',
      value: summary.completedOrders.toString(),
      color: '#10b981', // emerald
      icon: '✅'
    },
    {
      label: 'Cancelled',
      value: summary.cancelledOrders.toString(),
      color: '#ef4444', // red
      icon: '❌'
    }
  ];

  return (
    <Card style={{ marginBottom: theme.spacing[4] }}>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap',
          gap: theme.spacing[3]
        }}>
          {summaryItems.map((item, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                minWidth: 80,
                alignItems: 'center',
                padding: theme.spacing[3],
                backgroundColor: theme.colors.muted,
                borderRadius: theme.borderRadius.md,
                borderWidth: 1,
                borderColor: item.color + '30', // Add transparency
              }}
            >
              <Text style={{ fontSize: 20, marginBottom: theme.spacing[1] }}>
                {item.icon}
              </Text>
              <Text style={{
                fontSize: theme.typography.lg,
                fontWeight: theme.typography.fontWeight.bold,
                color: item.color,
                textAlign: 'center',
              }}>
                {item.value}
              </Text>
              <Text style={{
                fontSize: theme.typography.xs,
                color: theme.colors.mutedForeground,
                textAlign: 'center',
                marginTop: theme.spacing[1],
              }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  );
};