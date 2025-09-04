import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Customer, CreateCustomerData, UpdateCustomerData } from '../types/customer';
import { customerService } from '../services/customerService';

// Context state interface
interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
}

// Context actions
type CustomerAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'REMOVE_CUSTOMER'; payload: string };

// Context type
interface CustomerContextType extends CustomerState {
  loadCustomers: () => Promise<void>;
  createCustomer: (customer: CreateCustomerData) => Promise<void>;
  updateCustomer: (customer: UpdateCustomerData) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  searchCustomers: (query: string) => Promise<void>;
  getCustomerById: (id: string) => Promise<Customer | null>;
  clearError: () => void;
}

// Initial state
const initialState: CustomerState = {
  customers: [],
  isLoading: false,
  error: null,
};

// Reducer function
function customerReducer(state: CustomerState, action: CustomerAction): CustomerState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload, isLoading: false, error: null };
    
    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, action.payload],
        isLoading: false,
        error: null,
      };
    
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        ),
        isLoading: false,
        error: null,
      };
    
    case 'REMOVE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== action.payload),
        isLoading: false,
        error: null,
      };
    
    default:
      return state;
  }
}

// Create context
const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// Provider component
interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  // Load all customers
  const loadCustomers = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const customers = await customerService.getAllCustomers();
      dispatch({ type: 'SET_CUSTOMERS', payload: customers });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load customers';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, []);

  // Create a new customer
  const createCustomer = useCallback(async (customerData: CreateCustomerData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newCustomer = await customerService.createCustomer(customerData);
      dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create customer';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error; // Re-throw to handle in component
    }
  }, []);

  // Update an existing customer
  const updateCustomer = useCallback(async (customerData: UpdateCustomerData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCustomer = await customerService.updateCustomer(customerData);
      dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update customer';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error; // Re-throw to handle in component
    }
  }, []);

  // Delete a customer
  const deleteCustomer = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await customerService.deleteCustomer(id);
      dispatch({ type: 'REMOVE_CUSTOMER', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete customer';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error; // Re-throw to handle in component
    }
  }, []);

  // Search customers
  const searchCustomers = useCallback(async (query: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const customers = await customerService.searchCustomers(query);
      dispatch({ type: 'SET_CUSTOMERS', payload: customers });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search customers';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, []);

  // Get customer by ID
  const getCustomerById = useCallback(async (id: string): Promise<Customer | null> => {
    try {
      return await customerService.getCustomerById(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get customer';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return null;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const value: CustomerContextType = {
    ...state,
    loadCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    getCustomerById,
    clearError,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

// Custom hook to use customer context
export const useCustomers = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};