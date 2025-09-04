import * as SecureStore from 'expo-secure-store';
import { 
  Order, 
  CreateOrderData, 
  UpdateOrderData, 
  OrderStatus, 
  PaymentStatus, 
  OrderSummary,
  OrderFilters,
  generateOrderNumber,
  OrderItem,
  PaymentMethod
} from '../types/order';

const ORDERS_STORAGE_KEY = 'orders_data';

class OrderServiceClass {
  private orders: Order[] = [];
  private isLoaded = false;

  // Load orders from secure storage
  private async loadOrders(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const ordersData = await SecureStore.getItemAsync(ORDERS_STORAGE_KEY);
      if (ordersData) {
        const parsedOrders = JSON.parse(ordersData);
        // Convert date strings back to Date objects
        this.orders = parsedOrders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
          completedAt: order.completedAt ? new Date(order.completedAt) : undefined,
          cancelledAt: order.cancelledAt ? new Date(order.cancelledAt) : undefined,
          refundedAt: order.refundedAt ? new Date(order.refundedAt) : undefined,
        }));
      } else {
        // Generate sample orders if none exist
        this.orders = this.generateSampleOrders();
        await this.saveOrders();
      }
      this.isLoaded = true;
    } catch (error) {
      console.error('Error loading orders:', error);
      this.orders = this.generateSampleOrders();
      this.isLoaded = true;
    }
  }

  // Save orders to secure storage
  private async saveOrders(): Promise<void> {
    try {
      await SecureStore.setItemAsync(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
    } catch (error) {
      console.error('Error saving orders:', error);
      throw new Error('Failed to save orders');
    }
  }

  // Generate sample orders for testing
  private generateSampleOrders(): Order[] {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    return [
      {
        id: '1',
        orderNumber: 'ORD24010001',
        status: OrderStatus.COMPLETED,
        items: [
          {
            id: '1',
            productId: 'prod-1',
            productName: 'Premium Dog Food',
            productSku: 'PET-001',
            unitPrice: 25.99,
            quantity: 2,
            subtotal: 51.98,
            productBrand: 'ptt',
            productCategory: 'Pet Food',
            productSize: 15
          },
          {
            id: '2',
            productId: 'prod-2',
            productName: 'Cat Treats',
            productSku: 'PET-002',
            unitPrice: 12.50,
            quantity: 1,
            subtotal: 12.50,
            productBrand: 'pt',
            productCategory: 'Pet Treats',
            productSize: 4
          }
        ],
        customer: {
          id: 'cust-1',
          name: 'John Doe',
          phone: '+1234567890',
          email: 'john@example.com'
        },
        subtotal: 64.48,
        discountPercentage: 10,
        discountAmount: 6.45,
        total: 58.03,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentStatus: PaymentStatus.PAID,
        notes: 'Customer requested delivery',
        createdAt: twoDaysAgo,
        updatedAt: twoDaysAgo,
        completedAt: twoDaysAgo,
        createdBy: 'user-1'
      },
      {
        id: '2',
        orderNumber: 'ORD24010002',
        status: OrderStatus.PROCESSING,
        items: [
          {
            id: '3',
            productId: 'prod-3',
            productName: 'Bird Seed Mix',
            productSku: 'PET-003',
            unitPrice: 18.75,
            quantity: 3,
            subtotal: 56.25,
            productBrand: 'world',
            productCategory: 'Bird Food',
            productSize: 8
          }
        ],
        customer: {
          id: 'cust-2',
          name: 'Jane Smith',
          phone: '+1987654321',
          companyName: 'Pet Paradise Inc.'
        },
        subtotal: 56.25,
        discountPercentage: 0,
        discountAmount: 0,
        total: 56.25,
        paymentMethod: PaymentMethod.CASH,
        paymentStatus: PaymentStatus.PAID,
        createdAt: yesterday,
        updatedAt: yesterday,
        createdBy: 'user-1'
      },
      {
        id: '3',
        orderNumber: 'ORD24010003',
        status: OrderStatus.PENDING,
        items: [
          {
            id: '4',
            productId: 'prod-4',
            productName: 'Fish Tank Cleaner',
            productSku: 'PET-004',
            unitPrice: 32.99,
            quantity: 1,
            subtotal: 32.99,
            productBrand: 'ptt',
            productCategory: 'Aquarium',
            productSize: 12.5
          }
        ],
        subtotal: 32.99,
        discountPercentage: 5,
        discountAmount: 1.65,
        total: 31.34,
        paymentMethod: PaymentMethod.DIGITAL_WALLET,
        paymentStatus: PaymentStatus.PENDING,
        notes: 'Customer will pick up tomorrow',
        createdAt: now,
        updatedAt: now,
        createdBy: 'user-1'
      }
    ];
  }

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    await this.loadOrders();
    return [...this.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get order by ID
  async getOrderById(id: string): Promise<Order | null> {
    await this.loadOrders();
    return this.orders.find(order => order.id === id) || null;
  }

  // Get order by order number
  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    await this.loadOrders();
    return this.orders.find(order => order.orderNumber === orderNumber) || null;
  }

  // Create a new order
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    await this.loadOrders();

    // Generate order items with IDs
    const orderItems: OrderItem[] = orderData.items.map(item => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    }));

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discountPercentage = orderData.discountPercentage || 0;
    const discountAmount = subtotal * discountPercentage / 100;
    const total = subtotal - discountAmount;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: generateOrderNumber(),
      status: OrderStatus.PENDING,
      items: orderItems,
      customer: orderData.customer,
      subtotal,
      discountPercentage,
      discountAmount,
      total,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod ? PaymentStatus.PAID : PaymentStatus.PENDING,
      notes: orderData.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user' // In a real app, this would be the authenticated user ID
    };

    this.orders.push(newOrder);
    await this.saveOrders();
    return newOrder;
  }

  // Update an order
  async updateOrder(orderData: UpdateOrderData): Promise<Order> {
    await this.loadOrders();

    const orderIndex = this.orders.findIndex(order => order.id === orderData.id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const existingOrder = this.orders[orderIndex];
    const updatedOrder: Order = {
      ...existingOrder,
      ...orderData,
      updatedAt: new Date()
    };

    // Recalculate totals if items or discount changed
    if (orderData.items || orderData.discountPercentage !== undefined) {
      const items = orderData.items || existingOrder.items;
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const discountPercentage = orderData.discountPercentage !== undefined 
        ? orderData.discountPercentage 
        : existingOrder.discountPercentage;
      const discountAmount = subtotal * discountPercentage / 100;
      const total = subtotal - discountAmount;

      updatedOrder.subtotal = subtotal;
      updatedOrder.discountPercentage = discountPercentage;
      updatedOrder.discountAmount = discountAmount;
      updatedOrder.total = total;
    }

    this.orders[orderIndex] = updatedOrder;
    await this.saveOrders();
    return updatedOrder;
  }

  // Delete an order
  async deleteOrder(id: string): Promise<void> {
    await this.loadOrders();

    const orderIndex = this.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    this.orders.splice(orderIndex, 1);
    await this.saveOrders();
  }

  // Search orders by query
  async searchOrders(query: string): Promise<Order[]> {
    await this.loadOrders();

    if (!query.trim()) return this.getAllOrders();

    const lowercaseQuery = query.toLowerCase();
    return this.orders.filter(order =>
      order.orderNumber.toLowerCase().includes(lowercaseQuery) ||
      order.customer?.name.toLowerCase().includes(lowercaseQuery) ||
      order.customer?.phone.includes(lowercaseQuery) ||
      order.customer?.email?.toLowerCase().includes(lowercaseQuery) ||
      order.items.some(item => 
        item.productName.toLowerCase().includes(lowercaseQuery) ||
        item.productSku.toLowerCase().includes(lowercaseQuery)
      )
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get orders by customer
  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    await this.loadOrders();
    return this.orders.filter(order => order.customer?.id === customerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get orders by status
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    await this.loadOrders();
    return this.orders.filter(order => order.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get orders by date range
  async getOrdersByDateRange(dateFrom: Date, dateTo: Date): Promise<Order[]> {
    await this.loadOrders();
    return this.orders.filter(order => 
      order.createdAt >= dateFrom && order.createdAt <= dateTo
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get order summary statistics
  async getOrderSummary(): Promise<OrderSummary> {
    await this.loadOrders();

    const totalOrders = this.orders.length;
    const totalRevenue = this.orders
      .filter(order => order.status === OrderStatus.COMPLETED)
      .reduce((sum, order) => sum + order.total, 0);
    
    const pendingOrders = this.orders.filter(order => order.status === OrderStatus.PENDING).length;
    const completedOrders = this.orders.filter(order => order.status === OrderStatus.COMPLETED).length;
    const cancelledOrders = this.orders.filter(order => order.status === OrderStatus.CANCELLED).length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      cancelledOrders
    };
  }

  // Mark order as completed
  async markOrderAsCompleted(id: string): Promise<Order> {
    const order = await this.updateOrder({
      id,
      status: OrderStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      completedAt: new Date()
    });
    return order;
  }

  // Mark order as cancelled
  async markOrderAsCancelled(id: string): Promise<Order> {
    const order = await this.updateOrder({
      id,
      status: OrderStatus.CANCELLED,
      cancelledAt: new Date()
    });
    return order;
  }

  // Mark order as refunded
  async markOrderAsRefunded(id: string): Promise<Order> {
    const order = await this.updateOrder({
      id,
      status: OrderStatus.REFUNDED,
      paymentStatus: PaymentStatus.REFUNDED,
      refundedAt: new Date()
    });
    return order;
  }

  // Filter orders based on criteria
  async filterOrders(filters: OrderFilters): Promise<Order[]> {
    await this.loadOrders();

    let filteredOrders = [...this.orders];

    if (filters.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }

    if (filters.paymentStatus) {
      filteredOrders = filteredOrders.filter(order => order.paymentStatus === filters.paymentStatus);
    }

    if (filters.paymentMethod) {
      filteredOrders = filteredOrders.filter(order => order.paymentMethod === filters.paymentMethod);
    }

    if (filters.customerId) {
      filteredOrders = filteredOrders.filter(order => order.customer?.id === filters.customerId);
    }

    if (filters.dateFrom && filters.dateTo) {
      filteredOrders = filteredOrders.filter(order => 
        order.createdAt >= filters.dateFrom! && order.createdAt <= filters.dateTo!
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer?.name.toLowerCase().includes(query) ||
        order.customer?.phone.includes(query) ||
        order.items.some(item => 
          item.productName.toLowerCase().includes(query) ||
          item.productSku.toLowerCase().includes(query)
        )
      );
    }

    return filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Clear all orders (useful for testing)
  async clearAllOrders(): Promise<void> {
    this.orders = [];
    await this.saveOrders();
  }
}

// Export singleton instance
export const orderService = new OrderServiceClass();