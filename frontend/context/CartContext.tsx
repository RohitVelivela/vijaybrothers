import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      const response = await fetch('/api/cart');
      const cart = await response.json();
      setCartItems(cart.items || []);
    };
    fetchCart();
  }, []);

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: item.id, quantity: 1 }),
    });
    const cart = await response.json();
    setCartItems(cart.items || []);
  };

  const removeFromCart = async (id: number) => {
    const response = await fetch(`/api/cart/items/by-product/${id}`, {
      method: 'DELETE',
    });
    const cart = await response.json();
    setCartItems(cart.items || []);
  };

  const updateQuantity = async (id: number, quantity: number) => {
    const response = await fetch(`/api/cart/items/by-product/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      }
    );
    const cart = await response.json();
    setCartItems(cart.items || []);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
