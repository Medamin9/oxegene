import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orderMode, setOrderMode] = useState('DINE_IN');
  const [tableNumber, setTableNumber] = useState('Table 04 (Velvet Booth)');

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('oxegene_cart');
    const savedMode = localStorage.getItem('oxegene_order_mode');
    const savedTable = localStorage.getItem('oxegene_table_number');

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage');
      }
    }
    if (savedMode) setOrderMode(savedMode);
    if (savedTable) setTableNumber(savedTable);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('oxegene_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('oxegene_order_mode', orderMode);
  }, [orderMode]);

  useEffect(() => {
    localStorage.setItem('oxegene_table_number', tableNumber);
  }, [tableNumber]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, { ...item, id: Date.now().toString() }]);
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotal,
        getTotalItems,
        orderMode,
        setOrderMode,
        tableNumber,
        setTableNumber,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
