# Product Management System

This React Native Expo project now includes a comprehensive product management system with full CRUD operations, following the established shadcn/ui design system and authentication patterns.

## 📦 Product Features

### Product Data Model
Each product contains the following fields:
- **Name**: Product name (2-100 characters)
- **Category**: Product category (2-50 characters)
- **Size**: Weight in kg (15, 4, 48, 7, 8, 12.5, 13.5)
- **Brand**: Brand selection (PTT, PT, World)
- **Cost**: Product cost with 2 decimal precision
- **Price**: Selling price with 2 decimal precision
- **Image**: Optional image URL
- **Description**: Product description (10-500 characters)
- **SKU**: Unique product identifier (auto-generated or manual)

### Pages and Navigation

#### 🏠 **Main Navigation**
- **Products Tab**: Access products directly via bottom tab navigation
- **Home Screen**: "Manage Products" button for quick access
- **About Screen**: "Manage Products" button in navigation section

#### 📋 **Products List Page** (`/products`)
- View all products in card format
- Product cards show key information (name, category, size, brand, SKU)
- Display cost and price information
- Edit and Delete buttons for each product
- "Add Product" button for creating new products
- Empty state with call-to-action when no products exist
- Error handling with user-friendly messages

#### ➕ **Create Product Page** (`/create-product`)
- Complete form with all product fields
- Form validation using Zod schema
- Dropdown selectors for size and brand
- SKU auto-generation feature
- Real-time form validation feedback
- Success/error handling

#### ✏️ **Update Product Page** (`/update-product/[id]`)
- Pre-populated form with existing product data
- Same validation and features as create page
- Product not found error handling
- Loading states during data fetch

## 🛠 Technical Implementation

### Architecture Pattern
Following the established authentication implementation pattern:

1. **Types** (`types/product.ts`)
   - Product interface definitions
   - Form data types
   - Service interface contracts
   - Constant definitions (sizes, brands)

2. **Services** (`services/productService.ts`)
   - Product CRUD operations
   - Data persistence using Expo SecureStore
   - SKU generation and validation
   - Error handling

3. **Context** (`contexts/ProductContext.tsx`)
   - Global product state management
   - Product operations (create, read, update, delete)
   - Loading and error states
   - React hooks for easy consumption

4. **Components** (`components/`)
   - **ProductForm**: Reusable form for create/update
   - **Select**: Custom dropdown component for shadcn/ui
   - Form validation and user experience

5. **Pages** (`app/`)
   - Screen components using the context and services
   - Navigation integration
   - Error boundaries and loading states

### Data Persistence
- **Storage**: Expo SecureStore for encrypted local storage
- **Format**: JSON serialization of product arrays
- **Validation**: Server-side validation simulation
- **Error Handling**: Comprehensive error catching and user feedback

### Form Validation
Using Zod schema validation:
```typescript
const productSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.string().min(2).max(50),
  size: z.string().min(1),
  brand: z.enum(['ptt', 'pt', 'world']),
  cost: z.string().regex(/^\d+(\.\d{1,2})?$/),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  description: z.string().min(10).max(500),
  sku: z.string().min(3).max(20).regex(/^[A-Z0-9-_]+$/),
});
```

## 🎨 UI/UX Features

### Design System Integration
- **Consistent theming** using shadcn/ui colors and spacing
- **Card-based layouts** for product display
- **Form components** matching design system
- **Button variants** for different actions
- **Alert components** for error/success feedback

### User Experience
- **Real-time validation** with helpful error messages
- **Loading states** for better user feedback
- **Empty states** with clear call-to-actions
- **Confirmation dialogs** for destructive actions
- **Auto-generation** features for SKU creation
- **Responsive design** optimized for mobile

### Custom Components

#### Select Component
```tsx
<Select
  label="Brand"
  placeholder="Select brand"
  value={value}
  onValueChange={onChange}
  options={brandOptions}
  error={errors.brand?.message}
/>
```

#### Product Form
```tsx
<ProductForm
  onSubmit={handleSubmit}
  isLoading={isLoading}
  error={error}
  mode="create" // or "update"
  initialData={product} // for update mode
  onGenerateSku={generateSkuSuggestion}
/>
```

## 🔄 Usage Examples

### Creating a Product
```typescript
const { createProduct } = useProducts();

const handleCreate = async (formData: ProductFormData) => {
  const productData = {
    name: formData.name,
    category: formData.category,
    size: parseFloat(formData.size),
    brand: formData.brand,
    cost: parseFloat(formData.cost),
    price: parseFloat(formData.price),
    description: formData.description,
    sku: formData.sku,
  };
  
  await createProduct(productData);
};
```

### Updating a Product
```typescript
const { updateProduct } = useProducts();

const handleUpdate = async (formData: ProductFormData) => {
  const updateData = {
    id: product.id,
    ...productData,
  };
  
  await updateProduct(updateData);
};
```

### Managing Products
```typescript
const { 
  products, 
  isLoading, 
  error, 
  loadProducts, 
  deleteProduct 
} = useProducts();

// Load products on component mount
useEffect(() => {
  loadProducts();
}, []);

// Delete with confirmation
const handleDelete = async (id: string) => {
  Alert.alert('Confirm Delete', 'Are you sure?', [
    { text: 'Cancel' },
    { text: 'Delete', onPress: () => deleteProduct(id) }
  ]);
};
```

## 🚀 Key Features

✅ **Complete CRUD Operations** - Create, Read, Update, Delete products  
✅ **Form Validation** - Real-time validation with helpful error messages  
✅ **Data Persistence** - Secure local storage using Expo SecureStore  
✅ **SKU Management** - Auto-generation and uniqueness validation  
✅ **Responsive Design** - Mobile-optimized with shadcn/ui components  
✅ **Error Handling** - Comprehensive error states and user feedback  
✅ **Loading States** - Visual feedback during async operations  
✅ **Type Safety** - Full TypeScript support throughout  
✅ **Navigation Integration** - Seamless routing with Expo Router  
✅ **Context Management** - Global state management for products  

The product management system provides a complete, production-ready solution for managing product inventory with modern UX patterns and robust error handling.

---

**Navigation Structure:**
```
├── Home (Tab) → Manage Products Button
├── Products (Tab) → Products List
├── UI Showcase (Tab) → Component Demo
└── About (Tab) → Manage Products Button

Product Flow:
Products List → Create Product
Products List → Edit Product → Update Product
```