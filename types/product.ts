export interface Product {
  id: string;
  name: string;
  category: string;
  size: number; // kg
  brand: 'ptt' | 'pt' | 'world';
  cost: number; // 2 decimal precision
  price: number; // 2 decimal precision
  img?: string; // image URL/path
  description: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  category: string;
  size: number;
  brand: 'ptt' | 'pt' | 'world';
  cost: number;
  price: number;
  img?: string;
  description: string;
  sku: string;
}

export interface UpdateProductData extends CreateProductData {
  id: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  size: string; // Form input as string, converted to number
  brand: 'ptt' | 'pt' | 'world';
  cost: string; // Form input as string, converted to number
  price: string; // Form input as string, converted to number
  img?: string;
  description: string;
  sku: string;
}

export interface ProductService {
  createProduct: (data: CreateProductData) => Promise<Product>;
  updateProduct: (data: UpdateProductData) => Promise<Product>;
  getProduct: (id: string) => Promise<Product | null>;
  getAllProducts: () => Promise<Product[]>;
  deleteProduct: (id: string) => Promise<void>;
}

// Available options for form dropdowns
export const PRODUCT_SIZES = [15, 4, 48, 7, 8, 12.5, 13.5] as const;
export const PRODUCT_BRANDS = ['ptt', 'pt', 'world'] as const;

export type ProductSize = typeof PRODUCT_SIZES[number];
export type ProductBrand = typeof PRODUCT_BRANDS[number];