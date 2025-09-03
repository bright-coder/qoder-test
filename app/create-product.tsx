import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ProductForm } from '../components/ProductForm';
import { useProducts } from '../contexts/ProductContext';
import { ProductFormData, CreateProductData } from '../types/product';
import { useTheme } from '../theme';
import { withAuth } from '../components/withAuth';

function CreateProductScreen() {
  const { createProduct, isLoading, error, clearError, generateSkuSuggestion } = useProducts();
  const router = useRouter();
  const theme = useTheme();

  // Clear error when component mounts
  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const handleCancel = () => {
    router.back(); // Navigate back to previous screen
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const createData: CreateProductData = {
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

      await createProduct(createData);
      router.back(); // Navigate back to previous screen
    } catch (error) {
      console.error('Create product error:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        error={error || undefined}
        mode="create"
        onGenerateSku={generateSkuSuggestion}
      />
    </SafeAreaView>
  );
}

// Export the component wrapped with authentication
export default withAuth(CreateProductScreen);