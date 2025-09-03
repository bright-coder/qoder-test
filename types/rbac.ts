// Role-Based Access Control (RBAC) Type Definitions

/**
 * Enum for system roles with hierarchical ordering
 * Higher values indicate higher permissions
 */
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

/**
 * Enum for granular permissions
 * Each permission represents a specific action or access level
 */
export enum Permission {
  // Product Management
  PRODUCT_CREATE = 'product:create',
  PRODUCT_READ = 'product:read',
  PRODUCT_UPDATE = 'product:update',
  PRODUCT_DELETE = 'product:delete',
  PRODUCT_BULK_OPERATIONS = 'product:bulk',
  
  // User Management
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_CREATE = 'user:create',
  USER_MANAGE_ROLES = 'user:manage_roles',
  
  // System Administration
  SYSTEM_SETTINGS = 'system:settings',
  SYSTEM_LOGS = 'system:logs',
  SYSTEM_ANALYTICS = 'system:analytics',
  SYSTEM_BACKUP = 'system:backup',
  
  // Content Moderation
  CONTENT_MODERATE = 'content:moderate',
  CONTENT_DELETE = 'content:delete',
  CONTENT_FEATURE = 'content:feature',
  
  // Advanced Features
  ADVANCED_ANALYTICS = 'advanced:analytics',
  ADVANCED_EXPORT = 'advanced:export',
  ADVANCED_INTEGRATION = 'advanced:integration',
  
  // Financial
  FINANCIAL_VIEW = 'financial:view',
  FINANCIAL_EDIT = 'financial:edit',
  FINANCIAL_REPORTS = 'financial:reports'
}

/**
 * Permission groups for easier management
 */
export enum PermissionGroup {
  PRODUCT = 'product',
  USER = 'user',
  SYSTEM = 'system',
  CONTENT = 'content',
  ADVANCED = 'advanced',
  FINANCIAL = 'financial'
}

/**
 * Role definition with associated permissions
 */
export interface RoleDefinition {
  role: UserRole;
  name: string;
  description: string;
  permissions: Permission[];
  inheritsFrom?: UserRole[]; // For role inheritance
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  hasPermission: boolean;
  reason?: string;
  requiredRole?: UserRole;
  userRole?: UserRole;
}

/**
 * Extended user interface with role information
 */
export interface RBACUser {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  customPermissions?: Permission[]; // Additional permissions beyond role
  deniedPermissions?: Permission[]; // Explicitly denied permissions
  roleAssignedAt?: Date;
  roleAssignedBy?: string;
}

/**
 * Role assignment request
 */
export interface RoleAssignmentRequest {
  userId: string;
  newRole: UserRole;
  assignedBy: string;
  reason?: string;
}

/**
 * Permission context for components
 */
export interface PermissionContext {
  userRole: UserRole;
  permissions: Permission[];
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccess: (requiredRole?: UserRole, requiredPermissions?: Permission[]) => boolean;
}

/**
 * RBAC configuration options
 */
export interface RBACOptions {
  allowRoleInheritance?: boolean;
  strictMode?: boolean; // If true, users must have explicit permissions
  logAccessAttempts?: boolean;
  cachePermissions?: boolean;
}

/**
 * Access control check options
 */
export interface AccessControlOptions {
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
  requireAllPermissions?: boolean; // If false, any permission is sufficient
  fallbackBehavior?: 'deny' | 'allow' | 'redirect';
  redirectTo?: string;
  errorMessage?: string;
}

/**
 * Role hierarchy level mapping
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.MODERATOR]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.SUPER_ADMIN]: 4
};

/**
 * Permission to group mapping
 */
export const PERMISSION_GROUPS: Record<Permission, PermissionGroup> = {
  // Product permissions
  [Permission.PRODUCT_CREATE]: PermissionGroup.PRODUCT,
  [Permission.PRODUCT_READ]: PermissionGroup.PRODUCT,
  [Permission.PRODUCT_UPDATE]: PermissionGroup.PRODUCT,
  [Permission.PRODUCT_DELETE]: PermissionGroup.PRODUCT,
  [Permission.PRODUCT_BULK_OPERATIONS]: PermissionGroup.PRODUCT,
  
  // User permissions
  [Permission.USER_READ]: PermissionGroup.USER,
  [Permission.USER_UPDATE]: PermissionGroup.USER,
  [Permission.USER_DELETE]: PermissionGroup.USER,
  [Permission.USER_CREATE]: PermissionGroup.USER,
  [Permission.USER_MANAGE_ROLES]: PermissionGroup.USER,
  
  // System permissions
  [Permission.SYSTEM_SETTINGS]: PermissionGroup.SYSTEM,
  [Permission.SYSTEM_LOGS]: PermissionGroup.SYSTEM,
  [Permission.SYSTEM_ANALYTICS]: PermissionGroup.SYSTEM,
  [Permission.SYSTEM_BACKUP]: PermissionGroup.SYSTEM,
  
  // Content permissions
  [Permission.CONTENT_MODERATE]: PermissionGroup.CONTENT,
  [Permission.CONTENT_DELETE]: PermissionGroup.CONTENT,
  [Permission.CONTENT_FEATURE]: PermissionGroup.CONTENT,
  
  // Advanced permissions
  [Permission.ADVANCED_ANALYTICS]: PermissionGroup.ADVANCED,
  [Permission.ADVANCED_EXPORT]: PermissionGroup.ADVANCED,
  [Permission.ADVANCED_INTEGRATION]: PermissionGroup.ADVANCED,
  
  // Financial permissions
  [Permission.FINANCIAL_VIEW]: PermissionGroup.FINANCIAL,
  [Permission.FINANCIAL_EDIT]: PermissionGroup.FINANCIAL,
  [Permission.FINANCIAL_REPORTS]: PermissionGroup.FINANCIAL
};