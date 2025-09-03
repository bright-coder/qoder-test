# Alternative Route Organization Examples

## Option 1: Route Groups (Expo Router v3+)

### Current Structure
```
app/
├── _layout.tsx              # Root layout with auth checks
├── index.tsx               # Redirect logic
├── login.tsx               # Public
├── products.tsx            # Protected (using withAuth)
├── create-product.tsx      # Protected (using withAuth)
├── update-product/
│   └── [id].tsx           # Protected (using withAuth)
└── (tabs)/
    ├── _layout.tsx        # Tab layout
    ├── index.tsx          # Protected (tabs are inside layout auth)
    ├── products.tsx       # Protected (using withAuth)
    ├── about.tsx          # Protected (tabs are inside layout auth)
    └── showcase.tsx       # Protected (tabs are inside layout auth)
```

### Alternative Structure Option 1: Grouped by Access Level
```
app/
├── _layout.tsx            # Root layout (minimal)
├── (auth)/               # Authentication group
│   ├── _layout.tsx       # No auth required
│   └── login.tsx         # Login page
├── (protected)/          # Protected group  
│   ├── _layout.tsx       # Auth required for all nested routes
│   ├── index.tsx         # Dashboard/Home
│   ├── products/
│   │   ├── index.tsx     # Product list
│   │   ├── create.tsx    # Create product
│   │   └── [id]/
│   │       └── edit.tsx  # Edit product
│   └── (tabs)/           # Protected tabs
│       ├── _layout.tsx   # Tab navigation
│       ├── home.tsx      # Home tab
│       ├── products.tsx  # Products tab
│       ├── about.tsx     # About tab
│       └── showcase.tsx  # UI Showcase tab
```

### Alternative Structure Option 2: Feature-based Groups
```
app/
├── _layout.tsx
├── index.tsx
├── login.tsx
├── (products)/           # Product feature group
│   ├── _layout.tsx      # Product-specific auth & layout
│   ├── index.tsx        # Product list
│   ├── create.tsx       # Create product
│   └── [id]/
│       └── edit.tsx     # Edit product
├── (profile)/           # User profile feature
│   ├── _layout.tsx     # Profile auth & layout
│   ├── index.tsx       # Profile view
│   └── edit.tsx        # Edit profile
└── (main)/             # Main app tabs
    ├── _layout.tsx     # Tab navigation with auth
    ├── home.tsx        # Home tab
    ├── products.tsx    # Products tab (links to /products)
    ├── about.tsx       # About tab
    └── showcase.tsx    # Showcase tab
```

## Implementation Examples

### Protected Group Layout (`app/(protected)/_layout.tsx`)
```typescript
import React from 'react';
import { Stack } from 'expo-router';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Dashboard' }} />
        <Stack.Screen name="products/index" options={{ title: 'Products' }} />
        <Stack.Screen name="products/create" options={{ title: 'Create Product' }} />
        <Stack.Screen name="products/[id]/edit" options={{ title: 'Edit Product' }} />
      </Stack>
    </ProtectedRoute>
  );
}
```

### Feature Group Layout (`app/(products)/_layout.tsx`)
```typescript
import React from 'react';
import { Stack } from 'expo-router';
import { withAuth } from '../../components/withAuth';

function ProductsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Products',
          headerLargeTitle: true 
        }} 
      />
      <Stack.Screen 
        name="create" 
        options={{ 
          title: 'Create Product',
          presentation: 'modal' 
        }} 
      />
      <Stack.Screen 
        name="[id]/edit" 
        options={{ 
          title: 'Edit Product',
          presentation: 'modal' 
        }} 
      />
    </Stack>
  );
}

export default withAuth(ProductsLayout);
```

### Conditional Layout Based on Auth
```typescript
import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function ConditionalLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

## Pros and Cons of Each Approach

### Current HOC Approach ✅
**Pros:**
- Minimal file restructuring
- Works with existing structure  
- Clear component-level protection
- Easy to implement gradually

**Cons:**
- Still need to import and wrap each component
- Mixed protected/unprotected routes in same directory

### Route Groups Approach 🏗️
**Pros:**
- File-system enforced security
- Zero authentication code in components
- Clear separation of concerns
- Automatic protection for new files

**Cons:**
- Requires major file restructuring
- Less flexible for mixed access levels
- Migration effort for existing projects

### Feature Groups Approach 🎯
**Pros:**
- Logical feature-based organization
- Scalable for large applications
- Clear feature boundaries
- Can mix auth levels per feature

**Cons:**
- Complex routing setup
- Potential for deep nesting
- More layout files to maintain

## Recommendation

For your current project, **stick with the HOC approach** because:

1. ✅ **Minimal migration effort** - Already implemented
2. ✅ **Proven to work** - All pages now use `withAuth`
3. ✅ **Flexible** - Can easily add exceptions or special cases
4. ✅ **Maintainable** - Clear authentication boundaries

Consider route groups for **future projects** or when doing major refactoring.