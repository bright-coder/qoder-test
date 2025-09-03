import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useRole, usePermissions, useAccess } from '../hooks/useRBAC';
import { UserRole, Permission } from '../types/rbac';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Alert, AlertDescription, AlertTitle } from '../components/Alert';
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function RBACDemoScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { currentRole, roleName, roleLevel, isAdmin, isModerator, isSuperAdmin } = useRole();
  const {
    permissions,
    permissionCount,
    canCreateProduct,
    canDeleteProduct,
    canManageUsers,
    canAccessSystemSettings,
    canViewFinancials
  } = usePermissions();
  const { canAccessAdminPanel, canManageProducts } = useAccess();

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ padding: theme.spacing[6], alignItems: 'center' }}>
          <Text>Please log in to view RBAC demo</Text>
          <Button onPress={() => router.replace('/login')}>
            Go to Login
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: theme.spacing[4] }}>
          
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: theme.spacing[6] }}>
            <Text style={{
              fontSize: theme.typography['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.foreground,
              marginBottom: theme.spacing[2]
            }}>
              🔐 RBAC Demo
            </Text>
            <Text style={{
              fontSize: theme.typography.base,
              color: theme.colors.mutedForeground,
              textAlign: 'center'
            }}>
              Role-Based Access Control demonstration with live permission checking
            </Text>
          </View>

          {/* Current User Info */}
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <CardHeader>
              <CardTitle>Current User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <View style={{ gap: theme.spacing[2] }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.colors.mutedForeground }}>Username:</Text>
                  <Text style={{ fontWeight: theme.typography.fontWeight.medium }}>{user.username}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.colors.mutedForeground }}>Role:</Text>
                  <Text style={{ 
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.primary 
                  }}>
                    {roleName} (Level {roleLevel})
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.colors.mutedForeground }}>Email:</Text>
                  <Text style={{ fontWeight: theme.typography.fontWeight.medium }}>{user.email}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.colors.mutedForeground }}>Total Permissions:</Text>
                  <Text style={{ fontWeight: theme.typography.fontWeight.medium }}>{permissionCount}</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Role Badges */}
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <CardHeader>
              <CardTitle>Role Hierarchy Status</CardTitle>
            </CardHeader>
            <CardContent>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
                <View style={{
                  paddingHorizontal: theme.spacing[3],
                  paddingVertical: theme.spacing[1],
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.muted
                }}>
                  <Text style={{ 
                    fontSize: theme.typography.sm,
                    color: theme.colors.mutedForeground 
                  }}>
                    ✓ User Access
                  </Text>
                </View>
                
                {isModerator() && (
                  <View style={{
                    paddingHorizontal: theme.spacing[3],
                    paddingVertical: theme.spacing[1],
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: theme.colors.secondary,
                    opacity: 0.8
                  }}>
                    <Text style={{ 
                      fontSize: theme.typography.sm,
                      color: theme.colors.secondaryForeground 
                    }}>
                      ✓ Moderator Access
                    </Text>
                  </View>
                )}
                
                {isAdmin() && (
                  <View style={{
                    paddingHorizontal: theme.spacing[3],
                    paddingVertical: theme.spacing[1],
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: theme.colors.primary,
                    opacity: 0.8
                  }}>
                    <Text style={{ 
                      fontSize: theme.typography.sm,
                      color: theme.colors.primaryForeground 
                    }}>
                      ✓ Admin Access
                    </Text>
                  </View>
                )}
                
                {isSuperAdmin() && (
                  <View style={{
                    paddingHorizontal: theme.spacing[3],
                    paddingVertical: theme.spacing[1],
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: theme.colors.destructive,
                    opacity: 0.8
                  }}>
                    <Text style={{ 
                      fontSize: theme.typography.sm,
                      color: theme.colors.destructiveForeground 
                    }}>
                      ✓ Super Admin Access
                    </Text>
                  </View>
                )}
              </View>
            </CardContent>
          </Card>

          {/* Permission-Based Actions */}
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <CardHeader>
              <CardTitle>Available Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <View style={{ gap: theme.spacing[2] }}>
                
                {canCreateProduct() ? (
                  <Button variant="default" style={{ justifyContent: 'flex-start' }}>
                    ✅ Create Products
                  </Button>
                ) : (
                  <Button variant="ghost" disabled style={{ justifyContent: 'flex-start' }}>
                    ❌ Create Products (No Permission)
                  </Button>
                )}
                
                {canDeleteProduct() ? (
                  <Button variant="destructive" style={{ justifyContent: 'flex-start' }}>
                    ✅ Delete Products
                  </Button>
                ) : (
                  <Button variant="ghost" disabled style={{ justifyContent: 'flex-start' }}>
                    ❌ Delete Products (No Permission)
                  </Button>
                )}
                
                {canManageUsers() ? (
                  <Button variant="secondary" style={{ justifyContent: 'flex-start' }}>
                    ✅ Manage Users
                  </Button>
                ) : (
                  <Button variant="ghost" disabled style={{ justifyContent: 'flex-start' }}>
                    ❌ Manage Users (No Permission)
                  </Button>
                )}
                
                {canViewFinancials() ? (
                  <Button variant="outline" style={{ justifyContent: 'flex-start' }}>
                    ✅ View Financial Data
                  </Button>
                ) : (
                  <Button variant="ghost" disabled style={{ justifyContent: 'flex-start' }}>
                    ❌ View Financial Data (No Permission)
                  </Button>
                )}
                
                {canAccessSystemSettings() ? (
                  <Button variant="default" style={{ justifyContent: 'flex-start' }}>
                    ✅ System Settings
                  </Button>
                ) : (
                  <Button variant="ghost" disabled style={{ justifyContent: 'flex-start' }}>
                    ❌ System Settings (No Permission)
                  </Button>
                )}
                
              </View>
            </CardContent>
          </Card>

          {/* Conditional Content Examples */}
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <CardHeader>
              <CardTitle>Conditional Content Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={{ marginBottom: theme.spacing[3], color: theme.colors.mutedForeground }}>
                Content below is shown/hidden based on your permissions:
              </Text>
              
              {/* Always visible */}
              <Alert variant="default" style={{ marginBottom: theme.spacing[3] }}>
                <AlertTitle>✅ Public Content</AlertTitle>
                <AlertDescription>This is visible to all authenticated users.</AlertDescription>
              </Alert>
              
              {/* Moderator only */}
              <ProtectedRoute 
                requiredRole={UserRole.MODERATOR} 
                showUnauthorizedMessage={false}
              >
                <Alert variant="success" style={{ marginBottom: theme.spacing[3] }}>
                  <AlertTitle>🔧 Moderator Tools</AlertTitle>
                  <AlertDescription>Content moderation features available here.</AlertDescription>
                </Alert>
              </ProtectedRoute>
              
              {/* Admin only */}
              <ProtectedRoute 
                requiredRole={UserRole.ADMIN} 
                showUnauthorizedMessage={false}
              >
                <Alert variant="warning" style={{ marginBottom: theme.spacing[3] }}>
                  <AlertTitle>⚙️ Admin Panel</AlertTitle>
                  <AlertDescription>Administrative functions and user management.</AlertDescription>
                </Alert>
              </ProtectedRoute>
              
              {/* Permission-based */}
              <ProtectedRoute 
                requiredPermissions={[Permission.FINANCIAL_VIEW]} 
                showUnauthorizedMessage={false}
              >
                <Alert variant="destructive" style={{ marginBottom: theme.spacing[3] }}>
                  <AlertTitle>💰 Financial Data</AlertTitle>
                  <AlertDescription>Sensitive financial information displayed here.</AlertDescription>
                </Alert>
              </ProtectedRoute>
              
            </CardContent>
          </Card>

          {/* Test Different Users */}
          <Card style={{ marginBottom: theme.spacing[4] }}>
            <CardHeader>
              <CardTitle>Test Different User Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={{ 
                marginBottom: theme.spacing[3], 
                color: theme.colors.mutedForeground,
                fontSize: theme.typography.sm 
              }}>
                Log out and try these test accounts:
              </Text>
              
              <View style={{ gap: theme.spacing[2] }}>
                <Text style={{ fontSize: theme.typography.sm }}>• <Text style={{ fontWeight: 'bold' }}>superadmin</Text> / super123 (Super Admin)</Text>
                <Text style={{ fontSize: theme.typography.sm }}>• <Text style={{ fontWeight: 'bold' }}>admin</Text> / admin123 (Administrator)</Text>
                <Text style={{ fontSize: theme.typography.sm }}>• <Text style={{ fontWeight: 'bold' }}>moderator</Text> / mod123 (Moderator)</Text>
                <Text style={{ fontSize: theme.typography.sm }}>• <Text style={{ fontWeight: 'bold' }}>user1</Text> / 123456 (Basic User)</Text>
                <Text style={{ fontSize: theme.typography.sm }}>• <Text style={{ fontWeight: 'bold' }}>demo</Text> / demo (User + Create Permission)</Text>
                <Text style={{ fontSize: theme.typography.sm }}>• <Text style={{ fontWeight: 'bold' }}>restricted</Text> / restricted123 (Moderator - Delete Permission)</Text>
              </View>
              
              <View style={{ marginTop: theme.spacing[4], gap: theme.spacing[2] }}>
                <Button 
                  variant="outline" 
                  onPress={() => logout()}
                >
                  Logout & Test Another Role
                </Button>
                
                <Button 
                  variant="ghost" 
                  onPress={() => router.push('/unauthorized')}
                >
                  View Unauthorized Page
                </Button>
              </View>
            </CardContent>
          </Card>

          {/* Navigation */}
          <View style={{ gap: theme.spacing[2] }}>
            <Button 
              variant="default" 
              onPress={() => router.back()}
            >
              Go Back
            </Button>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}