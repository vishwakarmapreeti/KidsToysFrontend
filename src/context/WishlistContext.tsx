import {
  createContext, useContext, useState,
  useEffect, useCallback, type ReactNode,
} from 'react';
import wishlistService, { type WishlistProduct } from '../services/wishlistService';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist:       WishlistProduct[];
  wishlistCount:  number;
  isInWishlist:   (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<{ added: boolean }>;
  fetchWishlist:  () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await wishlistService.getWishlist();
      setWishlist(res.data.wishlist.products);
    } catch {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId: string) =>
    wishlist.some(p => p._id === productId);

  const toggleWishlist = async (productId: string) => {
    try {
      const res = await wishlistService.toggle(productId);
      await fetchWishlist(); // refresh
      return { added: res.data.added };
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount: wishlist.length,
      isInWishlist,
      toggleWishlist,
      fetchWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}