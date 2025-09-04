import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, Alert, Modal, Animated, Easing, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../../contexts/ProductContext';
import { useCustomers } from '../../contexts/CustomerContext';
import { useOrders } from '../../contexts/OrderContext';
import { IconButton } from '../../components/IconButton';
import { FormInput } from '../../components/FormInput';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Alert as AlertComponent, AlertDescription } from '../../components/Alert';
import { Product } from '../../types/product';
import { Customer } from '../../types/customer';
import { PaymentMethod, CreateOrderData, OrderItem } from '../../types/order';
import { useTheme } from '../../theme';
import { withAuth } from '../../components/withAuth';

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
  const { t } = useTranslation();

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
      <Card style={{ 
        marginBottom: theme.spacing[1],
        position: 'relative'
      }}
 
      >
        <CardContent style={{ padding: theme.spacing[1] }}>
          {/* Product Image with Overlay */}
          <View style={{
            width: '100%',
            height: 200,
            backgroundColor: theme.colors.muted,
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing[3],
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Product Image or Placeholder */}
            {product.img ? (
              <Image source={{ uri: product.img }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
            ) : (
              <Text style={{
                fontSize: 24,
                color: theme.colors.mutedForeground,
                fontWeight: theme.typography.fontWeight.bold
              }}>
                {product.name.charAt(0).toUpperCase()}
              </Text>
            )}
            
            {/* Overlay with gradient background */}
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              paddingHorizontal: theme.spacing[2],
              paddingVertical: theme.spacing[1],
            }}>
              {/* Product Name */}
              <Text style={{
                fontSize: theme.typography.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: 'white',
                textAlign: 'center',
                marginBottom: theme.spacing[1],
              }} numberOfLines={1}>
                {product.name}
              </Text>
              
              {/* Product Price */}
              <Text style={{
                fontSize: theme.typography.xl,
                color: 'white',
                fontWeight: theme.typography.fontWeight.bold,
                textAlign: 'center',
              }}>
                {product.price.toFixed(2)}
              </Text>
            </View>
            
            {/* Cart quantity badge */}
            {cartQuantity > 0 && (
              <Animated.View style={[
                {
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.borderRadius.full,
                  minWidth: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
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
          </View>
          
          {/* Add to Cart Button */}
          <IconButton
            variant={cartQuantity > 0 ? "default" : "outline"}
            size="sm"
            onPress={handleAddToCart}
            iconName="add"
            iconFamily="MaterialIcons"
            iconPosition="left"
            style={{ width: '100%' }}
          > {t('common.add')} </IconButton>
          
          {/* Animated quantity feedback */}
          {showQuantity && (
            <Animated.View style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [{ translateX: -15 }, { translateY: -15 }],
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

function POSTabScreen() {
  const { t } = useTranslation();
  const { products: allProducts, isLoading, error, loadProducts } = useProducts();
  const { customers, loadCustomers, searchCustomers } = useCustomers();
  const { createOrder } = useOrders();
  const theme = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.QRCODE);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCreditSale, setIsCreditSale] = useState(false);

  // Animation for cart count
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

    // Animate cart count
    Animated.sequence([
      Animated.timing(cartCountAnim, {
        toValue: 1.2,
        duration: 150,
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

  const handleCreditSale = () => {
    setIsCreditSale(!isCreditSale);
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add products to cart before proceeding with payment');
      return;
    }

    const total = calculateTotal();
    
    try {
      // Create order items from cart
      const orderItems: Omit<OrderItem, 'id'>[] = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productSku: item.product.sku,
        unitPrice: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
        productBrand: item.product.brand,
        productCategory: item.product.category,
        productSize: item.product.size
      }));

      // Create order data
      const orderData: CreateOrderData = {
        items: orderItems,
        customer: selectedCustomer ? {
          id: selectedCustomer.id,
          name: selectedCustomer.name,
          phone: selectedCustomer.phone
        } : undefined,
        discountPercentage: discount,
        paymentMethod: isCreditSale ? PaymentMethod.CASH : paymentMethod, // Default to cash for credit sales
        notes: isCreditSale ? 'Credit Sale - Payment Pending' : undefined
      };

      // Create the order
      const newOrder = await createOrder(orderData);
      
      Alert.alert(
        isCreditSale ? 'Credit Sale Created' : 'Payment Successful',
        isCreditSale 
          ? `Order ${newOrder.orderNumber} created as credit sale!\nTotal: $${total.toFixed(2)}\nPayment pending - customer will pay later.`
          : `Order ${newOrder.orderNumber} completed successfully!\nTotal: $${total.toFixed(2)}`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Reset cart and customer selection
              setCart([]);
              setSelectedCustomer(null);
              setDiscount(0);
              setShowCart(false);
              setPaymentMethod(PaymentMethod.CASH);
              setIsCreditSale(false);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing[4] }}
      >
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: theme.spacing[4] 
        }}>
          <Text style={{
            fontSize: theme.typography['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.foreground,
          }}>
            {t('pos.title')}
          </Text>
          <View style={{ flexDirection: 'row', gap: theme.spacing[2] }}>
            <IconButton
              variant="outline"
              size="sm"
              onPress={() => {
                setShowDiscountModal(true);
                setDiscountInput(discount.toString());
              }}
              iconName="local-offer"
              iconFamily="MaterialIcons"
            >
              Discount {discount > 0 ? `(${discount}%)` : ''}
            </IconButton>
            <Animated.View style={{ transform: [{ scale: cartCountAnim }] }}>
              <IconButton
                variant={cart.length > 0 ? "default" : "outline"}
                size="sm"
                onPress={() => setShowCart(true)}
                iconName="shopping-cart"
                iconFamily="MaterialIcons"
              >
                {t('pos.cart')} ({cart.length})
              </IconButton>
            </Animated.View>
          </View>
        </View>

        {/* Customer Selection */}
        <Card style={{ marginBottom: theme.spacing[4] }}>
          {/* <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader> */}
          <CardContent style={{padding: theme.spacing[3]}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: theme.typography.sm,
                  color: selectedCustomer ? theme.colors.foreground : theme.colors.mutedForeground,
                  padding: theme.spacing[2],
                  backgroundColor: theme.colors.background,
                  // borderRadius: theme.borderRadius.md,
                  // borderWidth: 1,
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
                Customer
              </IconButton>
            </View>
          </CardContent>
        </Card>

        {/* Search */}
        <View>
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

        {/* Products Grid */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.spacing[3],
          justifyContent: 'space-between'
        }}>
          {products.map(product => {
            const cartItem = cart.find(item => item.product.id === product.id);
            const cartQuantity = cartItem ? cartItem.quantity : 0;
            
            return (
              <View key={product.id} style={{ width: '48%' }}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  cartQuantity={cartQuantity}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Cart Modal */}
      <Modal
        visible={showCart}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCart(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <View style={{ padding: theme.spacing[4], flex: 1 }}>
            {/* Cart Header */}
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
                {t('pos.title')}
              </Text>
              <IconButton
                variant="ghost"
                size="sm"
                onPress={() => setShowCart(false)}
                iconName="close"
                iconFamily="MaterialIcons"
              />
            </View>

            {/* Cart Items */}
            <ScrollView style={{ flex: 1, marginBottom: theme.spacing[4] }}>
              {cart.map(item => (
                <View
                  key={item.product.id}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: theme.spacing[3],
                    backgroundColor: theme.colors.card,
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
                  {t('pos.emptyCart')}
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
                <Text style={{ color: theme.colors.foreground }}>{t('pos.subTotal')}:</Text>
                <Text style={{ color: theme.colors.foreground }}>{calculateSubtotal().toFixed(2)}</Text>
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
                  {t('pos.total')}:
                </Text>
                <Text style={{ 
                  fontSize: theme.typography.lg,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.foreground 
                }}>
                  {calculateTotal().toFixed(2)}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={{ gap: theme.spacing[3] }}>
                {/* Payment Method Selection */}
                <View style={{
                  flexDirection: 'row',
                  gap: theme.spacing[2],
                  marginBottom: theme.spacing[2],
                  display: isCreditSale ? 'none': undefined
                }}>
                  <Text style={{
                    fontSize: theme.typography.sm,
                    color: theme.colors.foreground,
                    alignSelf: 'center',
                    minWidth: 80
                  }}>
                    {t('pos.selectPaymentMethod')}:
                  </Text>
                  <View style={{ flex: 1, flexDirection: 'row', gap: theme.spacing[1] }}>
                    {(['cash', 'qrcode', 'bank_transfer'] as PaymentMethod[]).map((method) => (
                      <IconButton
                        key={method}
                        variant={paymentMethod === method ? "default" : "outline"}
                        size="sm"
                        onPress={() => setPaymentMethod(method)}
                        style={{ flex: 1 }}
                      >
                        {t(`paymentMethod.${method}`)}
                      </IconButton>
                    ))}
                  </View>
                </View>
                
                <IconButton
                  variant={isCreditSale ? "default" : "outline"}
                  onPress={handleCreditSale}
                  iconName="credit-card"
                  iconFamily="MaterialIcons"
                  iconPosition="left"
                >
                  {t('pos.creditSale')}
                </IconButton>

                <IconButton
                  variant="default"
                  onPress={handlePayment}
                  disabled={cart.length === 0}
                  iconName={isCreditSale ? "assignment" : "payment"}
                  iconFamily="MaterialIcons"
                  iconPosition="left"
                >
                  {isCreditSale ? t('pos.confirmOrder') : t('pos.processPayment')}
                </IconButton>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

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
          padding: 16,
        }}>
          <View style={{
            backgroundColor: theme.colors.card,
            padding: 24,
            borderRadius: 8,
            width: '100%',
            maxWidth: 400,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: theme.colors.foreground,
              marginBottom: 16,
              textAlign: 'center',
            }}>
              Apply Discount
            </Text>
            <View style={{ marginBottom: 16 }}>
              <FormInput
                label="Discount Percentage"
                placeholder="Enter discount (0-100)"
                value={discountInput}
                onChangeText={setDiscountInput}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
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
export default withAuth(POSTabScreen);