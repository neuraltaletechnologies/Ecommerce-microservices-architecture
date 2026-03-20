import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductType } from '@repo/types';

interface WishlistStoreState {
  wishlist: ProductType[];
  hasHydrated: boolean;
  addToWishlist: (product: ProductType) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  setHasHydrated: (state: boolean) => void;
}

const useWishlistStore = create<WishlistStoreState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      hasHydrated: false,
      
      setHasHydrated: (state) => set({ hasHydrated: state }),
      
      addToWishlist: (product: ProductType) => {
        set((state) => {
          // Check if product already exists
          if (!state.wishlist.find(p => p.id === product.id)) {
            return {
              wishlist: [...state.wishlist, product]
            };
          }
          return state;
        });
      },
      
      removeFromWishlist: (productId: number) => {
        set((state) => ({
          wishlist: state.wishlist.filter(p => p.id !== productId)
        }));
      },
      
      isInWishlist: (productId: number) => {
        return get().wishlist.some(p => p.id === productId);
      },
      
      clearWishlist: () => {
        set({ wishlist: [] });
      },
    }),
    {
      name: 'wishlist-storage',
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useWishlistStore;
