# React Native Expo Application with Authentication & RBAC

A comprehensive React Native Expo application featuring secure authentication, role-based access control (RBAC), product management, and a modern UI design system built with TypeScript and shadcn/ui theme.

## 🌟 Features

### 🔐 Authentication & Authorization
- ✅ **Secure Authentication** - Username/password login with expo-secure-store
- ✅ **Role-Based Access Control (RBAC)** - Advanced permission system with roles and permissions
- ✅ **Persistent Sessions** - User sessions persist across app restarts
- ✅ **Form Validation** - Real-time validation using react-hook-form and zod
- ✅ **Protected Routes** - Route-level authentication guards
- ✅ **Authorization Components** - withAuth HOC and useAuthGuard hook

### 🎨 Modern UI & Design System
- ✅ **shadcn/ui Theme System** - Professional design system with light/dark theme support
- ✅ **Vector Icons** - @expo/vector-icons integration with 6 icon families
- ✅ **Responsive Components** - Card, Button, Alert, Form, Select components
- ✅ **Consistent Spacing** - Design token-based spacing and typography
- ✅ **Custom IconButton** - Enhanced button component with icon support

### 📱 Navigation & Routing
- ✅ **File-based Routing** - Expo Router with tab and stack navigation
- ✅ **Tab Navigation** - Clean tab-based interface with vector icons
- ✅ **Protected Routes** - Authentication-based route protection
- ✅ **Dynamic Routes** - Parameterized routes for product management

### 🛍️ Product Management System
- ✅ **Product CRUD Operations** - Create, read, update, delete products
- ✅ **Product Form** - Comprehensive form with validation and SKU generation
- ✅ **Product Context** - Global state management for products
- ✅ **Product Types** - Type-safe product data structures
- ✅ **Secure Storage** - Product data stored using expo-secure-store

### 🎪 UI Showcase & Components
- ✅ **Component Library** - Comprehensive UI component showcase
- ✅ **Interactive Examples** - Practical component usage examples
- ✅ **Vector Icons Demo** - Showcase of all available icon families

## 🏗️ Architecture

### Design Patterns
- **React Context API** - Global state management for auth and products
- **File-based Routing** - Expo Router for navigation
- **Form Validation Pattern** - react-hook-form with zod schemas
- **Component Composition** - Reusable UI components with props
- **Service Layer Pattern** - Separation of business logic
- **Higher-Order Components** - withAuth for route protection

### Component Structure
```
components/
├── UI Components/
│   ├── Alert.tsx           # Alert variants
│   ├── Button.tsx          # Button component with variants
│   ├── IconButton.tsx      # Enhanced button with icon support
│   ├── Card.tsx            # Card component family
│   ├── FormInput.tsx       # Form input with validation
│   └── Select.tsx          # Custom dropdown component
├── Form Components/
│   ├── LoginForm.tsx       # Authentication form
│   └── ProductForm.tsx     # Product management form
├── Auth Components/
│   ├── LogoutButton.tsx    # Logout functionality
│   ├── ProtectedRoute.tsx  # Route protection
│   └── withAuth.tsx        # Authentication HOC
├── Icon Components/
│   ├── VectorIconsDemo.tsx # Vector icons showcase
│   └── VectorIconsExamples.tsx # Practical icon examples
└── Demo Components/
    └── UIShowcase.tsx      # UI components demo
```

## 🔧 Technology Stack

### Core Technologies
- **Framework**: React Native with Expo SDK ~53.0.22
- **Language**: TypeScript ~5.8.3
- **Navigation**: Expo Router ~5.1.5 (file-based routing)
- **Styling**: NativeWind ^4.1.23 (Tailwind CSS integration)

### Form & Validation
- **Form Management**: react-hook-form ^7.62.0
- **Schema Validation**: zod ^4.1.5
- **Input Validation**: Real-time validation with error handling

### Storage & Security
- **Secure Storage**: expo-secure-store ^14.2.3
- **Data Persistence**: Encrypted local storage
- **Session Management**: Persistent authentication state

### UI & Icons
- **Icons**: @expo/vector-icons ^14.1.0
- **Theme System**: Custom shadcn/ui implementation
- **Design Tokens**: Consistent spacing, colors, typography

## 📱 Pages & Navigation

### Public Routes
- **`/login`** - Authentication screen with form validation
- **`/unauthorized`** - Access denied page for insufficient permissions

### Protected Tab Routes
- **`/(tabs)/`** - Main app with tab navigation
  - **`index`** - Home dashboard with user information and navigation
  - **`products`** - Product management with CRUD operations
  - **`showcase`** - UI components and vector icons demo
  - **`about`** - App information and user details

### Dynamic Routes
- **`/create-product`** - Product creation form
- **`/update-product/[id]`** - Product editing form
- **`/rbac-demo`** - Role-based access control demonstration

### Route Protection
```tsx
// Protected component example
export default withAuth(MyComponent);

// Manual auth check
const { user, hasPermission } = useAuthGuard({
  requiredRole: 'admin',
  requiredPermissions: ['CREATE_PRODUCT']
});
```

## 🔐 Authentication & RBAC System

### Demo Accounts
| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| admin | admin123 | Administrator | All permissions |
| moderator | mod123 | Moderator | All except sensitive admin |
| user1 | 123456 | User | Basic read permissions |
| demo | demo | User | Basic + CREATE_PRODUCT |
| restricted | restricted123 | Moderator | Moderator - DELETE_PRODUCT |

### Role Hierarchy
1. **Administrator** (Level 3) - Full system access
2. **Moderator** (Level 2) - Content management and user oversight
3. **User** (Level 1) - Basic access with limited permissions

### Available Permissions
- `READ_PRODUCT` - View products
- `CREATE_PRODUCT` - Create new products
- `UPDATE_PRODUCT` - Edit existing products
- `DELETE_PRODUCT` - Remove products
- `READ_USER` - View user information
- `UPDATE_USER` - Edit user details
- `DELETE_USER` - Remove users
- `MANAGE_ROLES` - Assign roles and permissions

### RBAC Usage Examples
```tsx
// Check role
const { hasRole } = useAuth();
if (hasRole('admin')) {
  // Admin-only functionality
}

// Check permission
const { hasPermission } = useAuth();
if (hasPermission('CREATE_PRODUCT')) {
  // Show create button
}

// Component-level protection
<ProtectedRoute requiredRole="moderator">
  <AdminPanel />
</ProtectedRoute>
```

## 🎨 Theme System

### Design System Features
- **Color Palette** - Primary, secondary, accent, muted, destructive colors
- **Dark/Light Mode** - Automatic theme switching
- **Typography Scale** - xs, sm, base, lg, xl, 2xl, 3xl sizes
- **Spacing System** - Consistent 8px-based spacing scale
- **Border Radius** - sm, md, lg, xl, full variants
- **Shadow System** - none, sm, base, md, lg, xl, 2xl levels

### Theme Usage
```tsx
import { useTheme } from '../theme';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{
      backgroundColor: theme.colors.background,
      padding: theme.spacing[4],
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.sm
    }}>
      <Text style={{
        color: theme.colors.foreground,
        fontSize: theme.typography.lg,
        fontWeight: theme.typography.fontWeight.medium
      }}>
        Themed Text
      </Text>
    </View>
  );
};
```

### Available Components
- **Button** - Multiple variants (default, destructive, outline, secondary, ghost, link)
- **IconButton** - Button with integrated icon support
- **Card** - CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Alert** - Success, warning, error, info variants
- **FormInput** - Form input with validation and error display
- **Select** - Custom dropdown with theming

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- Expo CLI
- React Native development environment

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on device/simulator:
   - Scan QR code with Expo Go app
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

### Build Commands
```bash
# Development
npm start

# Production builds
expo build:android
expo build:ios

# EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

## 📁 Project Structure

```
├── app/                    # Expo Router pages
│   ├── (protected)/        # Auth-protected route group
│   ├── (tabs)/            # Tab navigation group
│   │   ├── _layout.tsx    # Tab layout with vector icons
│   │   ├── index.tsx      # Home dashboard
│   │   ├── products.tsx   # Product management
│   │   ├── showcase.tsx   # UI/Icon showcase
│   │   └── about.tsx      # About page
│   ├── update-product/
│   │   └── [id].tsx       # Dynamic product edit route
│   ├── _layout.tsx        # Root layout with theme provider
│   ├── index.tsx          # Initial redirect
│   ├── login.tsx          # Authentication screen
│   ├── create-product.tsx # Product creation
│   ├── rbac-demo.tsx      # RBAC demonstration
│   └── unauthorized.tsx   # Access denied page
├── components/            # Reusable UI components
│   ├── [Component].tsx    # Individual components
│   └── index.ts          # Component exports
├── contexts/             # React Context providers
│   ├── AuthContext.tsx   # Authentication state
│   └── ProductContext.tsx # Product management state
├── services/             # Business logic layer
│   ├── authService.ts    # Authentication operations
│   ├── productService.ts # Product CRUD operations
│   └── permissionService.ts # RBAC permission logic
├── hooks/                # Custom React hooks
│   └── useRBAC.ts        # RBAC utility hooks
├── types/                # TypeScript type definitions
│   ├── auth.ts           # Authentication types
│   ├── product.ts        # Product types
│   └── rbac.ts           # RBAC types
├── theme/                # Design system
│   ├── ThemeProvider.tsx # Theme context
│   ├── colors.ts         # Color palette
│   ├── typography.ts     # Typography scale
│   └── shadows.ts        # Shadow definitions
└── examples/             # Advanced implementation examples
    ├── advanced-auth-patterns.tsx
    └── rbac-patterns.tsx
```

## 🔍 Key Features Deep Dive

### Product Management
- **Form Validation** - Comprehensive product form with real-time validation
- **SKU Generation** - Automatic SKU generation based on product details
- **CRUD Operations** - Full create, read, update, delete functionality
- **Data Persistence** - Secure local storage with expo-secure-store
- **Type Safety** - Full TypeScript support for product data

### Icon System
- **Vector Icons** - @expo/vector-icons with 6 icon families
- **IconButton Component** - Enhanced button with icon positioning
- **Icon Showcase** - Interactive demo of all available icons

### Form System
- **Real-time Validation** - Instant feedback using zod schemas
- **Error Handling** - Clear, user-friendly error messages
- **Loading States** - Proper loading indicators during form submission
- **Accessibility** - Form labels and error announcements

## 📚 Documentation

- **[Product Management Guide](PRODUCT_MANAGEMENT_GUIDE.md)** - Comprehensive product system documentation
- **[shadcn/ui Guide](SHADCN_UI_GUIDE.md)** - Theme system and component usage
- **[Vector Icons Guide](VECTOR_ICONS_GUIDE.md)** - Icon implementation and usage
- **[Icons Migration Complete](ICONS_MIGRATION_COMPLETE.md)** - Vector icons migration summary

## 🔒 Security Features

- **Encrypted Storage** - All sensitive data stored with expo-secure-store
- **Input Validation** - Server-side style validation on all inputs
- **Route Protection** - Authentication required for protected routes
- **Permission Checks** - Component-level permission validation
- **Session Management** - Secure session handling with automatic cleanup

## 🎯 Best Practices Implemented

- **TypeScript** - Full type safety throughout the application
- **Error Boundaries** - Graceful error handling and recovery
- **Loading States** - Proper loading indicators for better UX
- **Responsive Design** - Mobile-first responsive layout
- **Accessibility** - Screen reader support and keyboard navigation
- **Performance** - Optimized renders and efficient state management

## 🤝 Contributing

This is a demonstration project showcasing modern React Native development patterns. Feel free to explore the code and adapt the patterns for your own projects.

## 📄 License

This project is for demonstration purposes. Feel free to use the code patterns and components in your own projects.