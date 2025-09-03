import {
  UserRole,
  Permission,
  RoleDefinition,
  PermissionCheckResult,
  RBACUser,
  RBACOptions,
  AccessControlOptions,
  ROLE_HIERARCHY
} from '../types/rbac';

/**
 * Comprehensive Permission Service for Role-Based Access Control
 */
export class PermissionService {
  private static roles: Map<UserRole, RoleDefinition> = new Map();
  private static options: RBACOptions = {
    allowRoleInheritance: true,
    strictMode: false,
    logAccessAttempts: false,
    cachePermissions: true
  };

  /**
   * Initialize the permission system with role definitions
   */
  static initialize(options?: Partial<RBACOptions>): void {
    this.options = { ...this.options, ...options };
    this.defineRoles();
  }

  /**
   * Define all system roles and their permissions
   */
  private static defineRoles(): void {
    // USER Role - Basic permissions
    this.roles.set(UserRole.USER, {
      role: UserRole.USER,
      name: 'User',
      description: 'Standard user with basic access to product viewing and personal account management',
      permissions: [
        Permission.PRODUCT_READ,
        Permission.USER_READ // Can read own profile
      ]
    });

    // MODERATOR Role - Content moderation + user permissions
    this.roles.set(UserRole.MODERATOR, {
      role: UserRole.MODERATOR,
      name: 'Moderator',
      description: 'Content moderator with ability to manage products and moderate content',
      permissions: [
        Permission.PRODUCT_READ,
        Permission.PRODUCT_CREATE,
        Permission.PRODUCT_UPDATE,
        Permission.USER_READ,
        Permission.USER_UPDATE, // Can update user profiles
        Permission.CONTENT_MODERATE,
        Permission.CONTENT_DELETE
      ],
      inheritsFrom: [UserRole.USER]
    });

    // ADMIN Role - Full product and user management
    this.roles.set(UserRole.ADMIN, {
      role: UserRole.ADMIN,
      name: 'Administrator',
      description: 'Administrator with full product and user management capabilities',
      permissions: [
        // Product permissions
        Permission.PRODUCT_READ,
        Permission.PRODUCT_CREATE,
        Permission.PRODUCT_UPDATE,
        Permission.PRODUCT_DELETE,
        Permission.PRODUCT_BULK_OPERATIONS,
        
        // User management
        Permission.USER_READ,
        Permission.USER_CREATE,
        Permission.USER_UPDATE,
        Permission.USER_DELETE,
        
        // Content management
        Permission.CONTENT_MODERATE,
        Permission.CONTENT_DELETE,
        Permission.CONTENT_FEATURE,
        
        // Financial access
        Permission.FINANCIAL_VIEW,
        Permission.FINANCIAL_EDIT,
        
        // Advanced features
        Permission.ADVANCED_ANALYTICS,
        Permission.ADVANCED_EXPORT,
        
        // System access
        Permission.SYSTEM_ANALYTICS,
        Permission.SYSTEM_LOGS
      ],
      inheritsFrom: [UserRole.MODERATOR]
    });

    // SUPER_ADMIN Role - Full system access
    this.roles.set(UserRole.SUPER_ADMIN, {
      role: UserRole.SUPER_ADMIN,
      name: 'Super Administrator',
      description: 'Super administrator with full system access and user role management',
      permissions: [
        // All permissions from lower roles
        ...this.getAllPermissions(),
        
        // Exclusive super admin permissions
        Permission.USER_MANAGE_ROLES,
        Permission.SYSTEM_SETTINGS,
        Permission.SYSTEM_BACKUP,
        Permission.ADVANCED_INTEGRATION,
        Permission.FINANCIAL_REPORTS
      ],
      inheritsFrom: [UserRole.ADMIN]
    });
  }

  /**
   * Get all available permissions
   */
  private static getAllPermissions(): Permission[] {
    return Object.values(Permission);
  }

  /**
   * Get role definition
   */
  static getRoleDefinition(role: UserRole): RoleDefinition | undefined {
    return this.roles.get(role);
  }

  /**
   * Get all role definitions
   */
  static getAllRoles(): RoleDefinition[] {
    return Array.from(this.roles.values());
  }

  /**
   * Get all permissions for a role (including inherited permissions)
   */
  static getRolePermissions(role: UserRole): Permission[] {
    const roleDefinition = this.roles.get(role);
    if (!roleDefinition) {
      return [];
    }

    let permissions = [...roleDefinition.permissions];

    // Add inherited permissions if enabled
    if (this.options.allowRoleInheritance && roleDefinition.inheritsFrom) {
      for (const inheritedRole of roleDefinition.inheritsFrom) {
        const inheritedPermissions = this.getRolePermissions(inheritedRole);
        permissions = [...permissions, ...inheritedPermissions];
      }
    }

    // Remove duplicates
    return [...new Set(permissions)];
  }

  /**
   * Check if a user has a specific permission
   */
  static hasPermission(
    user: RBACUser,
    permission: Permission,
    options?: { ignoreCustomPermissions?: boolean }
  ): PermissionCheckResult {
    if (this.options.logAccessAttempts) {
      console.log(`Permission check: ${user.username} requesting ${permission}`);
    }

    // Check if permission is explicitly denied
    if (user.deniedPermissions?.includes(permission)) {
      return {
        hasPermission: false,
        reason: 'Permission explicitly denied',
        userRole: user.role
      };
    }

    // Check role-based permissions
    const rolePermissions = this.getRolePermissions(user.role);
    const hasRolePermission = rolePermissions.includes(permission);

    // Check custom permissions if not ignoring them
    const hasCustomPermission = !options?.ignoreCustomPermissions && 
      user.customPermissions?.includes(permission);

    const hasPermission = hasRolePermission || hasCustomPermission;

    return {
      hasPermission: hasPermission || false,
      reason: hasPermission ? 'Permission granted' : 'Permission denied',
      userRole: user.role
    };
  }

  /**
   * Check if a user has any of the specified permissions
   */
  static hasAnyPermission(user: RBACUser, permissions: Permission[]): PermissionCheckResult {
    for (const permission of permissions) {
      const result = this.hasPermission(user, permission);
      if (result.hasPermission) {
        return result;
      }
    }

    return {
      hasPermission: false,
      reason: 'None of the required permissions found',
      userRole: user.role
    };
  }

  /**
   * Check if a user has all of the specified permissions
   */
  static hasAllPermissions(user: RBACUser, permissions: Permission[]): PermissionCheckResult {
    for (const permission of permissions) {
      const result = this.hasPermission(user, permission);
      if (!result.hasPermission) {
        return {
          hasPermission: false,
          reason: `Missing permission: ${permission}`,
          userRole: user.role
        };
      }
    }

    return {
      hasPermission: true,
      reason: 'All required permissions found',
      userRole: user.role
    };
  }

  /**
   * Check if a user has a specific role or higher
   */
  static hasRole(user: RBACUser, requiredRole: UserRole): PermissionCheckResult {
    const userLevel = ROLE_HIERARCHY[user.role];
    const requiredLevel = ROLE_HIERARCHY[requiredRole];

    const hasRole = userLevel >= requiredLevel;

    return {
      hasPermission: hasRole,
      reason: hasRole ? 'Role requirement met' : 'Insufficient role level',
      userRole: user.role,
      requiredRole
    };
  }

  /**
   * Comprehensive access control check
   */
  static canAccess(
    user: RBACUser,
    options: AccessControlOptions
  ): PermissionCheckResult {
    // Check role requirement if specified
    if (options.requiredRole) {
      const roleCheck = this.hasRole(user, options.requiredRole);
      if (!roleCheck.hasPermission) {
        return roleCheck;
      }
    }

    // Check permission requirements if specified
    if (options.requiredPermissions && options.requiredPermissions.length > 0) {
      const permissionCheck = options.requireAllPermissions
        ? this.hasAllPermissions(user, options.requiredPermissions)
        : this.hasAnyPermission(user, options.requiredPermissions);

      if (!permissionCheck.hasPermission) {
        return permissionCheck;
      }
    }

    return {
      hasPermission: true,
      reason: 'Access granted',
      userRole: user.role,
      requiredRole: options.requiredRole
    };
  }

  /**
   * Check if a role can be assigned by another role
   */
  static canAssignRole(
    assignerRole: UserRole,
    targetRole: UserRole
  ): PermissionCheckResult {
    // Only super admins can assign roles
    if (assignerRole !== UserRole.SUPER_ADMIN) {
      return {
        hasPermission: false,
        reason: 'Only super administrators can assign roles',
        userRole: assignerRole
      };
    }

    // Super admins can assign any role except to other super admins
    // (to prevent accidental elevation)
    if (targetRole === UserRole.SUPER_ADMIN) {
      return {
        hasPermission: false,
        reason: 'Cannot assign super administrator role',
        userRole: assignerRole
      };
    }

    return {
      hasPermission: true,
      reason: 'Role assignment permitted',
      userRole: assignerRole
    };
  }

  /**
   * Get permissions that a user is missing from a required set
   */
  static getMissingPermissions(
    user: RBACUser,
    requiredPermissions: Permission[]
  ): Permission[] {
    const missingPermissions: Permission[] = [];

    for (const permission of requiredPermissions) {
      const result = this.hasPermission(user, permission);
      if (!result.hasPermission) {
        missingPermissions.push(permission);
      }
    }

    return missingPermissions;
  }

  /**
   * Get user's effective permissions (role + custom - denied)
   */
  static getEffectivePermissions(user: RBACUser): Permission[] {
    const rolePermissions = this.getRolePermissions(user.role);
    const customPermissions = user.customPermissions || [];
    const deniedPermissions = user.deniedPermissions || [];

    // Combine role and custom permissions
    const allPermissions = [...new Set([...rolePermissions, ...customPermissions])];

    // Remove denied permissions
    return allPermissions.filter(permission => !deniedPermissions.includes(permission));
  }

  /**
   * Check if a user can perform a bulk operation
   */
  static canPerformBulkOperation(user: RBACUser): PermissionCheckResult {
    return this.hasPermission(user, Permission.PRODUCT_BULK_OPERATIONS);
  }

  /**
   * Get role hierarchy level
   */
  static getRoleLevel(role: UserRole): number {
    return ROLE_HIERARCHY[role];
  }

  /**
   * Check if role A is higher than role B
   */
  static isRoleHigher(roleA: UserRole, roleB: UserRole): boolean {
    return this.getRoleLevel(roleA) > this.getRoleLevel(roleB);
  }

  /**
   * Get the next higher role
   */
  static getNextHigherRole(currentRole: UserRole): UserRole | null {
    const currentLevel = this.getRoleLevel(currentRole);
    const roles = Object.entries(ROLE_HIERARCHY)
      .sort(([, a], [, b]) => a - b);

    for (const [role, level] of roles) {
      if (level > currentLevel) {
        return role as UserRole;
      }
    }

    return null;
  }
}

// Initialize the permission system
PermissionService.initialize();