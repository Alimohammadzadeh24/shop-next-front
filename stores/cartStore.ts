'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalAmount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  return { totalItems, totalAmount };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalAmount: 0,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.productId === product.id);
          
          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.items.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const newItem: CartItem = {
              productId: product.id,
              product,
              quantity,
              unitPrice: product.price,
            };
            newItems = [...state.items, newItem];
          }

          const { totalItems, totalAmount } = calculateTotals(newItems);
          
          return {
            items: newItems,
            totalItems,
            totalAmount,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => {
          const newItems = state.items.filter(item => item.productId !== productId);
          const { totalItems, totalAmount } = calculateTotals(newItems);
          
          return {
            items: newItems,
            totalItems,
            totalAmount,
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => {
          const newItems = state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          );
          
          const { totalItems, totalAmount } = calculateTotals(newItems);
          
          return {
            items: newItems,
            totalItems,
            totalAmount,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0,
        });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { totalItems, totalAmount } = calculateTotals(state.items);
          state.totalItems = totalItems;
          state.totalAmount = totalAmount;
        }
      },
    }
  )
);