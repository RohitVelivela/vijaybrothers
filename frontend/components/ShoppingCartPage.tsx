import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProgressBar from './ProgressBar'; // Import ProgressBar

const ShoppingCartPage: React.FC = () => {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(50); // Example shipping cost
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + shipping);
  }, [cartItems, shipping]);

  const handleQuantityChange = (id: number, delta: number) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + delta);
    }
  };

  const handleCheckout = () => {
    router.push('/address'); // Assuming '/address' is the next step in the checkout process
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen max-w-screen-xl font-sans">
      <ProgressBar currentStep="cart" />
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">My Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <p className="text-gray-600 text-base mb-4">Your cart is currently empty.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-6">
            <div className="hidden md:grid grid-cols-5 gap-4 pb-3 border-b border-gray-200 font-semibold text-gray-700 text-sm">
              <div className="col-span-2">Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>
            {cartItems.map(item => (
              <div key={item.id} className="grid grid-cols-5 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0">
                <div className="col-span-2 flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md shadow-sm" />
                  <span className="font-medium text-gray-800 text-sm">{item.name}</span>
                </div>
                <div className="text-gray-700 text-sm">₹{item.price.toLocaleString()}</div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="bg-gray-200 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="font-medium text-gray-800 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="bg-gray-200 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
                <div className="font-semibold text-gray-900 text-sm">₹{(item.price * item.quantity).toLocaleString()}</div>
                <div className="flex justify-end">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    aria-label="Remove item"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-5 border-b pb-3">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Shipping</span>
                <span>₹{shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-3 mt-3">
                <span>Order Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mt-6"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCartPage;
