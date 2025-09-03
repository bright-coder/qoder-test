import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from './FormInput';
import { Select, SelectOption } from './Select';
import { Button } from './Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Alert, AlertDescription } from './Alert';
import { ProductFormData, PRODUCT_SIZES, PRODUCT_BRANDS, Product } from '../types/product';
import { useTheme } from '../theme';

// Validation schema
const productSchema = z.object({
  name: z.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters'),
  category: z.string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must be less than 50 characters'),
  size: z.string()
    .min(1, 'Please select a size'),
  brand: z.enum(['ptt', 'pt', 'world']).refine(val => ['ptt', 'pt', 'world'].includes(val), {
    message: 'Please select a brand'
  }),
  cost: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Cost must be a valid number with up to 2 decimal places')
    .refine(val => parseFloat(val) >= 0, 'Cost must be greater than or equal to 0'),
  price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number with up to 2 decimal places')
    .refine(val => parseFloat(val) >= 0, 'Price must be greater than or equal to 0'),
  img: z.string().optional(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  sku: z.string()
    .min(3, 'SKU must be at least 3 characters')
    .max(20, 'SKU must be less than 20 characters')
    .regex(/^[A-Z0-9-_]+$/, 'SKU can only contain uppercase letters, numbers, hyphens, and underscores'),
});

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading: boolean;
  error?: string;
  initialData?: Product;
  mode: 'create' | 'update';
  onGenerateSku?: (name: string, brand: string) => Promise<string>;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  error,
  initialData,
  mode,
  onGenerateSku,
}) => {
  const theme = useTheme();
  const [isGeneratingSku, setIsGeneratingSku] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || '',
      size: initialData?.size?.toString() || '',
      brand: initialData?.brand || 'ptt',
      cost: initialData?.cost?.toFixed(2) || '',
      price: initialData?.price?.toFixed(2) || '',
      img: initialData?.img || '',
      description: initialData?.description || '',
      sku: initialData?.sku || '',
    },
  });

  const watchedName = watch('name');
  const watchedBrand = watch('brand');

  // Generate size options
  const sizeOptions: SelectOption[] = PRODUCT_SIZES.map(size => ({
    label: `${size} kg`,
    value: size.toString(),
  }));

  // Generate brand options
  const brandOptions: SelectOption[] = PRODUCT_BRANDS.map(brand => ({
    label: brand.toUpperCase(),
    value: brand,
  }));

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleGenerateSku = async () => {
    if (!onGenerateSku || !watchedName || !watchedBrand) return;
    
    try {
      setIsGeneratingSku(true);
      const suggestion = await onGenerateSku(watchedName, watchedBrand);
      setValue('sku', suggestion);
    } catch (error) {
      console.error('Error generating SKU:', error);
    } finally {
      setIsGeneratingSku(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ padding: theme.spacing[4] }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === 'create' ? 'Create New Product' : 'Update Product'}
            </CardTitle>
            <CardDescription>
              {mode === 'create' 
                ? 'Enter the product details below to create a new product.'
                : 'Update the product information below.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" style={{ marginBottom: theme.spacing[4] }}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <View style={{ gap: theme.spacing[4] }}>
              {/* Basic Information */}
              <View>
                <Text style={{
                  fontSize: theme.typography.lg,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.foreground,
                  marginBottom: theme.spacing[4],
                }}>
                  Basic Information
                </Text>
                
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      label="Product Name"
                      placeholder="Enter product name"
                      value={value}
                      onChangeText={onChange}
                      error={errors.name?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="category"
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      label="Category"
                      placeholder="Enter product category"
                      value={value}
                      onChangeText={onChange}
                      error={errors.category?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="size"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      label="Size"
                      placeholder="Select size"
                      value={value}
                      onValueChange={onChange}
                      options={sizeOptions}
                      error={errors.size?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="brand"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      label="Brand"
                      placeholder="Select brand"
                      value={value}
                      onValueChange={onChange}
                      options={brandOptions}
                      error={errors.brand?.message}
                    />
                  )}
                />
              </View>

              {/* Pricing Information */}
              <View>
                <Text style={{
                  fontSize: theme.typography.lg,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.foreground,
                  marginBottom: theme.spacing[4],
                }}>
                  Pricing Information
                </Text>

                <Controller
                  control={control}
                  name="cost"
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      label="Cost"
                      placeholder="0.00"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      error={errors.cost?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="price"
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      label="Price"
                      placeholder="0.00"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      error={errors.price?.message}
                    />
                  )}
                />
              </View>

              {/* Additional Information */}
              <View>
                <Text style={{
                  fontSize: theme.typography.lg,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.foreground,
                  marginBottom: theme.spacing[4],
                }}>
                  Additional Information
                </Text>

                <Controller
                  control={control}
                  name="img"
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      label="Image URL (Optional)"
                      placeholder="https://example.com/image.jpg"
                      value={value || ''}
                      onChangeText={onChange}
                      error={errors.img?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      label="Description"
                      placeholder="Enter product description"
                      value={value}
                      onChangeText={onChange}
                      error={errors.description?.message}
                    />
                  )}
                />

                <View style={{ marginBottom: theme.spacing[6] }}>
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: theme.spacing[2] 
                  }}>
                    <Text style={{
                      color: theme.colors.foreground,
                      fontSize: theme.typography.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      marginLeft: theme.spacing[1]
                    }}>
                      SKU
                    </Text>
                    {onGenerateSku && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={handleGenerateSku}
                        disabled={!watchedName || !watchedBrand || isGeneratingSku}
                        loading={isGeneratingSku}
                      >
                        Generate
                      </Button>
                    )}
                  </View>
                  
                  <Controller
                    control={control}
                    name="sku"
                    render={({ field: { onChange, value } }) => (
                      <FormInput
                        label=""
                        placeholder="Enter or generate SKU"
                        value={value}
                        onChangeText={onChange}
                        error={errors.sku?.message}
                        autoCapitalize="characters"
                      />
                    )}
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View style={{ 
                flexDirection: 'row', 
                gap: theme.spacing[3], 
                marginTop: theme.spacing[6] 
              }}>
                {onCancel && (
                  <Button
                    variant="outline"
                    onPress={onCancel}
                    disabled={isLoading}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  onPress={handleSubmit(handleFormSubmit)}
                  disabled={isLoading}
                  loading={isLoading}
                  style={{ flex: onCancel ? 1 : undefined }}
                >
                  {mode === 'create' ? 'Create Product' : 'Update Product'}
                </Button>
              </View>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};