import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Order, 
  CreateOrderData, 
  UpdateOrderData, 
  OrderStatus,
  OrderSummary,
  OrderFilters
} from '../types/order';
import { orderService } from '../services/orderService';

interface OrderContextType {
  // State
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  summary: OrderSummary | null;

  // Actions
  loadOrders: () => Promise<void>;
  createOrder: (orderData: CreateOrderData) => Promise<Order>;
  updateOrder: (orderData: UpdateOrderData) => Promise<Order>;
  deleteOrder: (id: string) => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  searchOrders: (query: string) => Promise<void>;
  filterOrders: (filters: OrderFilters) => Promise<void>;
  markOrderAsCompleted: (id: string) => Promise<void>;
  markOrderAsCancelled: (id: string) => Promise<void>;
  markOrderAsRefunded: (id: string) => Promise<void>;
  loadOrderSummary: () => Promise<void>;
  clearError: () => void;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<OrderSummary | null>(null);

  // Load all orders
  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedOrders = await orderService.getAllOrders();
      setOrders(loadedOrders);
      console.log('Orders loaded successfully:', loadedOrders.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load orders';
      setError(errorMessage);
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new order
  const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
    setError(null);
    try {
      const newOrder = await orderService.createOrder(orderData);
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      console.log('Order created successfully:', newOrder.orderNumber);
      
      // Refresh summary after creating order
      await loadOrderSummary();
      
      return newOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      console.error('Error creating order:', err);
      throw err;
    }
  };

  // Update an existing order
  const updateOrder = async (orderData: UpdateOrderData): Promise<Order> => {
    setError(null);
    try {
      const updatedOrder = await orderService.updateOrder(orderData);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      console.log('Order updated successfully:', updatedOrder.orderNumber);
      
      // Refresh summary after updating order
      await loadOrderSummary();
      
      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order';
      setError(errorMessage);
      console.error('Error updating order:', err);
      throw err;
    }
  };

  // Delete an order
  const deleteOrder = async (id: string): Promise<void> => {
    setError(null);
    try {
      await orderService.deleteOrder(id);
      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
      console.log('Order deleted successfully:', id);
      
      // Refresh summary after deleting order
      await loadOrderSummary();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete order';
      setError(errorMessage);
      console.error('Error deleting order:', err);
      throw err;
    }
  };

  // Get order by ID
  const getOrderById = async (id: string): Promise<Order | null> => {
    setError(null);
    try {
      return await orderService.getOrderById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get order';
      setError(errorMessage);
      console.error('Error getting order:', err);
      return null;
    }
  };

  // Search orders
  const searchOrders = async (query: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const searchResults = await orderService.searchOrders(query);
      setOrders(searchResults);
      console.log('Order search completed:', searchResults.length, 'results');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search orders';
      setError(errorMessage);
      console.error('Error searching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders
  const filterOrders = async (filters: OrderFilters): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const filteredResults = await orderService.filterOrders(filters);
      setOrders(filteredResults);
      console.log('Order filter completed:', filteredResults.length, 'results');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to filter orders';
      setError(errorMessage);
      console.error('Error filtering orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark order as completed
  const markOrderAsCompleted = async (id: string): Promise<void> => {
    setError(null);
    try {
      const updatedOrder = await orderService.markOrderAsCompleted(id);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      console.log('Order marked as completed:', updatedOrder.orderNumber);
      
      // Refresh summary after status change
      await loadOrderSummary();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete order';
      setError(errorMessage);
      console.error('Error completing order:', err);
      throw err;
    }
  };

  // Mark order as cancelled
  const markOrderAsCancelled = async (id: string): Promise<void> => {
    setError(null);
    try {
      const updatedOrder = await orderService.markOrderAsCancelled(id);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      console.log('Order marked as cancelled:', updatedOrder.orderNumber);
      
      // Refresh summary after status change
      await loadOrderSummary();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order';
      setError(errorMessage);
      console.error('Error cancelling order:', err);
      throw err;
    }
  };

  // Mark order as refunded
  const markOrderAsRefunded = async (id: string): Promise<void> => {
    setError(null);
    try {
      const updatedOrder = await orderService.markOrderAsRefunded(id);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      console.log('Order marked as refunded:', updatedOrder.orderNumber);
      
      // Refresh summary after status change
      await loadOrderSummary();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refund order';
      setError(errorMessage);
      console.error('Error refunding order:', err);
      throw err;
    }
  };

  // Load order summary
  const loadOrderSummary = async (): Promise<void> => {
    try {
      const orderSummary = await orderService.getOrderSummary();
      setSummary(orderSummary);
      console.log('Order summary loaded:', orderSummary);
    } catch (err) {
      console.error('Error loading order summary:', err);
      // Don't set error state for summary loading failure
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Refresh orders (reload from storage)
  const refreshOrders = async (): Promise<void> => {
    await loadOrders();
    await loadOrderSummary();
  };

  // Load orders and summary on mount
  useEffect(() => {
    loadOrders();
    loadOrderSummary();
  }, []);

  const contextValue: OrderContextType = {
    // State
    orders,
    isLoading,
    error,
    summary,

    // Actions
    loadOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    searchOrders,
    filterOrders,
    markOrderAsCompleted,
    markOrderAsCancelled,
    markOrderAsRefunded,
    loadOrderSummary,
    clearError,
    refreshOrders,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the OrderContext
export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;