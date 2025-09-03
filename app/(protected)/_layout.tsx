import React from 'react';
import { Stack } from 'expo-router';
import { ProtectedRoute } from '../../components/ProtectedRoute';

/**
 * Layout for all protected routes
 * This ensures all nested routes require authentication
 */
export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Stack>
        <Stack.Screen 
          name="products" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="create-product" 
          options={{ 
            headerShown: false,
            title: 'Create Product'
          }} 
        />
        <Stack.Screen 
          name="update-product/[id]" 
          options={{ 
            headerShown: false,
            title: 'Update Product'
          }} 
        />
      </Stack>
    </ProtectedRoute>
  );
}