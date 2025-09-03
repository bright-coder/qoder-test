// Export all components for easy importing
export { Alert, AlertTitle, AlertDescription } from './Alert';
export { Button } from './Button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
export { FormInput } from './FormInput';
export { LoginForm } from './LoginForm';
export { ProductForm } from './ProductForm';
export { Select } from './Select';
export { UIShowcase } from './UIShowcase';
export { IconShowcase } from './IconShowcase';
export { ProtectedRoute } from './ProtectedRoute';
export { withAuth, useAuthGuard } from './withAuth';

// Export all icons
export { 
  HomeIcon, 
  PackageIcon, 
  PaletteIcon, 
  InfoIcon, 
  UserIcon, 
  SettingsIcon, 
  PlusIcon, 
  SearchIcon, 
  GridIcon 
} from './Icons';

// RBAC exports
export * from '../hooks/useRBAC';
export * from '../types/rbac';
export * from '../services/permissionService';

// Export types
export type { AlertProps, AlertTitleProps, AlertDescriptionProps } from './Alert';
export type { ButtonProps } from './Button';
export type { 
  CardProps, 
  CardHeaderProps, 
  CardTitleProps, 
  CardDescriptionProps, 
  CardContentProps, 
  CardFooterProps 
} from './Card';
export type { SelectProps, SelectOption } from './Select';