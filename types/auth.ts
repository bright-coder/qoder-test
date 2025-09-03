import { UserRole, Permission } from './rbac';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole; // Now required with specific role types
  customPermissions?: Permission[]; // Additional permissions beyond role
  deniedPermissions?: Permission[]; // Explicitly denied permissions
  roleAssignedAt?: Date;
  roleAssignedBy?: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  
  // RBAC methods
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccess: (requiredRole?: UserRole, requiredPermissions?: Permission[]) => boolean;
  getUserPermissions: () => Permission[];
  getRoleLevel: () => number;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'off' | 'username' | 'password' | 'email';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}