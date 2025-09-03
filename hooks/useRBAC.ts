import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Permission, RBACUser } from '../types/rbac';
import { PermissionService } from '../services/permissionService';

/**
 * Specialized hooks for Role-Based Access Control
 * These hooks provide convenient ways to check permissions and roles in components
 */

/**
 * Hook for role-based access checking
 * Returns role information and checking functions
 */
export function useRole() {
  const { user, hasRole, getRoleLevel } = useAuth();
  
  const roleInfo = useMemo(() => {
    if (!user) {
      return {
        currentRole: null,
        roleLevel: 0,
        roleName: 'Guest',
        roleDescription: 'Not authenticated'
      };
    }

    const roleDefinition = PermissionService.getRoleDefinition(user.role);
    
    return {
      currentRole: user.role,
      roleLevel: getRoleLevel(),
      roleName: roleDefinition?.name || user.role,
      roleDescription: roleDefinition?.description || 'No description available'
    };
  }, [user, getRoleLevel]);

  return {
    ...roleInfo,
    
    // Role checking functions
    hasRole,
    isUser: () => hasRole(UserRole.USER),
    isModerator: () => hasRole(UserRole.MODERATOR),
    isAdmin: () => hasRole(UserRole.ADMIN),
    isSuperAdmin: () => hasRole(UserRole.SUPER_ADMIN),
    
    // Role comparison functions
    isAtLeast: (role: UserRole) => hasRole(role),
    isExactly: (role: UserRole) => user?.role === role,
    isHigherThan: (role: UserRole) => {
      if (!user) return false;
      return PermissionService.isRoleHigher(user.role, role);
    },
    
    // Convenience checks
    canManageUsers: () => hasRole(UserRole.ADMIN),
    canModerateContent: () => hasRole(UserRole.MODERATOR),
    canAccessSystemSettings: () => hasRole(UserRole.SUPER_ADMIN),
    
    // Get next role in hierarchy
    getNextRole: () => {
      if (!user) return null;
      return PermissionService.getNextHigherRole(user.role);
    }
  };
}

/**
 * Hook for permission-based access checking
 * Returns permission information and checking functions
 */
export function usePermissions() {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions, getUserPermissions } = useAuth();
  
  const permissions = useMemo(() => getUserPermissions(), [getUserPermissions]);
  
  const permissionsByGroup = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    
    permissions.forEach(permission => {
      const [group] = permission.split(':');
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(permission);
    });
    
    return groups;
  }, [permissions]);

  return {
    permissions,
    permissionsByGroup,
    permissionCount: permissions.length,
    
    // Permission checking functions
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Product permissions
    canCreateProduct: () => hasPermission(Permission.PRODUCT_CREATE),
    canReadProduct: () => hasPermission(Permission.PRODUCT_READ),
    canUpdateProduct: () => hasPermission(Permission.PRODUCT_UPDATE),
    canDeleteProduct: () => hasPermission(Permission.PRODUCT_DELETE),
    canBulkOperateProducts: () => hasPermission(Permission.PRODUCT_BULK_OPERATIONS),
    
    // User management permissions
    canReadUsers: () => hasPermission(Permission.USER_READ),
    canCreateUsers: () => hasPermission(Permission.USER_CREATE),
    canUpdateUsers: () => hasPermission(Permission.USER_UPDATE),
    canDeleteUsers: () => hasPermission(Permission.USER_DELETE),
    canManageUserRoles: () => hasPermission(Permission.USER_MANAGE_ROLES),
    canManageUsers: () => hasAnyPermission([Permission.USER_CREATE, Permission.USER_UPDATE, Permission.USER_DELETE]),
    
    // Content moderation permissions
    canModerateContent: () => hasPermission(Permission.CONTENT_MODERATE),
    canDeleteContent: () => hasPermission(Permission.CONTENT_DELETE),
    canFeatureContent: () => hasPermission(Permission.CONTENT_FEATURE),
    
    // System permissions
    canAccessSystemSettings: () => hasPermission(Permission.SYSTEM_SETTINGS),
    canViewSystemLogs: () => hasPermission(Permission.SYSTEM_LOGS),
    canViewSystemAnalytics: () => hasPermission(Permission.SYSTEM_ANALYTICS),
    canManageSystemBackup: () => hasPermission(Permission.SYSTEM_BACKUP),
    
    // Financial permissions
    canViewFinancials: () => hasPermission(Permission.FINANCIAL_VIEW),
    canEditFinancials: () => hasPermission(Permission.FINANCIAL_EDIT),
    canViewFinancialReports: () => hasPermission(Permission.FINANCIAL_REPORTS),
    
    // Advanced features
    canUseAdvancedAnalytics: () => hasPermission(Permission.ADVANCED_ANALYTICS),
    canExportData: () => hasPermission(Permission.ADVANCED_EXPORT),
    canManageIntegrations: () => hasPermission(Permission.ADVANCED_INTEGRATION),
    
    // Permission group checks
    hasProductPermissions: () => hasAnyPermission([
      Permission.PRODUCT_CREATE,
      Permission.PRODUCT_READ,
      Permission.PRODUCT_UPDATE,
      Permission.PRODUCT_DELETE
    ]),
    
    hasUserManagementPermissions: () => hasAnyPermission([
      Permission.USER_CREATE,
      Permission.USER_UPDATE,
      Permission.USER_DELETE,
      Permission.USER_MANAGE_ROLES
    ]),
    
    hasSystemAdminPermissions: () => hasAnyPermission([
      Permission.SYSTEM_SETTINGS,
      Permission.SYSTEM_LOGS,
      Permission.SYSTEM_ANALYTICS,
      Permission.SYSTEM_BACKUP
    ])
  };
}

/**
 * Hook for checking if current user can access a resource
 * Combines role and permission checking
 */
export function useAccess() {
  const { user, canAccess } = useAuth();
  
  return {
    // General access checking
    canAccess,
    
    // Specific access patterns
    canAccessAdminPanel: () => canAccess(UserRole.ADMIN),
    canAccessModeratorTools: () => canAccess(UserRole.MODERATOR),
    canAccessUserSettings: () => canAccess(UserRole.USER),
    
    canManageProducts: () => canAccess(undefined, [
      Permission.PRODUCT_CREATE,
      Permission.PRODUCT_UPDATE,
      Permission.PRODUCT_DELETE
    ]),
    
    canManageUsers: () => canAccess(UserRole.ADMIN, [
      Permission.USER_CREATE,
      Permission.USER_UPDATE,
      Permission.USER_DELETE
    ]),
    
    canViewReports: () => canAccess(undefined, [
      Permission.SYSTEM_ANALYTICS,
      Permission.FINANCIAL_REPORTS,
      Permission.ADVANCED_ANALYTICS
    ]),
    
    // Complex access checks
    canPerformBulkOperations: () => {
      if (!user) return false;
      return PermissionService.canPerformBulkOperation(user as RBACUser).hasPermission;
    },
    
    canAssignRoles: () => {
      if (!user) return false;
      return user.role === UserRole.SUPER_ADMIN;
    },
    
    // Resource-specific access
    canAccessResource: (requiredRole?: UserRole, requiredPermissions?: Permission[]) => {
      return canAccess(requiredRole, requiredPermissions);
    }
  };
}

/**
 * Hook for getting effective permissions with detailed information
 * Useful for debugging and administration interfaces
 */
export function usePermissionDetails() {
  const { user, getUserPermissions } = useAuth();
  
  const details = useMemo(() => {
    if (!user) {
      return {
        effectivePermissions: [] as Permission[],
        rolePermissions: [] as Permission[],
        customPermissions: [] as Permission[],
        deniedPermissions: [] as Permission[],
        permissionSources: {} as Record<Permission, string[]>
      };
    }
    
    const rbacUser = user as RBACUser;
    const effectivePermissions = getUserPermissions();
    const rolePermissions = PermissionService.getRolePermissions(rbacUser.role);
    const customPermissions = rbacUser.customPermissions || [];
    const deniedPermissions = rbacUser.deniedPermissions || [];
    
    // Map each permission to its source
    const permissionSources: Record<Permission, string[]> = {} as Record<Permission, string[]>;
    
    effectivePermissions.forEach(permission => {
      const sources: string[] = [];
      
      if (rolePermissions.includes(permission)) {
        sources.push(`Role: ${rbacUser.role}`);
      }
      
      if (customPermissions.includes(permission)) {
        sources.push('Custom Assignment');
      }
      
      permissionSources[permission] = sources;
    });
    
    return {
      effectivePermissions,
      rolePermissions,
      customPermissions,
      deniedPermissions,
      permissionSources
    };
  }, [user, getUserPermissions]);
  
  return {
    ...details,
    
    // Analysis functions
    getTotalPermissionCount: () => details.effectivePermissions.length,
    getRolePermissionCount: () => details.rolePermissions.length,
    getCustomPermissionCount: () => details.customPermissions.length,
    getDeniedPermissionCount: () => details.deniedPermissions.length,
    
    // Check if permission comes from role vs custom assignment
    isRolePermission: (permission: Permission) => details.rolePermissions.includes(permission),
    isCustomPermission: (permission: Permission) => details.customPermissions.includes(permission),
    isDeniedPermission: (permission: Permission) => details.deniedPermissions.includes(permission),
    
    // Get missing permissions for a role
    getMissingPermissionsForRole: (targetRole: UserRole) => {
      const targetRolePermissions = PermissionService.getRolePermissions(targetRole);
      return targetRolePermissions.filter(permission => 
        !details.effectivePermissions.includes(permission)
      );
    },
    
    // Get permission source description
    getPermissionSource: (permission: Permission) => {
      return (details.permissionSources as Record<Permission, string[]>)[permission] || ['Unknown'];
    }
  };
}

/**
 * Hook for role assignment capabilities
 * Used in admin interfaces for managing user roles
 */
export function useRoleManagement() {
  const { user } = useAuth();
  
  return {
    // Check if current user can assign roles
    canAssignRoles: () => {
      if (!user) return false;
      return user.role === UserRole.SUPER_ADMIN;
    },
    
    // Check if current user can assign a specific role
    canAssignRole: (targetRole: UserRole) => {
      if (!user) return false;
      return PermissionService.canAssignRole(user.role, targetRole).hasPermission;
    },
    
    // Get assignable roles for current user
    getAssignableRoles: () => {
      if (!user || user.role !== UserRole.SUPER_ADMIN) {
        return [];
      }
      
      // Super admin can assign all roles except super admin
      return Object.values(UserRole).filter(role => role !== UserRole.SUPER_ADMIN);
    },
    
    // Get all role definitions
    getAllRoles: () => PermissionService.getAllRoles(),
    
    // Get role definition
    getRoleDefinition: (role: UserRole) => PermissionService.getRoleDefinition(role),
    
    // Role hierarchy helpers
    getRoleLevel: (role: UserRole) => PermissionService.getRoleLevel(role),
    isRoleHigher: (roleA: UserRole, roleB: UserRole) => PermissionService.isRoleHigher(roleA, roleB)
  };
}