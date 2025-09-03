import * as SecureStore from 'expo-secure-store';
import { Product, CreateProductData, UpdateProductData, ProductService } from '../types/product';

const PRODUCTS_STORAGE_KEY = 'products_storage';

// Mock service implementation using SecureStore for persistence
class ProductServiceImpl implements ProductService {
  private async getStoredProducts(): Promise<Product[]> {
    try {
      console.log('ProductService - Getting stored products from SecureStore');
      const productsJson = await SecureStore.getItemAsync(PRODUCTS_STORAGE_KEY);
      console.log('ProductService - Raw stored data:', productsJson ? 'Found data' : 'No data found');
      const products = productsJson ? JSON.parse(productsJson) : [];
      console.log('ProductService - Parsed products:', products.length);
      return products;
    } catch (error) {
      console.error('ProductService - Error reading products from storage:', error);
      return [];
    }
  }

  private async saveProducts(products: Product[]): Promise<void> {
    try {
      await SecureStore.setItemAsync(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products to storage:', error);
      throw new Error('Failed to save products');
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private generateSKU(name: string, brand: string): string {
    const namePrefix = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
    const brandPrefix = brand.toUpperCase();
    const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${brandPrefix}-${namePrefix}-${randomSuffix}`;
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    const products = await this.getStoredProducts();
    
    // Check if SKU already exists
    const existingSku = products.find(p => p.sku === data.sku);
    if (existingSku) {
      throw new Error('SKU already exists');
    }

    const now = new Date().toISOString();
    const newProduct: Product = {
      id: this.generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    products.push(newProduct);
    await this.saveProducts(products);
    
    return newProduct;
  }

  async updateProduct(data: UpdateProductData): Promise<Product> {
    const products = await this.getStoredProducts();
    const index = products.findIndex(p => p.id === data.id);
    
    if (index === -1) {
      throw new Error('Product not found');
    }

    // Check if SKU already exists (excluding current product)
    const existingSku = products.find(p => p.sku === data.sku && p.id !== data.id);
    if (existingSku) {
      throw new Error('SKU already exists');
    }

    const updatedProduct: Product = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    products[index] = updatedProduct;
    await this.saveProducts(products);
    
    return updatedProduct;
  }

  async getProduct(id: string): Promise<Product | null> {
    const products = await this.getStoredProducts();
    return products.find(p => p.id === id) || null;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.getStoredProducts();
    
    // If no products exist, create some sample data for testing
    if (products.length === 0) {
      console.log('ProductService - No products found, creating sample data');
      const sampleProducts: Product[] = [
        {
          id: '1',
          name: 'Sample Product 1',
          category: 'Electronics',
          size: 15,
          brand: 'ptt',
          cost: 10.50,
          price: 15.99,
          description: 'This is a sample product for testing purposes.',
          sku: 'PTT-SAM-001',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Sample Product 2',
          category: 'Tools',
          size: 4,
          brand: 'pt',
          cost: 25.00,
          price: 35.50,
          description: 'Another sample product to test the display functionality.',
          sku: 'PT-SAM-002',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      // Save sample data
      try {
        await this.saveProducts(sampleProducts);
        console.log('ProductService - Sample data saved successfully');
        return sampleProducts;
      } catch (error) {
        console.error('ProductService - Error saving sample data:', error);
        return sampleProducts; // Return even if save fails
      }
    }
    
    return products;
  }

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getStoredProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    await this.saveProducts(filteredProducts);
  }

  // Utility method to generate SKU suggestion
  async generateSkuSuggestion(name: string, brand: string): Promise<string> {
    const products = await this.getStoredProducts();
    let suggestion = this.generateSKU(name, brand);
    
    // Ensure uniqueness
    while (products.find(p => p.sku === suggestion)) {
      suggestion = this.generateSKU(name, brand);
    }
    
    return suggestion;
  }
}

export const productService = new ProductServiceImpl();