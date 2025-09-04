// Customer type definitions and constants

export interface Customer {
  id: string;
  name: string;
  phone: string;
  addressLine?: string;
  email?: string;
  location?: {
    lat: number;
    lng: number;
  };
  taxId?: string;
  companyName?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Form data type for customer creation/update
export interface CustomerFormData {
  name: string;
  phone: string;
  addressLine?: string;
  email?: string;
  latitude?: string;
  longitude?: string;
  taxId?: string;
  companyName?: string;
}

// Type for creating a new customer
export interface CreateCustomerData {
  name: string;
  phone: string;
  addressLine?: string;
  email?: string;
  location?: {
    lat: number;
    lng: number;
  };
  taxId?: string;
  companyName?: string;
}

// Type for updating an existing customer
export interface UpdateCustomerData extends CreateCustomerData {
  id: string;
}

// Service interface for customer operations
export interface CustomerService {
  getAllCustomers(): Promise<Customer[]>;
  getCustomerById(id: string): Promise<Customer | null>;
  createCustomer(customer: CreateCustomerData): Promise<Customer>;
  updateCustomer(customer: UpdateCustomerData): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;
  searchCustomers(query: string): Promise<Customer[]>;
}