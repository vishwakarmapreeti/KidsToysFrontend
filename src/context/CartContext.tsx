import {
  createContext, useContext, useState,
  useEffect, useCallback, type ReactNode,
} from 'react';
import cartService, { type Cart } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart:          Cart | null;
  cartCount:     number;
  isLoading:     boolean;
  isCartOpen:    boolean;
  openCart:      () => void;
  closeCart:     () => void;
  addToCart:     (productId: string, quantity?: number) => Promise<void>;
  updateItem:    (itemId: string, quantity: number) => Promise<void>;
  removeItem:    (itemId: string) => Promise<void>;
  clearCart:     () => Promise<void>;
  fetchCart:     () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart]         = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await cartService.getCart();
      setCart(res.data.cart);
    } catch {
      setCart(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    setIsLoading(true);
    try {
      const res = await cartService.addToCart(productId, quantity);
      setCart(res.data.cart);
      setIsCartOpen(true); // cart drawer open karo
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    try {
      const res = await cartService.updateItem(itemId, quantity);
      setCart(res.data.cart);
    } catch (err: any) {
      throw err;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await cartService.removeItem(itemId);
      setCart(res.data.cart);
    } catch (err: any) {
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <CartContext.Provider value={{
      cart, cartCount, isLoading, isCartOpen,
      openCart:  () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addToCart, updateItem, removeItem, clearCart, fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
