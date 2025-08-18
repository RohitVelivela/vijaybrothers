import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {
  CartView,
  CartItem,
  CartItemRequest,
  addToCart as apiAddToCart,
  getCart as apiGetCart,
  updateCartItemByProductId as apiUpdateCartItem,
  removeCartItemByProductId as apiRemoveCartItem,
  getCartItemCount as apiGetCartItemCount
} from '../lib/api';

interface CartContextType {
  cartView: CartView | null;
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartView, setCartView] = useState<CartView | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const cart = await apiGetCart();
      setCartView(cart);
      const count = await apiGetCartItemCount();
      setCartCount(count);
    } catch (error) {
      console.error('Failed to refresh cart:', error);
      // Initialize empty cart on error
      setCartView({ cartId: '', lines: [], subtotal: 0, grandTotal: 0 });
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      setLoading(true);
      const request: CartItemRequest = { productId, quantity };
      const updatedCart = await apiAddToCart(request);
      setCartView(updatedCart);
      const count = await apiGetCartItemCount();
      setCartCount(count);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      setLoading(true);
      const updatedCart = await apiRemoveCartItem(productId);
      setCartView(updatedCart);
      const count = await apiGetCartItemCount();
      setCartCount(count);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      setLoading(true);
      const updatedCart = await apiUpdateCartItem(productId, quantity);
      setCartView(updatedCart);
      const count = await apiGetCartItemCount();
      setCartCount(count);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cartCount;
  };

  return (
    <CartContext.Provider value={{
      cartView,
      cartItems: cartView?.lines || [],
      cartCount,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      refreshCart,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    // Return a default empty cart context for admin routes or when provider is missing
    return {
      cartView: null,
      cartItems: [],
      cartCount: 0,
      loading: false,
      addToCart: async () => {},
      removeFromCart: async () => {},
      updateQuantity: async () => {},
      refreshCart: async () => {},
      getCartItemCount: () => 0,
    } as CartContextType;
  }
  return context;
};
