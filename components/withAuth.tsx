import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Permission } from '../types/rbac';
import { useTheme } from '../theme';

/**
 * Enhanced Higher-Order Component with Role-Based Access Control
 * Supports authentication, role requirements, and permission checking
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    redirectTo?: string;
    showLoading?: boolean;
    requiredRole?: UserRole;
    requiredPermissions?: Permission[];
    requireAllPermissions?: boolean;
    unauthorizedRedirect?: string;
    fallbackComponent?: React.ComponentType;
  }
) {
  const {
    redirectTo = '/login',
    showLoading = true,
    requiredRole,
    requiredPermissions,
    requireAllPermissions = false,
    unauthorizedRedirect = '/unauthorized',
    fallbackComponent: FallbackComponent
  } = options || {};

  return function AuthenticatedComponent(props: P) {
    const {
      isAuthenticated,
      isLoading,
      user,
      hasRole,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions
    } = useAuth();
    const router = useRouter();
    const theme = useTheme();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace(redirectTo);
      }
    }, [isAuthenticated, isLoading]);

    // Check authorization after authentication
    useEffect(() => {
      if (isAuthenticated && user) {
        let hasAccess = true;
        
        // Check role requirement
        if (requiredRole && !hasRole(requiredRole)) {
          hasAccess = false;
        }
        
        // Check permission requirements
        if (requiredPermissions && requiredPermissions.length > 0) {
          const permissionCheck = requireAllPermissions
            ? hasAllPermissions(requiredPermissions)
            : hasAnyPermission(requiredPermissions);
          
          if (!permissionCheck) {
            hasAccess = false;
          }
        }
        
        // Redirect if access denied
        if (!hasAccess) {
          router.replace(unauthorizedRedirect);
        }
      }
    }, [isAuthenticated, user, requiredRole, requiredPermissions]);

    // Show loading spinner during auth check
    if (isLoading && showLoading) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background
        }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{
            marginTop: theme.spacing[4],
            color: theme.colors.mutedForeground,
            fontSize: theme.typography.sm
          }}>
            Checking permissions...
          </Text>
        </View>
      );
    }

    // Don't render component if not authenticated
    if (!isAuthenticated) {
      return FallbackComponent ? <FallbackComponent /> : null;
    }

    // Check access permissions
    if (isAuthenticated && user) {
      let hasAccess = true;
      
      // Check role requirement
      if (requiredRole && !hasRole(requiredRole)) {
        hasAccess = false;
      }
      
      // Check permission requirements
      if (requiredPermissions && requiredPermissions.length > 0) {
        const permissionCheck = requireAllPermissions
          ? hasAllPermissions(requiredPermissions)
          : hasAnyPermission(requiredPermissions);
        
        if (!permissionCheck) {
          hasAccess = false;
        }
      }
      
      // Show unauthorized fallback if access denied
      if (!hasAccess) {
        if (FallbackComponent) {
          return <FallbackComponent />;
        }
        
        return (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
            padding: theme.spacing[6]
          }}>
            <Text style={{
              fontSize: theme.typography.xl,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.destructive,
              marginBottom: theme.spacing[4],
              textAlign: 'center'
            }}>
              Access Denied
            </Text>
            <Text style={{
              fontSize: theme.typography.base,
              color: theme.colors.mutedForeground,
              textAlign: 'center',
              marginBottom: theme.spacing[2]
            }}>
              You don't have permission to access this page.
            </Text>
            {requiredRole && (
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.mutedForeground,
                textAlign: 'center'
              }}>
                Required role: {requiredRole}
              </Text>
            )}
            {requiredPermissions && requiredPermissions.length > 0 && (
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.mutedForeground,
                textAlign: 'center'
              }}>
                Required permissions: {requiredPermissions.join(', ')}
              </Text>
            )}
          </View>
        );
      }
    }

    // Render the wrapped component with all props
    return <WrappedComponent {...props} />;
  };
}

/**
 * Enhanced hook version with RBAC support
 * Returns authentication status, role, and permission checking functions
 */
export function useAuthGuard(options?: {
  redirectTo?: string;
  autoRedirect?: boolean;
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
  requireAllPermissions?: boolean;
}) {
  const {
    redirectTo = '/login',
    autoRedirect = true,
    requiredRole,
    requiredPermissions,
    requireAllPermissions = false
  } = options || {};
  
  const {
    isAuthenticated,
    isLoading,
    user,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && autoRedirect) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, autoRedirect]);

  // Calculate authorization status
  let isAuthorized = isAuthenticated && !isLoading;
  let authorizationError = '';
  
  if (isAuthenticated && user) {
    // Check role requirement
    if (requiredRole && !hasRole(requiredRole)) {
      isAuthorized = false;
      authorizationError = `Required role: ${requiredRole}`;
    }
    
    // Check permission requirements
    if (requiredPermissions && requiredPermissions.length > 0) {
      const permissionCheck = requireAllPermissions
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);
      
      if (!permissionCheck) {
        isAuthorized = false;
        authorizationError = `Required permissions: ${requiredPermissions.join(', ')}`;
      }
    }
  }

  return {
    isAuthenticated,
    isLoading,
    isAuthorized,
    authorizationError,
    user,
    
    // Permission checking functions
    hasRole: (role: UserRole) => hasRole(role),
    hasPermission: (permission: Permission) => hasPermission(permission),
    hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(permissions),
    hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(permissions),
    
    // Convenience functions
    canCreateProduct: () => hasPermission(Permission.PRODUCT_CREATE),
    canUpdateProduct: () => hasPermission(Permission.PRODUCT_UPDATE),
    canDeleteProduct: () => hasPermission(Permission.PRODUCT_DELETE),
    canManageUsers: () => hasAnyPermission([Permission.USER_UPDATE, Permission.USER_DELETE]),
    canAccessAdmin: () => hasRole(UserRole.ADMIN),
    canModerateContent: () => hasPermission(Permission.CONTENT_MODERATE),
    canViewFinancials: () => hasPermission(Permission.FINANCIAL_VIEW),
    canAccessSystemSettings: () => hasPermission(Permission.SYSTEM_SETTINGS)
  };
}