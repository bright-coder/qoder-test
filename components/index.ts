// Export all components for easy importing
export { Alert, AlertTitle, AlertDescription } from './Alert';
export { Button } from './Button';
export { IconButton } from './IconButton';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
export { FormInput } from './FormInput';
export { LoginForm } from './LoginForm';
export { ProductForm } from './ProductForm';
export { CustomerForm } from './CustomerForm';
export { LocationPicker } from './LocationPicker';
export { Select } from './Select';
export { UIShowcase } from './UIShowcase';
export { VectorIconsDemo } from './VectorIconsDemo';
export { VectorIconsExamples } from './VectorIconsExamples';
export { ProtectedRoute } from './ProtectedRoute';
export { withAuth, useAuthGuard } from './withAuth';
export { OrderCard } from './OrderCard';
export { OrderSummaryCard } from './OrderSummaryCard';
export { OrderFilterModal } from './OrderFilterModal';
export { LanguageSwitcher } from './LanguageSwitcher';

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