import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, Alert, Modal, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useProducts } from '../contexts/ProductContext';
import { useCustomers } from '../contexts/CustomerContext';
import { IconButton } from '../components/IconButton';
import { FormInput } from '../components/FormInput';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Alert as AlertComponent, AlertDescription } from '../components/Alert';
import { Product } from '../types/product';
import { Customer } from '../types/customer';
import { useTheme } from '../theme';
import { withAuth } from '../components/withAuth';

interface CartItem {
  product: Product;
  quantity: number;
}

interface SelectedCustomer {
  id: string;
  name: string;
  phone: string;
}

const ProductCard: React.FC<{ 
  product: Product; 
  onAddToCart: (product: Product) => void;
  cartQuantity: number;
}> = ({ product, onAddToCart, cartQuantity }) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showQuantity, setShowQuantity] = useState(false);

  // Pulse animation for cart quantity badge
  useEffect(() => {
    if (cartQuantity > 0) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [cartQuantity, pulseAnim]);

  const handleAddToCart = () => {
    // Scale animation when adding to cart
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.bounce,
        useNativeDriver: true,
      })
    ]).start();

    // Show quantity indicator briefly
    if (cartQuantity >= 0) {
      setShowQuantity(true);
      setTimeout(() => setShowQuantity(false), 1500);
    }

    onAddToCart(product);
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <Card style={{ marginBottom: theme.spacing[3] }}>
        <CardContent>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: theme.typography.base,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.foreground,
              }}>
                {product.name}
              </Text>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.mutedForeground,
                marginTop: theme.spacing[1],
              }}>
                {product.category} • {product.size}kg • {product.brand.toUpperCase()}
              </Text>
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.primary,
                fontWeight: theme.typography.fontWeight.medium,
                marginTop: theme.spacing[1],
              }}>
                ${product.price.toFixed(2)}
              </Text>
              <Text style={{
                fontSize: theme.typography.xs,
                color: theme.colors.mutedForeground,
                backgroundColor: theme.colors.muted,
                paddingHorizontal: theme.spacing[2],
                paddingVertical: theme.spacing[1],
                borderRadius: theme.borderRadius.sm,
                alignSelf: 'flex-start',
                marginTop: theme.spacing[1],
              }}>
                SKU: {product.sku}
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              {/* Cart quantity indicator */}
              {cartQuantity > 0 && (
                <Animated.View style={[
                  {
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.borderRadius.full,
                    minWidth: 24,
                    height: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: theme.spacing[2],
                  },
                  { transform: [{ scale: pulseAnim }] }
                ]}>
                  <Text style={{
                    fontSize: theme.typography.xs,
                    color: theme.colors.primaryForeground,
                    fontWeight: theme.typography.fontWeight.bold,
                  }}>
                    {cartQuantity}
                  </Text>
                </Animated.View>
              )}
              <IconButton
                variant={cartQuantity > 0 ? "default" : "outline"}
                size="sm"
                onPress={handleAddToCart}
                iconName="add"
                iconFamily="MaterialIcons"
                iconPosition="left"
              >
                Add
              </IconButton>
              
              {/* Animated quantity feedback */}
              {showQuantity && (
                <Animated.View style={{
                  position: 'absolute',
                  top: -10,
                  right: 10,
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.borderRadius.full,
                  paddingHorizontal: theme.spacing[2],
                  paddingVertical: theme.spacing[1],
                  opacity: showQuantity ? 1 : 0,
                }}>
                  <Text style={{
                    fontSize: theme.typography.xs,
                    color: theme.colors.primaryForeground,
                    fontWeight: theme.typography.fontWeight.bold,
                  }}>
                    +1
                  </Text>
                </Animated.View>
              )}
            </View>
          </View>
        </CardContent>
      </Card>
    </Animated.View>
  );
};

const CustomerModal: React.FC<{
  visible: boolean;
  customers: Customer[];
  onClose: () => void;
  onSelectCustomer: (customer: SelectedCustomer) => void;
  onSearchCustomers: (query: string) => void;
}> = ({ visible, customers, onClose, onSelectCustomer, onSearchCustomers }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearchCustomers(query);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ padding: theme.spacing[4], flex: 1 }}>
          {/* Header */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: theme.spacing[4]
          }}>
            <Text style={{
              fontSize: theme.typography.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.foreground,
            }}>
              Select Customer
            </Text>
            <IconButton
              variant="ghost"
              size="sm"
              onPress={onClose}
              iconName="close"
              iconFamily="MaterialIcons"
            />
          </View>

          {/* Search */}
          <View style={{ marginBottom: theme.spacing[4] }}>
            <FormInput
              label="Search Customers"
              placeholder="Search by name, phone, or tax ID"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          {/* Customer List */}
          <ScrollView style={{ flex: 1 }}>
            {customers.map(customer => (
              <Card key={customer.id} style={{ marginBottom: theme.spacing[3] }}>
                <CardContent>
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: theme.typography.base,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.foreground,
                      }}>
                        {customer.name}
                      </Text>
                      <Text style={{
                        fontSize: theme.typography.sm,
                        color: theme.colors.mutedForeground,
                        marginTop: theme.spacing[1],
                      }}>
                        {customer.phone}
                      </Text>
                      {customer.companyName && (
                        <Text style={{
                          fontSize: theme.typography.sm,
                          color: theme.colors.primary,
                          marginTop: theme.spacing[1],
                        }}>
                          {customer.companyName}
                        </Text>
                      )}
                      {customer.taxId && (
                        <Text style={{
                          fontSize: theme.typography.xs,
                          color: theme.colors.mutedForeground,
                          marginTop: theme.spacing[1],
                        }}>
                          Tax ID: {customer.taxId}
                        </Text>
                      )}
                    </View>
                    <IconButton
                      variant="outline"
                      size="sm"
                      onPress={() => onSelectCustomer({
                        id: customer.id,
                        name: customer.name,
                        phone: customer.phone
                      })}
                      iconName="check"
                      iconFamily="MaterialIcons"
                    >
                      Select
                    </IconButton>
                  </View>
                </CardContent>
              </Card>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

function POSScreen() {
  const { products: allProducts, isLoading, error, loadProducts } = useProducts();
  const { customers, loadCustomers, searchCustomers } = useCustomers();
  const theme = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountInput, setDiscountInput] = useState('');

  // Animation for cart updates
  const cartCountAnim = useRef(new Animated.Value(1)).current;

  // Filter products based on search query
  const products = allProducts.filter(product => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, [loadProducts, loadCustomers]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });

    // Animate cart section when items are added
    Animated.sequence([
      Animated.timing(cartCountAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cartCountAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - (subtotal * discount / 100);
  };

  const handleApplyDiscount = () => {
    const discountValue = parseFloat(discountInput);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      Alert.alert('Invalid Discount', 'Please enter a valid discount percentage (0-100)');
      return;
    }
    setDiscount(discountValue);
    setShowDiscountModal(false);
    setDiscountInput('');
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add products to cart before proceeding with payment');
      return;
    }

    const total = calculateTotal();
    Alert.alert(
      'Process Payment',
      `Total: $${total.toFixed(2)}\nCustomer: ${selectedCustomer?.name || 'Walk-in Customer'}\n\nProceed with payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Process Payment',
          onPress: () => {
            // Here you would integrate with payment processing
            Alert.alert('Payment Successful', 'Transaction completed successfully!', [
              { text: 'OK', onPress: () => {
                setCart([]);
                setSelectedCustomer(null);
                setDiscount(0);
              }}
            ]);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Left Panel - Products */}
        <View style={{ flex: 1, padding: theme.spacing[4] }}>
          {/* Header */}
          <Text style={{
            fontSize: theme.typography['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.foreground,
            marginBottom: theme.spacing[4],
          }}>
            Point of Sale
          </Text>

          {/* Search */}
          <View style={{ marginBottom: theme.spacing[4] }}>
            <FormInput
              label="Search Products"
              placeholder="Search by name or barcode"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          {/* Error State */}
          {error && (
            <AlertComponent variant="destructive" style={{ marginBottom: theme.spacing[4] }}>
              <AlertDescription>{error}</AlertDescription>
            </AlertComponent>
          )}

          {/* Products List */}
          <ScrollView style={{ flex: 1 }}>
            {products.map(product => {
              const cartItem = cart.find(item => item.product.id === product.id);
              const cartQuantity = cartItem ? cartItem.quantity : 0;
              
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  cartQuantity={cartQuantity}
                />
              );
            })}
          </ScrollView>
        </View>

        {/* Right Panel - Cart */}
        <Animated.View style={{ 
          width: 350,
          backgroundColor: theme.colors.card,
          borderLeftWidth: 1,
          borderLeftColor: theme.colors.border,
          padding: theme.spacing[4],
          transform: [{ scale: cartCountAnim }]
        }}>
          {/* Cart Header */}
          <Text style={{
            fontSize: theme.typography.lg,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.foreground,
            marginBottom: theme.spacing[4],
          }}>
            Current Sale
          </Text>

          {/* Customer Selection */}
          <View style={{ marginBottom: theme.spacing[4] }}>
            <Text style={{
              fontSize: theme.typography.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.foreground,
              marginBottom: theme.spacing[2],
            }}>
              Customer
            </Text>
            <View style={{ flexDirection: 'row', gap: theme.spacing[2] }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: theme.typography.sm,
                  color: selectedCustomer ? theme.colors.foreground : theme.colors.mutedForeground,
                  padding: theme.spacing[3],
                  backgroundColor: theme.colors.background,
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}>
                  {selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.phone})` : 'Walk-in Customer'}
                </Text>
              </View>
              <IconButton
                variant="outline"
                size="sm"
                onPress={() => setShowCustomerModal(true)}
                iconName="person"
                iconFamily="MaterialIcons"
              >
                Select
              </IconButton>
            </View>
          </View>

          {/* Cart Items */}
          <ScrollView style={{ flex: 1, maxHeight: 300, marginBottom: theme.spacing[4] }}>
            {cart.map(item => (
              <View
                key={item.product.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: theme.spacing[3],
                  backgroundColor: theme.colors.background,
                  borderRadius: theme.borderRadius.md,
                  marginBottom: theme.spacing[2],
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: theme.typography.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.foreground,
                  }}>
                    {item.product.name}
                  </Text>
                  <Text style={{
                    fontSize: theme.typography.xs,
                    color: theme.colors.mutedForeground,
                  }}>
                    ${item.product.price.toFixed(2)} each
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] }}>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onPress={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                    iconName="remove"
                    iconFamily="MaterialIcons"
                  />
                  <Text style={{
                    fontSize: theme.typography.sm,
                    color: theme.colors.foreground,
                    minWidth: 20,
                    textAlign: 'center',
                  }}>
                    {item.quantity}
                  </Text>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onPress={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                    iconName="add"
                    iconFamily="MaterialIcons"
                  />
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onPress={() => handleRemoveFromCart(item.product.id)}
                    iconName="delete"
                    iconFamily="MaterialIcons"
                  />
                </View>
              </View>
            ))}
            {cart.length === 0 && (
              <Text style={{
                fontSize: theme.typography.sm,
                color: theme.colors.mutedForeground,
                textAlign: 'center',
                padding: theme.spacing[4],
              }}>
                Cart is empty
              </Text>
            )}
          </ScrollView>

          {/* Cart Summary */}
          <View style={{ 
            borderTopWidth: 1, 
            borderTopColor: theme.colors.border,
            paddingTop: theme.spacing[4]
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing[2] }}>
              <Text style={{ color: theme.colors.foreground }}>Subtotal:</Text>
              <Text style={{ color: theme.colors.foreground }}>${calculateSubtotal().toFixed(2)}</Text>
            </View>
            {discount > 0 && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing[2] }}>
                <Text style={{ color: theme.colors.mutedForeground }}>Discount ({discount}%):</Text>
                <Text style={{ color: theme.colors.mutedForeground }}>-${(calculateSubtotal() * discount / 100).toFixed(2)}</Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing[4] }}>
              <Text style={{ 
                fontSize: theme.typography.lg,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.foreground 
              }}>
                Total:
              </Text>
              <Text style={{ 
                fontSize: theme.typography.lg,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.foreground 
              }}>
                ${calculateTotal().toFixed(2)}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={{ gap: theme.spacing[3] }}>
              <View style={{ flexDirection: 'row', gap: theme.spacing[3] }}>
                <IconButton
                  variant="outline"
                  onPress={() => {
                    setShowDiscountModal(true);
                    setDiscountInput(discount.toString());
                  }}
                  style={{ flex: 1 }}
                  iconName="local-offer"
                  iconFamily="MaterialIcons"
                  iconPosition="left"
                >
                  Discount
                </IconButton>
              </View>
              <IconButton
                variant="default"
                onPress={handlePayment}
                disabled={cart.length === 0}
                iconName="payment"
                iconFamily="MaterialIcons"
                iconPosition="left"
              >
                Process Payment
              </IconButton>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Customer Selection Modal */}
      <CustomerModal
        visible={showCustomerModal}
        customers={customers}
        onClose={() => setShowCustomerModal(false)}
        onSelectCustomer={(customer) => {
          setSelectedCustomer(customer);
          setShowCustomerModal(false);
        }}
        onSearchCustomers={searchCustomers}
      />

      {/* Discount Modal */}
      <Modal
        visible={showDiscountModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDiscountModal(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: theme.spacing[4],
        }}>
          <View style={{
            backgroundColor: theme.colors.card,
            padding: theme.spacing[6],
            borderRadius: theme.borderRadius.lg,
            width: '100%',
            maxWidth: 400,
          }}>
            <Text style={{
              fontSize: theme.typography.lg,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.foreground,
              marginBottom: theme.spacing[4],
              textAlign: 'center',
            }}>
              Apply Discount
            </Text>
            <View style={{ marginBottom: theme.spacing[4] }}>
              <FormInput
                label="Discount Percentage"
                placeholder="Enter discount (0-100)"
                value={discountInput}
                onChangeText={setDiscountInput}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flexDirection: 'row', gap: theme.spacing[3] }}>
              <IconButton
                variant="outline"
                onPress={() => setShowDiscountModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </IconButton>
              <IconButton
                variant="default"
                onPress={handleApplyDiscount}
                style={{ flex: 1 }}
              >
                Apply
              </IconButton>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Export the component wrapped with authentication
export default withAuth(POSScreen);