import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useRole, usePermissions } from '../hooks/useRBAC';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Alert, AlertDescription, AlertTitle } from '../components/Alert';

export default function UnauthorizedScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { currentRole, roleName, roleLevel } = useRole();
  const { permissions, permissionCount } = usePermissions();
  const params = useLocalSearchParams();

  // Extract any passed parameters for context
  const requiredRole = params.requiredRole as string;
  const requiredPermissions = params.requiredPermissions as string;
  const message = params.message as string;

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: theme.colors.background 
    }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ 
          padding: theme.spacing[6],
          alignItems: 'center' 
        }}>
          
          {/* Header */}
          <View style={{ 
            alignItems: 'center', 
            marginBottom: theme.spacing[8] 
          }}>
            <Text style={{
              fontSize: theme.typography['4xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.destructive,
              marginBottom: theme.spacing[4],
              textAlign: 'center'
            }}>
              🚫
            </Text>
            <Text style={{
              fontSize: theme.typography['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.destructive,
              marginBottom: theme.spacing[2],
              textAlign: 'center'
            }}>
              Access Denied
            </Text>
            <Text style={{
              fontSize: theme.typography.base,
              color: theme.colors.mutedForeground,
              textAlign: 'center',
              lineHeight: 24
            }}>
              You don't have permission to access the requested resource.
            </Text>
          </View>

          {/* Custom message if provided */}
          {message && (
            <Alert variant="destructive" style={{ marginBottom: theme.spacing[6] }}>
              <AlertTitle>Access Restriction</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Current user info */}
          <Card style={{ 
            width: '100%', 
            marginBottom: theme.spacing[6] 
          }}>
            <CardHeader>
              <CardTitle>Your Current Access Level</CardTitle>
            </CardHeader>
            <CardContent>
              <View style={{ gap: theme.spacing[2] }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.colors.mutedForeground }}>
                    Username:
                  </Text>
                  <Text style={{ fontWeight: theme.typography.fontWeight.medium }}>
                    {user?.username || 'Unknown'}
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.colors.mutedForeground }}>
                    Current Role:
                  </Text>
                  <Text style={{ 
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.primary 
                  }}>
                    {roleName} (Level {roleLevel})
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.colors.mutedForeground }}>
                    Permissions:
                  </Text>
                  <Text style={{ fontWeight: theme.typography.fontWeight.medium }}>
                    {permissionCount} active
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Requirements info */}
          {(requiredRole || requiredPermissions) && (
            <Card style={{ 
              width: '100%', 
              marginBottom: theme.spacing[6] 
            }}>
              <CardHeader>
                <CardTitle>Access Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <View style={{ gap: theme.spacing[2] }}>
                  {requiredRole && (
                    <View>
                      <Text style={{ 
                        color: theme.colors.mutedForeground,
                        marginBottom: theme.spacing[1] 
                      }}>
                        Required Role:
                      </Text>
                      <Text style={{ 
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.destructive 
                      }}>
                        {requiredRole}
                      </Text>
                    </View>
                  )}
                  
                  {requiredPermissions && (
                    <View>
                      <Text style={{ 
                        color: theme.colors.mutedForeground,
                        marginBottom: theme.spacing[1] 
                      }}>
                        Required Permissions:
                      </Text>
                      <Text style={{ 
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.destructive,
                        fontSize: theme.typography.sm 
                      }}>
                        {requiredPermissions}
                      </Text>
                    </View>
                  )}
                </View>
              </CardContent>
            </Card>
          )}

          {/* Help text */}
          <Card style={{ 
            width: '100%', 
            marginBottom: theme.spacing[8] 
          }}>
            <CardHeader>
              <CardTitle>What can I do?</CardTitle>
            </CardHeader>
            <CardContent>
              <View style={{ gap: theme.spacing[3] }}>
                <Text style={{ 
                  color: theme.colors.mutedForeground,
                  lineHeight: 20 
                }}>
                  • Contact your administrator to request additional permissions
                </Text>
                <Text style={{ 
                  color: theme.colors.mutedForeground,
                  lineHeight: 20 
                }}>
                  • Return to the previous page or main dashboard
                </Text>
                <Text style={{ 
                  color: theme.colors.mutedForeground,
                  lineHeight: 20 
                }}>
                  • Check if you're logged in with the correct account
                </Text>
                <Text style={{ 
                  color: theme.colors.mutedForeground,
                  lineHeight: 20 
                }}>
                  • Review available features in your current role
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <View style={{ 
            width: '100%',
            gap: theme.spacing[3]
          }}>
            <Button
              onPress={() => router.back()}
              variant="default"
              style={{ width: '100%' }}
            >
              Go Back
            </Button>
            
            <Button
              onPress={() => router.replace('/(tabs)')}
              variant="outline"
              style={{ width: '100%' }}
            >
              Return to Dashboard
            </Button>
            
            <Button
              onPress={() => router.replace('/about')}
              variant="ghost"
              style={{ width: '100%' }}
            >
              View Available Features
            </Button>
          </View>

          {/* Debug info for development */}
          {__DEV__ && permissions.length > 0 && (
            <Card style={{ 
              width: '100%', 
              marginTop: theme.spacing[6],
              borderColor: theme.colors.muted 
            }}>
              <CardHeader>
                <CardTitle style={{ fontSize: theme.typography.sm }}>
                  Debug: Your Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollView style={{ maxHeight: 150 }}>
                  {permissions.map(permission => (
                    <Text 
                      key={permission} 
                      style={{ 
                        fontSize: theme.typography.xs,
                        color: theme.colors.mutedForeground,
                        marginBottom: theme.spacing[1] 
                      }}
                    >
                      • {permission}
                    </Text>
                  ))}
                </ScrollView>
              </CardContent>
            </Card>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}