import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ProductForm } from '../../components/ProductForm';
import { useProducts } from '../../contexts/ProductContext';
import { ProductFormData, UpdateProductData, Product } from '../../types/product';
import { Alert, AlertDescription } from '../../components/Alert';
import { useTheme } from '../../theme';
import { withAuth } from '../../components/withAuth';

function UpdateProductScreen() {
  const { updateProduct, getProduct, isLoading, error, clearError, generateSkuSuggestion } = useProducts();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);

  useEffect(() => {
    clearError();
    loadProduct();
  }, [id, clearError]);

  const loadProduct = async () => {
    if (!id) {
      setProductError('Product ID is required');
      setLoadingProduct(false);
      return;
    }

    try {
      setLoadingProduct(true);
      setProductError(null);
      const foundProduct = await getProduct(id);
      
      if (!foundProduct) {
        setProductError('Product not found');
      } else {
        setProduct(foundProduct);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setProductError('Failed to load product');
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleCancel = () => {
    router.back(); // Navigate back to previous screen
  };

  const handleSubmit = async (data: ProductFormData) => {
    if (!product) return;

    try {
      const updateData: UpdateProductData = {
        id: product.id,
        name: data.name,
        category: data.category,
        size: parseFloat(data.size),
        brand: data.brand,
        cost: parseFloat(data.cost),
        price: parseFloat(data.price),
        img: data.img || undefined,
        description: data.description,
        sku: data.sku,
      };

      await updateProduct(updateData);
      router.back(); // Navigate back to previous screen
    } catch (error) {
      console.error('Update product error:', error);
    }
  };

  if (loadingProduct) {
    return (
      <SafeAreaView style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (productError || !product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing[4] }}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <Alert variant="destructive">
          <AlertDescription>
            {productError || 'Product not found'}
          </AlertDescription>
        </Alert>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        error={error || undefined}
        initialData={product}
        mode="update"
        onGenerateSku={generateSkuSuggestion}
      />
    </SafeAreaView>
  );
}

// Export the component wrapped with authentication
export default withAuth(UpdateProductScreen);