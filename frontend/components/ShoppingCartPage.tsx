import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { X, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProgressBar from './ProgressBar'; // Import ProgressBar

const ShoppingCartPage: React.FC = () => {
  const router = useRouter();
  const { cartView, cartItems, removeFromCart, updateQuantity, loading, refreshCart } = useCart();
  
  // Track loading state for individual items (only for remove operations)
  const [loadingItems, setLoadingItems] = useState<{ [key: number]: boolean }>({});
  
  // Local state for quantities to allow immediate updates
  const [localQuantities, setLocalQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    refreshCart();
  }, []);

  // Initialize local quantities when cart items change
  useEffect(() => {
    const quantities: { [key: number]: number } = {};
    cartItems.forEach(item => {
      quantities[item.productId] = item.quantity;
    });
    setLocalQuantities(quantities);
  }, [cartItems]);

  const handleQuantityChange = (productId: number, delta: number) => {
    const currentQuantity = localQuantities[productId] || 0;
    const newQuantity = currentQuantity + delta;
    
    if (newQuantity > 0) {
      // Update local state immediately for instant UI feedback
      setLocalQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
      }));
      
      // Debounced API call (we can add this later if needed)
      // For now, just update locally for instant feedback
    }
  };

  const handleRemoveItem = async (productId: number) => {
    // Prevent action if already loading this item
    if (loadingItems[productId]) return;
    
    try {
      setLoadingItems(prev => ({ ...prev, [productId]: true }));
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setLoadingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleCheckout = () => {
    router.push('/address');
  };

  // Calculate subtotal using local quantities for instant updates
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const quantity = localQuantities[item.productId] || item.quantity;
      return sum + (item.price * quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <ProgressBar currentStep="cart" />
        
        {loading ? (
          <div className="bg-white shadow-sm rounded-lg p-8 text-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-8 text-center mt-8">
            <p className="text-gray-600 mb-4">Your cart is currently empty.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-md transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Cart Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shopping Cart Header */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Shopping Cart <span className="text-gray-500 font-normal">(Items {cartItems.length})</span>
                </h2>

                {/* Table Headers */}
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b text-sm font-medium text-gray-600 uppercase">
                  <div className="col-span-6">Product Details</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Total</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Cart Items */}
                {cartItems.map((item) => {
                  const isItemLoading = loadingItems[item.productId];
                  const currentQuantity = localQuantities[item.productId] || item.quantity;
                  const lineTotal = item.price * currentQuantity;
                  
                  return (
                    <div key={item.cartItemId} className={`grid grid-cols-12 gap-4 py-6 border-b border-gray-100 items-start ${isItemLoading ? 'opacity-60' : ''}`}>
                      {/* Product Details */}
                      <div className="col-span-12 md:col-span-6 flex gap-4">
                        <img 
                          src={item.mainImageUrl} 
                          alt={item.name} 
                          className="w-24 h-32 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">SKU: {item.productCode}</p>
                          <h3 className="font-medium text-gray-800 mb-2">{item.name}</h3>
                          <p className="text-lg font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-6 md:col-span-2 flex items-center justify-start md:justify-center">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.productId, -1)}
                            disabled={currentQuantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 min-w-[50px] text-center">
                            {currentQuantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-5 md:col-span-3 text-right">
                        <p className="text-lg font-semibold">₹{lineTotal.toLocaleString()}</p>
                      </div>

                      {/* Remove */}
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={isItemLoading}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isItemLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <X className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Continue Shopping Link */}
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/')}
                    className="text-purple-500 hover:text-purple-600 font-medium flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Order Summary <span className="text-gray-500 font-normal text-sm">(Items {cartItems.length})</span>
                </h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Total MRP</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition"
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;
