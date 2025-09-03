// Advanced Authentication Patterns Examples
// This file shows different ways to use the auth components

import React from 'react';
import { View, Text } from 'react-native';
import { withAuth, useAuthGuard } from '../components/withAuth';
import { ProtectedRoute } from '../components/ProtectedRoute';

// ============================================================================
// PATTERN 1: Basic HOC Usage (Recommended for most cases)
// ============================================================================

function BasicProtectedScreen() {
  return (
    <View>
      <Text>This screen is automatically protected!</Text>
    </View>
  );
}

export const BasicProtected = withAuth(BasicProtectedScreen);

// ============================================================================
// PATTERN 2: HOC with Custom Options
// ============================================================================

function AdminScreen() {
  return (
    <View>
      <Text>Admin-only content</Text>
    </View>
  );
}

export const AdminProtected = withAuth(AdminScreen, {
  redirectTo: '/unauthorized',
  showLoading: false
});

// ============================================================================
// PATTERN 3: Using the Hook for Custom Control
// ============================================================================

export function CustomAuthScreen() {
  const { isAuthenticated, isLoading, isAuthorized } = useAuthGuard({
    autoRedirect: false // Don't auto-redirect, handle manually
  });

  if (isLoading) {
    return (
      <View>
        <Text>Checking your permissions...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View>
        <Text>Please log in to continue</Text>
        {/* Custom login UI here */}
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome to the protected area!</Text>
    </View>
  );
}

// ============================================================================
// PATTERN 4: ProtectedRoute Component for Conditional Content
// ============================================================================

export function ConditionalContentScreen() {
  return (
    <View>
      <Text>This content is always visible</Text>
      
      <ProtectedRoute 
        fallback={<Text>Sign in to see premium content</Text>}
        showLoading={false}
      >
        <View>
          <Text>This content requires authentication</Text>
        </View>
      </ProtectedRoute>
      
      <Text>This content is also always visible</Text>
    </View>
  );
}

// ============================================================================
// PATTERN 5: Role-based Access (Future Feature)
// ============================================================================

function ModeratorPanel() {
  return (
    <View>
      <Text>Moderator tools here</Text>
    </View>
  );
}

export const ModeratorProtected = withAuth(ModeratorPanel);

// Future usage when role-based access is implemented:
// export const ModeratorProtected = withAuth(ModeratorPanel, {
//   requiredRole: 'moderator'
// });

// ============================================================================
// PATTERN 6: Multiple Auth Levels in Same Component
// ============================================================================

export function MultiLevelAuthScreen() {
  const { isAuthenticated } = useAuthGuard({ autoRedirect: false });

  return (
    <View>
      {/* Public content */}
      <Text>Everyone can see this</Text>
      
      {/* Authenticated content */}
      {isAuthenticated && (
        <View>
          <Text>Only logged-in users see this</Text>
        </View>
      )}
      
      {/* Role-based content (future) */}
      <ProtectedRoute 
        requiredRole="admin"
        fallback={null}
        showLoading={false}
      >
        <View>
          <Text>Only admins see this</Text>
        </View>
      </ProtectedRoute>
    </View>
  );
}

// ============================================================================
// PATTERN 7: Protecting Specific Actions/Functions
// ============================================================================

export function ActionProtectedScreen() {
  const { isAuthenticated } = useAuthGuard({ autoRedirect: false });

  const handleSensitiveAction = () => {
    if (!isAuthenticated) {
      // Redirect to login or show modal
      console.log('Please log in to perform this action');
      return;
    }
    
    // Perform the action
    console.log('Performing sensitive action...');
  };

  return (
    <View>
      <Text>Public content here</Text>
      
      <button onClick={handleSensitiveAction}>
        Sensitive Action
      </button>
    </View>
  );
}

// ============================================================================
// PATTERN 8: Loading States and Error Handling
// ============================================================================

function AdvancedProtectedScreen() {
  return (
    <View>
      <Text>Advanced protected content</Text>
    </View>
  );
}

export const AdvancedProtected = withAuth(AdvancedProtectedScreen, {
  showLoading: true, // Shows spinner during auth check
  redirectTo: '/custom-login' // Custom login page
});

// ============================================================================
// USAGE EXAMPLES IN ROUTING
// ============================================================================

/*
// In your route files:

// app/dashboard.tsx
export default withAuth(DashboardScreen);

// app/admin.tsx  
export default withAuth(AdminScreen, { requiredRole: 'admin' });

// app/profile.tsx
export default withAuth(ProfileScreen, { 
  redirectTo: '/onboarding',
  showLoading: false 
});

// app/(tabs)/settings.tsx
export default withAuth(SettingsScreen);

// app/products/[id].tsx
export default withAuth(ProductDetailScreen);
*/

// ============================================================================
// TESTING HELPERS
// ============================================================================

// Mock component for testing auth flows
export function MockAuthScreen({ shouldBeAuthenticated = true }) {
  const TestComponent = () => (
    <View>
      <Text>Test Component</Text>
    </View>
  );

  if (shouldBeAuthenticated) {
    return withAuth(TestComponent);
  }
  
  return TestComponent;
}

// ============================================================================
// PERFORMANCE OPTIMIZED PATTERNS
// ============================================================================

// Memoized protected component to prevent unnecessary re-renders
const ExpensiveComponent = React.memo(() => {
  return (
    <View>
      <Text>Expensive component that should be memoized</Text>
    </View>
  );
});

export const OptimizedProtected = withAuth(ExpensiveComponent);

// ============================================================================
// ERROR BOUNDARY INTEGRATION
// ============================================================================

function ProtectedWithErrorBoundary() {
  return (
    <ProtectedRoute
      fallback={
        <View>
          <Text>Authentication Error</Text>
        </View>
      }
    >
      <View>
        <Text>Protected content with error handling</Text>
      </View>
    </ProtectedRoute>
  );
}

export { ProtectedWithErrorBoundary };