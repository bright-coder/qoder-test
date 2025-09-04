// Order type definitions and constants

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded'
}

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    QRCODE = 'qrcode',
    BANK_TRANSFER = 'bank_transfer'
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    PARTIALLY_PAID = 'partially_paid',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    productSku: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    productBrand: string;
    productCategory: string;
    productSize: number;
}

export interface OrderCustomer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    companyName?: string;
    taxId?: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    items: OrderItem[];
    customer?: OrderCustomer;
    subtotal: number;
    discountPercentage: number;
    discountAmount: number;
    total: number;
    paymentMethod?: PaymentMethod;
    paymentStatus: PaymentStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string; // User ID who created the order
    completedAt?: Date;
    cancelledAt?: Date;
    refundedAt?: Date;
}

export interface CreateOrderData {
    items: Omit<OrderItem, 'id'>[];
    customer?: OrderCustomer;
    discountPercentage?: number;
    paymentMethod?: PaymentMethod;
    notes?: string;
}

export interface UpdateOrderData {
    id: string;
    status?: OrderStatus;
    items?: OrderItem[];
    customer?: OrderCustomer;
    discountPercentage?: number;
    paymentMethod?: PaymentMethod;
    paymentStatus?: PaymentStatus;
    notes?: string;
    completedAt?: Date;
    cancelledAt?: Date;
    refundedAt?: Date;
}

export interface OrderFormData {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    discountPercentage: string;
    paymentMethod: PaymentMethod;
    notes?: string;
}

export interface OrderSummary {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
}

export interface OrderFilters {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    dateFrom?: Date;
    dateTo?: Date;
    customerId?: string;
    searchQuery?: string;
}

// Service interface for order operations
export interface OrderService {
    getAllOrders(): Promise<Order[]>;
    getOrderById(id: string): Promise<Order | null>;
    getOrderByNumber(orderNumber: string): Promise<Order | null>;
    createOrder(order: CreateOrderData): Promise<Order>;
    updateOrder(order: UpdateOrderData): Promise<Order>;
    deleteOrder(id: string): Promise<void>;
    searchOrders(query: string): Promise<Order[]>;
    getOrdersByCustomer(customerId: string): Promise<Order[]>;
    getOrdersByStatus(status: OrderStatus): Promise<Order[]>;
    getOrdersByDateRange(dateFrom: Date, dateTo: Date): Promise<Order[]>;
    getOrderSummary(): Promise<OrderSummary>;
    markOrderAsCompleted(id: string): Promise<Order>;
    markOrderAsCancelled(id: string): Promise<Order>;
    markOrderAsRefunded(id: string): Promise<Order>;
}

// Order status options for dropdowns
export const ORDER_STATUSES = Object.values(OrderStatus);
export const PAYMENT_METHODS = Object.values(PaymentMethod);
export const PAYMENT_STATUSES = Object.values(PaymentStatus);

// Helper functions for order status
export const getOrderStatusColor = (status: OrderStatus): string => {
    switch (status) {
        case OrderStatus.PENDING:
            return '#f59e0b'; // amber
        case OrderStatus.PROCESSING:
            return '#3b82f6'; // blue
        case OrderStatus.COMPLETED:
            return '#10b981'; // emerald
        case OrderStatus.CANCELLED:
            return '#ef4444'; // red
        case OrderStatus.REFUNDED:
            return '#8b5cf6'; // violet
        default:
            return '#6b7280'; // gray
    }
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
    switch (status) {
        case PaymentStatus.PENDING:
            return '#f59e0b'; // amber
        case PaymentStatus.PAID:
            return '#10b981'; // emerald
        case PaymentStatus.PARTIALLY_PAID:
            return '#3b82f6'; // blue
        case PaymentStatus.FAILED:
            return '#ef4444'; // red
        case PaymentStatus.REFUNDED:
            return '#8b5cf6'; // violet
        default:
            return '#6b7280'; // gray
    }
};

// Localized status getters - these functions should be used with translation
export const getOrderStatusText = (status: OrderStatus, t: (key: string) => string): string => {
    return t(`orderStatus.${status}`);
};

export const getPaymentStatusText = (status: PaymentStatus, t: (key: string) => string): string => {
    return t(`paymentStatus.${status}`);
};

export const getPaymentMethodText = (method: PaymentMethod, t: (key: string) => string): string => {
    return t(`paymentMethod.${method}`);
};

// Order number generation helper
export const generateOrderNumber = (): string => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${year}${month}${day}${random}`;
};