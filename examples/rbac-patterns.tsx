// Comprehensive Role-Based Access Control (RBAC) Examples
// This file demonstrates various patterns for implementing RBAC in React Native

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { withAuth, useAuthGuard } from '../components/withAuth';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useRole, usePermissions, useAccess } from '../hooks/useRBAC';
import { UserRole, Permission } from '../types/rbac';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { useTheme } from '../theme';

// ============================================================================
// PATTERN 1: HOC with Role Requirements
// ============================================================================

function AdminDashboard() {
  const { roleName, roleDescription } = useRole();
  const theme = useTheme();

  return (
    <View style={{ padding: theme.spacing[4] }}>
      <Text style={{ fontSize: theme.typography.xl, marginBottom: theme.spacing[4] }}>
        Admin Dashboard
      </Text>
      <Text>Current Role: {roleName}</Text>
      <Text>Description: {roleDescription}</Text>
    </View>
  );
}

// Requires admin role or higher
export const AdminDashboardScreen = withAuth(AdminDashboard, {
  requiredRole: UserRole.ADMIN,
  unauthorizedRedirect: '/access-denied'
});

// ============================================================================
// PATTERN 2: HOC with Specific Permissions
// ============================================================================

function ProductManagement() {
  const { canCreateProduct, canUpdateProduct, canDeleteProduct } = usePermissions();
  const theme = useTheme();

  return (
    <View style={{ padding: theme.spacing[4] }}>
      <Text style={{ fontSize: theme.typography.xl, marginBottom: theme.spacing[4] }}>
        Product Management
      </Text>
      <Text>Can create: {canCreateProduct() ? 'Yes' : 'No'}</Text>
      <Text>Can update: {canUpdateProduct() ? 'Yes' : 'No'}</Text>
      <Text>Can delete: {canDeleteProduct() ? 'Yes' : 'No'}</Text>
    </View>
  );
}

// Requires specific product permissions
export const ProductManagementScreen = withAuth(ProductManagement, {
  requiredPermissions: [Permission.PRODUCT_CREATE, Permission.PRODUCT_UPDATE],
  requireAllPermissions: false, // User needs ANY of the permissions
  unauthorizedMessage: 'You need product management permissions to access this page.'
});

// ============================================================================
// PATTERN 3: ProtectedRoute with Role and Permission Checks
// ============================================================================

export function ConditionalAccessScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={{ flex: 1, padding: theme.spacing[4] }}>
      
      {/* Always visible content */}
      <Card style={{ marginBottom: theme.spacing[4] }}>
        <CardHeader>
          <CardTitle>Public Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>This content is visible to all authenticated users.</Text>
        </CardContent>
      </Card>

      {/* Moderator-only content */}
      <ProtectedRoute 
        requiredRole={UserRole.MODERATOR}
        showUnauthorizedMessage={false}
      >
        <Card style={{ marginBottom: theme.spacing[4] }}>
          <CardHeader>
            <CardTitle>Moderator Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <Text>Content moderation tools are available here.</Text>
          </CardContent>
        </Card>
      </ProtectedRoute>

      {/* Admin-only content */}
      <ProtectedRoute 
        requiredRole={UserRole.ADMIN}
        unauthorizedMessage=\"Admin privileges required\"
      >
        <Card style={{ marginBottom: theme.spacing[4] }}>
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <Text>Administrative functions and user management.</Text>
          </CardContent>
        </Card>
      </ProtectedRoute>

      {/* Permission-based content */}
      <ProtectedRoute 
        requiredPermissions={[Permission.FINANCIAL_VIEW]}
        unauthorizedMessage=\"Financial viewing permissions required\"
      >
        <Card style={{ marginBottom: theme.spacing[4] }}>
          <CardHeader>
            <CardTitle>Financial Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Text>Financial data and reports are displayed here.</Text>
          </CardContent>
        </Card>
      </ProtectedRoute>

    </ScrollView>
  );
}

// ============================================================================
// PATTERN 4: Hook-Based Access Control
// ============================================================================

export function DynamicContentScreen() {
  const { currentRole, isAdmin, isModerator } = useRole();
  const { 
    canCreateProduct, 
    canDeleteProduct, 
    canManageUserRoles,
    hasSystemAdminPermissions 
  } = usePermissions();
  const { canAccessAdminPanel, canManageUsers } = useAccess();
  const theme = useTheme();

  return (
    <ScrollView style={{ flex: 1, padding: theme.spacing[4] }}>
      
      {/* Role-based rendering */}
      <Card style={{ marginBottom: theme.spacing[4] }}>
        <CardHeader>
          <CardTitle>Current Access Level</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>Current Role: {currentRole}</Text>
          
          {isAdmin() && (
            <Text style={{ color: theme.colors.primary }}>
              ✓ Administrator Access
            </Text>
          )}
          
          {isModerator() && (
            <Text style={{ color: theme.colors.secondary }}>
              ✓ Moderator Access
            </Text>
          )}
        </CardContent>
      </Card>

      {/* Permission-based buttons */}
      <Card style={{ marginBottom: theme.spacing[4] }}>
        <CardHeader>
          <CardTitle>Available Actions</CardTitle>
        </CardHeader>
        <CardContent style={{ gap: theme.spacing[2] }}>
          
          {canCreateProduct() && (
            <Button variant=\"default\">Create Product</Button>
          )}
          
          {canDeleteProduct() && (
            <Button variant=\"destructive\">Delete Products</Button>
          )}
          
          {canManageUsers() && (
            <Button variant=\"secondary\">Manage Users</Button>
          )}
          
          {canManageUserRoles() && (
            <Button variant=\"outline\">Assign Roles</Button>
          )}
          
          {hasSystemAdminPermissions() && (
            <Button variant=\"default\">System Settings</Button>
          )}
          
        </CardContent>
      </Card>

      {/* Access-based navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Options</CardTitle>
        </CardHeader>
        <CardContent style={{ gap: theme.spacing[2] }}>
          
          {canAccessAdminPanel() && (
            <Button variant=\"ghost\">Admin Panel</Button>
          )}
          
          <Button variant=\"ghost\">User Profile</Button>
          <Button variant=\"ghost\">Settings</Button>
          
        </CardContent>
      </Card>

    </ScrollView>
  );
}

// ============================================================================
// PATTERN 5: Advanced Permission Checking
// ============================================================================

export function AdvancedPermissionScreen() {
  const { user } = useAuthGuard({ autoRedirect: false });
  const theme = useTheme();
  
  // Complex permission logic
  const canViewSensitiveData = () => {
    if (!user) return false;
    
    // Multiple conditions for accessing sensitive data
    const hasRole = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
    const hasPermission = user.customPermissions?.includes(Permission.FINANCIAL_VIEW);
    const notDenied = !user.deniedPermissions?.includes(Permission.FINANCIAL_VIEW);
    
    return hasRole && hasPermission && notDenied;
  };

  const canPerformBulkActions = () => {
    if (!user) return false;
    
    // Bulk actions require admin role AND specific permission
    return user.role === UserRole.ADMIN && 
           user.customPermissions?.includes(Permission.PRODUCT_BULK_OPERATIONS);
  };

  return (
    <ScrollView style={{ flex: 1, padding: theme.spacing[4] }}>
      
      <Card style={{ marginBottom: theme.spacing[4] }}>
        <CardHeader>
          <CardTitle>Advanced Access Control</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>User: {user?.username}</Text>
          <Text>Role: {user?.role}</Text>
          <Text>Custom Permissions: {user?.customPermissions?.length || 0}</Text>
          <Text>Denied Permissions: {user?.deniedPermissions?.length || 0}</Text>
        </CardContent>
      </Card>

      {/* Sensitive data section */}
      {canViewSensitiveData() ? (
        <Card style={{ marginBottom: theme.spacing[4] }}>
          <CardHeader>
            <CardTitle>Sensitive Financial Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Text>Revenue: $50,000</Text>
            <Text>Expenses: $30,000</Text>
            <Text>Profit: $20,000</Text>
          </CardContent>
        </Card>
      ) : (
        <Card style={{ marginBottom: theme.spacing[4] }}>
          <CardHeader>
            <CardTitle>Financial Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={{ color: theme.colors.mutedForeground }}>
              Access denied - requires admin role and financial viewing permission
            </Text>
          </CardContent>
        </Card>
      )}

      {/* Bulk operations section */}
      {canPerformBulkActions() && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Operations</CardTitle>
          </CardHeader>
          <CardContent style={{ gap: theme.spacing[2] }}>
            <Button variant=\"destructive\">Delete All Selected</Button>
            <Button variant=\"secondary\">Bulk Update Prices</Button>
            <Button variant=\"outline\">Export All Data</Button>
          </CardContent>
        </Card>
      )}

    </ScrollView>
  );
}

// ============================================================================
// PATTERN 6: Role Management Interface (Super Admin Only)
// ============================================================================

function RoleManagementInterface() {
  const { canAssignRoles, getAssignableRoles, getAllRoles } = useRole();
  const theme = useTheme();

  if (!canAssignRoles()) {
    return (
      <View style={{ padding: theme.spacing[4] }}>
        <Text>Access denied - super admin privileges required</Text>
      </View>
    );
  }

  const assignableRoles = getAssignableRoles();
  const allRoles = getAllRoles();

  return (
    <ScrollView style={{ flex: 1, padding: theme.spacing[4] }}>
      
      <Card style={{ marginBottom: theme.spacing[4] }}>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>Assignable Roles: {assignableRoles.length}</Text>
          
          {assignableRoles.map(role => (
            <View key={role} style={{ marginTop: theme.spacing[2] }}>
              <Text>• {role}</Text>
            </View>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All System Roles</CardTitle>
        </CardHeader>
        <CardContent>
          {allRoles.map(roleInfo => (
            <View key={roleInfo.role} style={{ marginBottom: theme.spacing[3] }}>
              <Text style={{ fontWeight: 'bold' }}>{roleInfo.name}</Text>
              <Text style={{ color: theme.colors.mutedForeground }}>
                {roleInfo.description}
              </Text>
              <Text style={{ fontSize: theme.typography.sm }}>
                Permissions: {roleInfo.permissions.length}
              </Text>
            </View>
          ))}
        </CardContent>
      </Card>

    </ScrollView>
  );
}

// Super admin only
export const RoleManagementScreen = withAuth(RoleManagementInterface, {
  requiredRole: UserRole.SUPER_ADMIN,
  unauthorizedMessage: 'Super administrator privileges required for role management.'
});

// ============================================================================
// PATTERN 7: Permission Testing Component
// ============================================================================

export function PermissionTestingScreen() {
  const { permissions, permissionsByGroup } = usePermissions();
  const { getTotalPermissionCount, getRolePermissionCount, getCustomPermissionCount } = usePermissions();
  const theme = useTheme();

  return (
    <ScrollView style={{ flex: 1, padding: theme.spacing[4] }}>
      
      <Card style={{ marginBottom: theme.spacing[4] }}>
        <CardHeader>
          <CardTitle>Permission Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>Total Permissions: {getTotalPermissionCount()}</Text>
          <Text>Role Permissions: {getRolePermissionCount()}</Text>
          <Text>Custom Permissions: {getCustomPermissionCount()}</Text>
        </CardContent>
      </Card>

      {Object.entries(permissionsByGroup).map(([group, groupPermissions]) => (
        <Card key={group} style={{ marginBottom: theme.spacing[4] }}>
          <CardHeader>
            <CardTitle>{group.toUpperCase()} Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {groupPermissions.map(permission => (
              <Text key={permission} style={{ fontSize: theme.typography.sm }}>
                • {permission}
              </Text>
            ))}
          </CardContent>
        </Card>
      ))}

    </ScrollView>
  );
}

// ============================================================================
// Usage Examples in Route Components
// ============================================================================

/*
// Example route implementations:

// app/admin/dashboard.tsx
export default withAuth(AdminDashboardComponent, {
  requiredRole: UserRole.ADMIN
});

// app/products/manage.tsx  
export default withAuth(ProductManagementComponent, {
  requiredPermissions: [Permission.PRODUCT_CREATE, Permission.PRODUCT_UPDATE],
  requireAllPermissions: false
});

// app/system/settings.tsx
export default withAuth(SystemSettingsComponent, {
  requiredRole: UserRole.SUPER_ADMIN,
  requiredPermissions: [Permission.SYSTEM_SETTINGS]
});

// app/financial/reports.tsx
export default withAuth(FinancialReportsComponent, {
  requiredPermissions: [Permission.FINANCIAL_VIEW, Permission.FINANCIAL_REPORTS],
  requireAllPermissions: true
});
*/