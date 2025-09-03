# Authentication Grouping - Best Practices Guide

This document outlines different approaches to group authenticated pages and remove duplicate authentication logic in our React Native Expo app.

## Problem

Previously, we had duplicate authentication logic scattered across multiple components:

```typescript
// This was repeated in every protected component
const { isAuthenticated } = useAuth();
const router = useRouter();

useEffect(() => {
  if (!isAuthenticated) {
    router.replace('/login');
    return;
  }
}, [isAuthenticated, router]);

if (!isAuthenticated) {
  return null;
}
```

## Solutions Implemented

### 1. Higher-Order Component (HOC) - ✅ **RECOMMENDED & IMPLEMENTED**

**File:** `components/withAuth.tsx`

**Usage:**
```typescript
import { withAuth } from '../components/withAuth';

function MyProtectedComponent() {
  // No auth logic needed here anymore!
  return <View>...</View>;
}

export default withAuth(MyProtectedComponent);
```

**Benefits:**
- ✅ Completely removes auth logic from components
- ✅ Reusable across all protected pages
- ✅ Configurable options (redirectTo, showLoading)
- ✅ TypeScript friendly
- ✅ Minimal code changes required

**Applied to:**
- `app/create-product.tsx`
- `app/update-product/[id].tsx` 
- `app/products.tsx`
- `app/(tabs)/products.tsx`

### 2. Protected Route Component - 🔧 **ALTERNATIVE APPROACH**

**File:** `components/ProtectedRoute.tsx`

**Usage:**
```typescript
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function MyScreen() {
  return (
    <ProtectedRoute>
      <View>Protected content here</View>
    </ProtectedRoute>
  );
}
```

**Benefits:**
- ✅ More explicit in component usage
- ✅ Supports role-based access (future feature)
- ✅ Custom fallback components
- ⚠️ Requires wrapping JSX in every component

### 3. Route Group Layout - 🏗️ **LAYOUT-BASED APPROACH**

**File:** `app/(protected)/_layout.tsx`

**Usage:**
```
app/
├── (protected)/
│   ├── _layout.tsx          # Auth protection for all nested routes
│   ├── products.tsx         # Automatically protected
│   ├── create-product.tsx   # Automatically protected
│   └── update-product/
│       └── [id].tsx         # Automatically protected
└── login.tsx                # Public route
```

**Benefits:**
- ✅ File-system based protection
- ✅ Zero code changes in individual components
- ⚠️ Requires restructuring file organization

## Implementation Details

### Current Setup (HOC Approach)

All product-related pages now use the `withAuth` HOC:

```typescript
// Before
export default function CreateProductScreen() {
  const { isAuthenticated } = useAuth();
  // ... auth logic ...
  if (!isAuthenticated) return null;
  // ... component logic
}

// After
function CreateProductScreen() {
  // No auth logic needed!
  // ... just component logic
}
export default withAuth(CreateProductScreen);
```

### Hook Alternative

For components that need more control:

```typescript
import { useAuthGuard } from '../components/withAuth';

export default function MyComponent() {
  const { isAuthenticated, isLoading, isAuthorized } = useAuthGuard();
  
  if (!isAuthorized) {
    return null; // Or custom loading/error UI
  }
  
  return <View>...</View>;
}
```

## Configuration Options

### withAuth Options

```typescript
withAuth(Component, {
  redirectTo: '/custom-login',    // Default: '/login'
  showLoading: false             // Default: true
})
```

### ProtectedRoute Options

```typescript
<ProtectedRoute 
  redirectTo="/custom-login"
  showLoading={false}
  requiredRole="admin"           // Future: role-based access
  fallback={<CustomLoader />}    // Custom loading component
>
  <YourComponent />
</ProtectedRoute>
```

## Migration Benefits

1. **Reduced Code Duplication**: Removed ~20 lines of duplicate auth logic from each component
2. **Better Separation of Concerns**: Components focus on their core functionality
3. **Centralized Auth Logic**: All authentication handling in reusable utilities
4. **Improved Maintainability**: Auth changes need to be made in only one place
5. **TypeScript Safety**: Full type safety maintained
6. **Future Extensibility**: Easy to add role-based access, custom redirects, etc.

## Performance Impact

- ✅ **No negative performance impact**
- ✅ **Slightly better performance**: Eliminated duplicate useEffect hooks
- ✅ **Smaller bundle size**: Reduced duplicate code

## Next Steps (Optional Enhancements)

1. **Role-based Access Control**: Extend `withAuth` to support user roles
2. **Permission-based Guards**: Add granular permission checking
3. **Route-level Metadata**: Define auth requirements in route configuration
4. **Loading States**: Customize loading components per route
5. **Error Boundaries**: Add auth-specific error handling

## Recommendation

**Use the HOC approach (`withAuth`)** as it provides the best balance of:
- Code simplicity
- Reusability
- Type safety
- Performance
- Maintainability

The other approaches are available as alternatives based on specific project needs.