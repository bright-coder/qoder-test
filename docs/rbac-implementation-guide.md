# Role-Based Access Control (RBAC) Implementation Guide

## Overview

This guide covers the comprehensive Role-Based Access Control (RBAC) system implemented in your React Native Expo application. The system provides granular permission management with role hierarchies, custom permissions, and flexible access control patterns.

## 🏗️ Architecture

### Core Components

1. **Types System** (`types/rbac.ts`)
   - Role definitions (USER, MODERATOR, ADMIN, SUPER_ADMIN)
   - Granular permissions for different system areas
   - Permission groups and access control options

2. **Permission Service** (`services/permissionService.ts`)
   - Centralized permission logic
   - Role hierarchy management
   - Permission inheritance and checking

3. **Enhanced Authentication** (`contexts/AuthContext.tsx`)
   - Extended with RBAC capabilities
   - Role and permission checking methods
   - Integration with existing auth flow

4. **Access Control Components**
   - Enhanced `withAuth` HOC with role/permission requirements
   - Enhanced `ProtectedRoute` component
   - Specialized RBAC hooks

## 👥 User Roles

### Role Hierarchy (ascending privileges)

1. **USER** (Level 1)
   - Basic product viewing
   - Personal profile access
   - Limited system interaction

2. **MODERATOR** (Level 2)
   - Content moderation capabilities
   - Product creation and editing
   - User profile management
   - Inherits all USER permissions

3. **ADMIN** (Level 3)
   - Full product and user management
   - Financial data access
   - System analytics and logs
   - Advanced features access
   - Inherits all MODERATOR permissions

4. **SUPER_ADMIN** (Level 4)
   - Complete system access
   - Role assignment capabilities
   - System settings and backup
   - Integration management
   - Inherits all ADMIN permissions

## 🔐 Permission System

### Permission Categories

#### Product Management
- `PRODUCT_CREATE` - Create new products
- `PRODUCT_READ` - View product information
- `PRODUCT_UPDATE` - Modify existing products
- `PRODUCT_DELETE` - Remove products
- `PRODUCT_BULK_OPERATIONS` - Perform bulk actions

#### User Management
- `USER_READ` - View user profiles
- `USER_CREATE` - Create new users
- `USER_UPDATE` - Modify user information
- `USER_DELETE` - Remove users
- `USER_MANAGE_ROLES` - Assign/modify user roles

#### System Administration
- `SYSTEM_SETTINGS` - Access system configuration
- `SYSTEM_LOGS` - View system logs
- `SYSTEM_ANALYTICS` - Access analytics dashboard
- `SYSTEM_BACKUP` - Manage system backups

#### Content Moderation
- `CONTENT_MODERATE` - Moderate user content
- `CONTENT_DELETE` - Remove inappropriate content
- `CONTENT_FEATURE` - Feature/highlight content

#### Financial Access
- `FINANCIAL_VIEW` - View financial data
- `FINANCIAL_EDIT` - Modify financial information
- `FINANCIAL_REPORTS` - Access financial reports

#### Advanced Features
- `ADVANCED_ANALYTICS` - Advanced analytics access
- `ADVANCED_EXPORT` - Data export capabilities
- `ADVANCED_INTEGRATION` - Integration management

## 🛠️ Implementation Patterns

### Pattern 1: HOC with Role Requirements

```typescript
import { withAuth } from '../components/withAuth';
import { UserRole } from '../types/rbac';

function AdminDashboard() {
  return <div>Admin Dashboard Content</div>;
}

// Requires admin role or higher
export default withAuth(AdminDashboard, {
  requiredRole: UserRole.ADMIN,
  unauthorizedRedirect: '/access-denied'
});
```

### Pattern 2: HOC with Permission Requirements

```typescript
import { withAuth } from '../components/withAuth';
import { Permission } from '../types/rbac';

function ProductManager() {
  return <div>Product Management Interface</div>;
}

// Requires specific permissions (ANY of them)
export default withAuth(ProductManager, {
  requiredPermissions: [
    Permission.PRODUCT_CREATE, 
    Permission.PRODUCT_UPDATE
  ],
  requireAllPermissions: false // ANY permission is sufficient
});
```

### Pattern 3: ProtectedRoute Component

```typescript
import { ProtectedRoute } from '../components/ProtectedRoute';
import { UserRole, Permission } from '../types/rbac';

export function ConditionalContent() {
  return (
    <div>
      <div>Public content for all authenticated users</div>
      
      <ProtectedRoute requiredRole={UserRole.MODERATOR}>
        <div>Moderator-only content</div>
      </ProtectedRoute>
      
      <ProtectedRoute 
        requiredPermissions={[Permission.FINANCIAL_VIEW]}
        unauthorizedMessage="Financial access required"
      >
        <div>Financial data</div>
      </ProtectedRoute>
    </div>
  );
}
```

### Pattern 4: Hook-Based Access Control

```typescript
import { useRole, usePermissions, useAccess } from '../hooks/useRBAC';

export function DynamicInterface() {
  const { isAdmin, isModerator } = useRole();
  const { canCreateProduct, canDeleteProduct } = usePermissions();
  const { canAccessAdminPanel } = useAccess();
  
  return (
    <div>
      {isAdmin() && <AdminTools />}
      {isModerator() && <ModerationTools />}
      
      {canCreateProduct() && <CreateProductButton />}
      {canDeleteProduct() && <DeleteProductButton />}
      
      {canAccessAdminPanel() && <AdminPanelLink />}
    </div>
  );
}
```

## 🔧 Configuration Options

### withAuth Options

```typescript
withAuth(Component, {
  redirectTo: '/login',                    // Login redirect
  showLoading: true,                       // Show loading spinner
  requiredRole: UserRole.ADMIN,           // Minimum role required
  requiredPermissions: [Permission.X],    // Required permissions
  requireAllPermissions: false,           // AND vs OR logic
  unauthorizedRedirect: '/unauthorized',  // Access denied redirect
  fallbackComponent: UnauthorizedComponent // Custom fallback
});
```

### ProtectedRoute Options

```typescript
<ProtectedRoute
  redirectTo="/login"                      // Login redirect
  showLoading={true}                       // Show loading spinner
  requiredRole={UserRole.MODERATOR}       // Minimum role
  requiredPermissions={[Permission.X]}    // Required permissions
  requireAllPermissions={false}           // AND vs OR logic
  unauthorizedRedirect="/access-denied"   // Access denied redirect
  showUnauthorizedMessage={true}          // Show denial message
  unauthorizedMessage="Custom message"    // Custom denial text
>
  <ProtectedContent />
</ProtectedRoute>
```

## 📊 Available Test Users

The system includes predefined test users for each role:

```typescript
// Login credentials for testing
const testUsers = {
  'superadmin': 'super123',     // SUPER_ADMIN
  'admin': 'admin123',          // ADMIN
  'moderator': 'mod123',        // MODERATOR
  'user1': '123456',            // USER
  'demo': 'demo',               // USER with extra create permission
  'restricted': 'restricted123' // MODERATOR with denied delete permission
};
```

## 🎯 Best Practices

### 1. Use Appropriate Pattern for Use Case

- **HOC**: Page-level protection, route components
- **ProtectedRoute**: Conditional content within pages
- **Hooks**: Dynamic UI elements, complex logic

### 2. Follow Principle of Least Privilege

```typescript
// ✅ Good: Specific permission check
const canEdit = hasPermission(Permission.PRODUCT_UPDATE);

// ❌ Avoid: Overly broad role check
const canEdit = hasRole(UserRole.ADMIN);
```

### 3. Provide Clear User Feedback

```typescript
<ProtectedRoute 
  requiredRole={UserRole.ADMIN}
  unauthorizedMessage="Administrator privileges required to access this feature."
>
  <AdminFeature />
</ProtectedRoute>
```

### 4. Handle Loading States

```typescript
const { isLoading, isAuthorized } = useAuthGuard({
  requiredRole: UserRole.MODERATOR
});

if (isLoading) return <LoadingSpinner />;
if (!isAuthorized) return <AccessDenied />;
```

### 5. Use Permission Groups for Related Features

```typescript
// ✅ Good: Logical grouping
const canManageProducts = hasAnyPermission([
  Permission.PRODUCT_CREATE,
  Permission.PRODUCT_UPDATE,
  Permission.PRODUCT_DELETE
]);

// ✅ Good: Specific feature check
const canBulkDelete = hasPermission(Permission.PRODUCT_BULK_OPERATIONS);
```

## 🔍 Debugging and Monitoring

### Permission Details Hook

```typescript
import { usePermissionDetails } from '../hooks/useRBAC';

function DebugPermissions() {
  const {
    effectivePermissions,
    rolePermissions,
    customPermissions,
    getPermissionSource
  } = usePermissionDetails();
  
  return (
    <div>
      <h3>Effective Permissions: {effectivePermissions.length}</h3>
      {effectivePermissions.map(permission => (
        <div key={permission}>
          {permission} - Source: {getPermissionSource(permission).join(', ')}
        </div>
      ))}
    </div>
  );
}
```

### Enable Access Logging

```typescript
// In permissionService.ts initialization
PermissionService.initialize({
  logAccessAttempts: true, // Log all permission checks
  strictMode: false,       // Allow role inheritance
  cachePermissions: true   // Cache for performance
});
```

## 🚀 Advanced Features

### Custom Permission Assignment

Users can have custom permissions beyond their role:

```typescript
const user = {
  role: UserRole.USER,
  customPermissions: [Permission.PRODUCT_CREATE], // Extra permission
  deniedPermissions: [Permission.PRODUCT_DELETE]  // Explicitly denied
};
```

### Role Management Interface

Super admins can assign roles to other users:

```typescript
import { useRoleManagement } from '../hooks/useRBAC';

function RoleAssignment() {
  const { canAssignRole, getAssignableRoles } = useRoleManagement();
  
  const assignableRoles = getAssignableRoles();
  
  return (
    <div>
      {assignableRoles.map(role => (
        <button 
          key={role}
          disabled={!canAssignRole(role)}
          onClick={() => assignRole(userId, role)}
        >
          Assign {role}
        </button>
      ))}
    </div>
  );
}
```

### Bulk Operations Protection

Special handling for potentially dangerous bulk operations:

```typescript
import { usePermissions } from '../hooks/useRBAC';

function BulkActions() {
  const { canPerformBulkOperation } = useAccess();
  
  if (!canPerformBulkOperation()) {
    return <div>Bulk operations require special permissions</div>;
  }
  
  return <BulkActionInterface />;
}
```

## 📈 Performance Considerations

1. **Permission Caching**: Enabled by default, permissions are cached during the session
2. **Lazy Loading**: Only load role definitions when needed
3. **Efficient Checks**: Use specific permission checks rather than broad role checks
4. **Memoization**: Permission calculations are memoized in hooks

## 🔄 Migration from Basic Auth

If migrating from a simpler authentication system:

1. **Update User Interface**: Add role field to existing User type
2. **Assign Default Roles**: Give existing users appropriate roles
3. **Gradual Rollout**: Start with role checks, then add permission granularity
4. **Backward Compatibility**: Maintain existing auth patterns during transition

## 🎭 Testing RBAC

### Test Different Roles

```typescript
// Switch between test users to verify access control
await login({ username: 'admin', password: 'admin123' });     // Test admin features
await login({ username: 'moderator', password: 'mod123' });   // Test moderator features
await login({ username: 'user1', password: '123456' });       // Test user limitations
```

### Verify Permission Inheritance

```typescript
// Verify that higher roles inherit lower role permissions
const adminUser = await login({ username: 'admin', password: 'admin123' });
expect(hasPermission(Permission.PRODUCT_READ)).toBe(true); // From USER role
expect(hasPermission(Permission.CONTENT_MODERATE)).toBe(true); // From MODERATOR role
expect(hasPermission(Permission.USER_DELETE)).toBe(true); // ADMIN specific
```

### Test Access Denial

```typescript
// Verify proper access denial for insufficient permissions
const userAccount = await login({ username: 'user1', password: '123456' });
expect(hasPermission(Permission.USER_DELETE)).toBe(false);
expect(hasRole(UserRole.ADMIN)).toBe(false);
```

## 🆘 Troubleshooting

### Common Issues

1. **Permission Not Working**: Check role inheritance and permission assignments
2. **Role Hierarchy Issues**: Verify ROLE_HIERARCHY mapping in types
3. **Custom Permissions Ignored**: Ensure PermissionService is properly initialized
4. **Loading State Stuck**: Check if AuthContext is properly providing RBAC methods

### Debug Commands

```typescript
// Check user's effective permissions
const permissions = getUserPermissions();
console.log('Effective permissions:', permissions);

// Check specific permission source
const result = PermissionService.hasPermission(user, Permission.PRODUCT_CREATE);
console.log('Permission check:', result);

// Verify role hierarchy
const level = PermissionService.getRoleLevel(user.role);
console.log('User role level:', level);
```

This comprehensive RBAC system provides flexible, scalable access control for your React Native application while maintaining excellent developer experience and user security.