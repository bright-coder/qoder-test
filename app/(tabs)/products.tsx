import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Link, useRouter } from 'expo-router';
import { useProducts } from '../../contexts/ProductContext';
import { IconButton } from '../../components/IconButton';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Alert as AlertComponent, AlertDescription } from '../../components/Alert';
import { Product } from '../../types/product';
import { useTheme } from '../../theme';
import { withAuth } from '../../components/withAuth';
import { Button } from '../../components/Button';
import { useTranslation } from 'react-i18next';

const ProductCard: React.FC<{ 
  product: Product; 
  onEdit: (id: string) => void; 
  onDelete: (id: string) => void;
}> = ({ product, onEdit, onDelete }) => {
  const theme = useTheme();
  const {t} =  useTranslation();

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(product.id),
        },
      ]
    );
  };

  return (
    <Card style={{ marginBottom: theme.spacing[4] }}>
      <CardHeader>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <CardTitle>{product.name}</CardTitle>
            <Text style={{
              fontSize: theme.typography.sm,
              color: theme.colors.mutedForeground,
              marginTop: theme.spacing[1]
            }}>
              {product.category} • {product.size}kg • {product.brand.toUpperCase()}
            </Text>
          </View>
          <Text style={{
            fontSize: theme.typography.xs,
            color: theme.colors.mutedForeground,
            backgroundColor: theme.colors.muted,
            paddingHorizontal: theme.spacing[2],
            paddingVertical: theme.spacing[1],
            borderRadius: theme.borderRadius.sm,
          }}>
            {product.sku}
          </Text>
        </View>
      </CardHeader>
      
      <CardContent>
        <View style={{ gap: theme.spacing[2] }}>
          <Text style={{
            fontSize: theme.typography.sm,
            color: theme.colors.foreground,
            lineHeight: theme.typography.lineHeight.relaxed * theme.typography.sm
          }}>
            {product.description}
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.spacing[2] }}>
            <View>
              <Text style={{
                fontSize: theme.typography.xs,
                color: theme.colors.mutedForeground,
                marginBottom: theme.spacing[1]
              }}>
                {t('common.cost')}: {product.cost.toFixed(2)}
              </Text>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.foreground,
                fontWeight: theme.typography.fontWeight.medium
              }}>
                {t('common.price')}: {product.price.toFixed(2)}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', gap: theme.spacing[2] }}>
              <IconButton
                variant="outline"
                size="sm"
                onPress={() => onEdit(product.id)}
                iconName="edit"
                iconFamily="MaterialIcons"
                iconPosition="left"
              >
                {t('common.edit')}
              </IconButton>
              <IconButton
                variant="destructive"
                size="sm"
                onPress={handleDelete}
                iconName="delete"
                iconFamily="MaterialIcons"
                iconPosition="left"
              >
                {t('common.delete')}
              </IconButton>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

function ProductsTabScreen() {
  const { products, isLoading, error, loadProducts, deleteProduct } = useProducts();
  const router = useRouter();
  const theme = useTheme();
  const {t} =  useTranslation();
  
  // Debug logging
  console.log('ProductsTabScreen - products:', products.length);
  console.log('ProductsTabScreen - isLoading:', isLoading);
  console.log('ProductsTabScreen - error:', error);

  useEffect(() => {
    console.log('ProductsTabScreen - Loading products...');
    loadProducts();
  }, [loadProducts]);

  const handleEdit = (id: string) => {
    router.push(`/update-product/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing[4] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: theme.spacing[6] 
        }}>
          <View>
            <Text style={{
              fontSize: theme.typography['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.foreground,
            }}>
              {t('products.title')}
            </Text>
            <Text style={{
              fontSize: theme.typography.sm,
              color: theme.colors.mutedForeground,
            }}>
              {products.length} product{products.length !== 1 ? 's' : ''} total
            </Text>
          </View>
          
          <Link href="/create-product" asChild>
            <IconButton
              iconName="add"
              iconFamily="MaterialIcons"
              iconPosition="left"
            >
              {t('products.addProduct')}
            </IconButton>
          </Link>
        </View>

        {/* Error State */}
        {error && (
          <AlertComponent variant="destructive" style={{ marginBottom: theme.spacing[4] }}>
            <AlertDescription>{error}</AlertDescription>
          </AlertComponent>
        )}

        {/* Loading State */}
        {isLoading && products.length === 0 && (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingVertical: theme.spacing[16] 
          }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ 
              color: theme.colors.mutedForeground,
              fontSize: theme.typography.base,
              marginTop: theme.spacing[4]
            }}>
              Loading products...
            </Text>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && !error && (
          <Card>
            <CardContent style={{ alignItems: 'center', paddingVertical: theme.spacing[16] }}>
              <Text style={{
                fontSize: theme.typography.lg,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.foreground,
                marginBottom: theme.spacing[2]
              }}>
                No products yet
              </Text>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.mutedForeground,
                textAlign: 'center',
                marginBottom: theme.spacing[6]
              }}>
                Get started by adding your first product
              </Text>
              <Link href="/create-product" asChild>
                <Button>Add Your First Product</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Export the component wrapped with authentication
export default withAuth(ProductsTabScreen);