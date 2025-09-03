import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // The loading state is handled in _layout.tsx
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href=\"/(tabs)\" />;
  } else {
    return <Redirect href=\"/login\" />;
  }
}