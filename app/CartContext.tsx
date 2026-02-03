"use client";
import React, { createContext, useContext, useState } from "react";

// Define the shape of a cart item
export interface CartItem {
  productId: string;
  variantId: string;
  productTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  image?: {
    url: string;
    altText?: string;
  };
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  quantity: number;
}

// Define the context type
interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Function to add an item to the cart
  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.variantId === item.variantId);

      if (existingItem) {
        return prevItems.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  // Function to remove an item from the cart
  const removeItem = (variantId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.variantId !== variantId));
  };

  // Function to clear the cart
  const clearCart = () => {
    setItems([]);
  };

  // Function to get the total price of items in the cart
  const getTotalPrice = () => {
    const total = items.reduce((sum, item) => {
      return sum + parseFloat(item.price.amount) * item.quantity;
    }, 0);
    return total.toFixed(2);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
