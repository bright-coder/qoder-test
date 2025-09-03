import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, CreateProductData, UpdateProductData } from '../types/product';
import { productService } from '../services/productService';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  createProduct: (data: CreateProductData) => Promise<Product>;
  updateProduct: (data: UpdateProductData) => Promise<Product>;
  getProduct: (id: string) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<void>;
  loadProducts: () => Promise<void>;
  generateSkuSuggestion: (name: string, brand: string) => Promise<string>;
  clearError: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      console.log('ProductContext - Starting to load products');
      setIsLoading(true);
      setError(null);
      const allProducts = await productService.getAllProducts();
      console.log('ProductContext - Loaded products:', allProducts.length);
      setProducts(allProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      console.error('ProductContext - Error loading products:', err);
      setError(errorMessage);
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
      console.log('ProductContext - Finished loading products');
    }
  }, []);

  const createProduct = useCallback(async (data: CreateProductData): Promise<Product> => {
    try {
      setIsLoading(true);
      setError(null);
      const newProduct = await productService.createProduct(data);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      console.error('Error creating product:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (data: UpdateProductData): Promise<Product> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedProduct = await productService.updateProduct(data);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      console.error('Error updating product:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProduct = useCallback(async (id: string): Promise<Product | null> => {
    try {
      setError(null);
      return await productService.getProduct(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get product';
      setError(errorMessage);
      console.error('Error getting product:', err);
      return null;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      console.error('Error deleting product:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateSkuSuggestion = useCallback(async (name: string, brand: string): Promise<string> => {
    try {
      return await productService.generateSkuSuggestion(name, brand);
    } catch (err) {
      console.error('Error generating SKU suggestion:', err);
      return '';
    }
  }, []);

  const value: ProductContextType = {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    getProduct,
    deleteProduct,
    loadProducts,
    generateSkuSuggestion,
    clearError,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};