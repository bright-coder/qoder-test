import * as SecureStore from 'expo-secure-store';
import { Customer, CreateCustomerData, UpdateCustomerData, CustomerService } from '../types/customer';

// Mock customer service with secure storage
class CustomerServiceImpl implements CustomerService {
  private static readonly STORAGE_KEY = 'customers_data';

  // Simulate API delay
  private async delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate a unique ID for new customers
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Get all customers from secure storage
  private async getCustomersFromStorage(): Promise<Customer[]> {
    try {
      const data = await SecureStore.getItemAsync(CustomerServiceImpl.STORAGE_KEY);
      if (!data) return [];
      
      const customers = JSON.parse(data);
      // Convert date strings back to Date objects
      return customers.map((customer: any) => ({
        ...customer,
        createdAt: new Date(customer.createdAt),
        updatedAt: new Date(customer.updatedAt),
      }));
    } catch (error) {
      console.error('Error reading customers from storage:', error);
      return [];
    }
  }

  // Save customers to secure storage
  private async saveCustomersToStorage(customers: Customer[]): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        CustomerServiceImpl.STORAGE_KEY, 
        JSON.stringify(customers)
      );
    } catch (error) {
      console.error('Error saving customers to storage:', error);
      throw new Error('Failed to save customer data');
    }
  }

  // Validate customer data
  private validateCustomer(customer: CreateCustomerData): void {
    if (!customer.name?.trim()) {
      throw new Error('Customer name is required');
    }
    
    if (!customer.phone?.trim()) {
      throw new Error('Customer phone is required');
    }

    // Basic phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(customer.phone)) {
      throw new Error('Please enter a valid phone number');
    }

    // Email validation if provided
    if (customer.email && customer.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customer.email)) {
        throw new Error('Please enter a valid email address');
      }
    }

    // Location validation if provided
    if (customer.location) {
      if (customer.location.lat < -90 || customer.location.lat > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }
      if (customer.location.lng < -180 || customer.location.lng > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }
    }
  }

  async getAllCustomers(): Promise<Customer[]> {
    await this.delay();
    return this.getCustomersFromStorage();
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    await this.delay();
    const customers = await this.getCustomersFromStorage();
    return customers.find(customer => customer.id === id) || null;
  }

  async createCustomer(customerData: CreateCustomerData): Promise<Customer> {
    await this.delay();
    
    // Validate customer data
    this.validateCustomer(customerData);
    
    const customers = await this.getCustomersFromStorage();
    
    // Check for duplicate phone numbers
    const existingCustomer = customers.find(c => c.phone === customerData.phone);
    if (existingCustomer) {
      throw new Error('A customer with this phone number already exists');
    }
    
    const newCustomer: Customer = {
      id: this.generateId(),
      name: customerData.name.trim(),
      phone: customerData.phone.trim(),
      addressLine: customerData.addressLine?.trim() || undefined,
      email: customerData.email?.trim() || undefined,
      location: customerData.location || undefined,
      taxId: customerData.taxId?.trim() || undefined,
      companyName: customerData.companyName?.trim() || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    customers.push(newCustomer);
    await this.saveCustomersToStorage(customers);
    
    return newCustomer;
  }

  async updateCustomer(customerData: UpdateCustomerData): Promise<Customer> {
    await this.delay();
    
    // Validate customer data
    this.validateCustomer(customerData);
    
    const customers = await this.getCustomersFromStorage();
    const customerIndex = customers.findIndex(c => c.id === customerData.id);
    
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }
    
    // Check for duplicate phone numbers (excluding current customer)
    const existingCustomer = customers.find(c => 
      c.phone === customerData.phone && c.id !== customerData.id
    );
    if (existingCustomer) {
      throw new Error('A customer with this phone number already exists');
    }
    
    const updatedCustomer: Customer = {
      ...customers[customerIndex],
      name: customerData.name.trim(),
      phone: customerData.phone.trim(),
      addressLine: customerData.addressLine?.trim() || undefined,
      email: customerData.email?.trim() || undefined,
      location: customerData.location || undefined,
      taxId: customerData.taxId?.trim() || undefined,
      companyName: customerData.companyName?.trim() || undefined,
      updatedAt: new Date(),
    };
    
    customers[customerIndex] = updatedCustomer;
    await this.saveCustomersToStorage(customers);
    
    return updatedCustomer;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.delay();
    
    const customers = await this.getCustomersFromStorage();
    const filteredCustomers = customers.filter(customer => customer.id !== id);
    
    if (filteredCustomers.length === customers.length) {
      throw new Error('Customer not found');
    }
    
    await this.saveCustomersToStorage(filteredCustomers);
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    await this.delay(400);
    
    if (!query.trim()) {
      return this.getAllCustomers();
    }
    
    const customers = await this.getCustomersFromStorage();
    const searchTerm = query.toLowerCase().trim();
    
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.phone.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm) ||
      customer.companyName?.toLowerCase().includes(searchTerm) ||
      customer.taxId?.toLowerCase().includes(searchTerm)
    );
  }
}

// Export singleton instance
export const customerService = new CustomerServiceImpl();