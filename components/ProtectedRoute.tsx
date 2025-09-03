import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Permission } from '../types/rbac';
import { useTheme } from '../theme';
import { Button } from './Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showLoading?: boolean;
  
  // RBAC props
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
  requireAllPermissions?: boolean;
  unauthorizedRedirect?: string;
  showUnauthorizedMessage?: boolean;
  unauthorizedMessage?: string;
}

/**
 * Component that wraps children and provides authentication protection
 * Alternative to HOC approach - more explicit in usage
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  redirectTo = '/login',
  showLoading = true,
  requiredRole,
  requiredPermissions,
  requireAllPermissions = false,
  unauthorizedRedirect = '/unauthorized',
  showUnauthorizedMessage = true,
  unauthorizedMessage
}) => {
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

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading]);

  // Check authorization after authentication
  React.useEffect(() => {
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
      
      // Redirect if access denied and redirect is enabled
      if (!hasAccess && unauthorizedRedirect) {
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

  // Show fallback if not authenticated
  if (!isAuthenticated) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: theme.colors.background
      }}>
        {fallback || (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing[6]
          }}>
            <Text style={{
              fontSize: theme.typography.xl,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.foreground,
              marginBottom: theme.spacing[4],
              textAlign: 'center'
            }}>
              Authentication Required
            </Text>
            <Text style={{
              fontSize: theme.typography.base,
              color: theme.colors.mutedForeground,
              textAlign: 'center',
              marginBottom: theme.spacing[6]
            }}>
              Please sign in to access this content.
            </Text>
            <Button
              onPress={() => router.replace(redirectTo)}
              variant="default"
            >
              Sign In
            </Button>
          </View>
        )}
      </View>
    );
  }

  // Check authorization for authenticated users
  if (isAuthenticated && user) {
    let hasAccess = true;
    let denialReason = '';
    
    // Check role requirement
    if (requiredRole && !hasRole(requiredRole)) {
      hasAccess = false;
      denialReason = `Required role: ${requiredRole}`;
    }
    
    // Check permission requirements
    if (requiredPermissions && requiredPermissions.length > 0) {
      const permissionCheck = requireAllPermissions
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);
      
      if (!permissionCheck) {
        hasAccess = false;
        denialReason = `Required permissions: ${requiredPermissions.join(', ')}`;
      }
    }
    
    // Show unauthorized message if access denied
    if (!hasAccess) {
      if (!showUnauthorizedMessage) {
        return null; // Silent denial
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
            marginBottom: theme.spacing[4]
          }}>
            {unauthorizedMessage || "You don't have permission to access this content."}
          </Text>
          <Text style={{
            fontSize: theme.typography.sm,
            color: theme.colors.mutedForeground,
            textAlign: 'center',
            marginBottom: theme.spacing[2]
          }}>
            Current role: {user.role}
          </Text>
          <Text style={{
            fontSize: theme.typography.sm,
            color: theme.colors.mutedForeground,
            textAlign: 'center',
            marginBottom: theme.spacing[6]
          }}>
            {denialReason}
          </Text>
          <Button
            onPress={() => router.back()}
            variant="outline"
          >
            Go Back
          </Button>
        </View>
      );
    }
  }

  // Render children if all checks pass
  return <>{children}</>;
};