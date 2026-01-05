"use client";

import { ShippingFormInputs } from "@repo/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SavedShippingAddress = ShippingFormInputs & {
  id: string;
  label: string;
  isDefault: boolean;
};

type ShippingStoreState = {
  // Saved addresses per user (keyed by Clerk user ID)
  savedAddresses: Record<string, SavedShippingAddress[]>;
  hasHydrated: boolean;
};

type ShippingStoreActions = {
  getSavedAddresses: (userId: string) => SavedShippingAddress[];
  addSavedAddress: (userId: string, address: Omit<SavedShippingAddress, "id">) => void;
  updateSavedAddress: (userId: string, addressId: string, address: Partial<SavedShippingAddress>) => void;
  deleteSavedAddress: (userId: string, addressId: string) => void;
  setDefaultAddress: (userId: string, addressId: string) => void;
  getDefaultAddress: (userId: string) => SavedShippingAddress | undefined;
  setHasHydrated: (state: boolean) => void;
};

const useShippingStore = create<ShippingStoreState & ShippingStoreActions>()(
  persist(
    (set, get) => ({
      savedAddresses: {},
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      getSavedAddresses: (userId) => {
        return get().savedAddresses[userId] || [];
      },

      addSavedAddress: (userId, address) => {
        const newAddress: SavedShippingAddress = {
          ...address,
          id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        
        set((state) => {
          const userAddresses = state.savedAddresses[userId] || [];
          // If this is the first address or marked as default, make it default
          const isFirstOrDefault = userAddresses.length === 0 || address.isDefault;
          
          // If setting as default, unset others
          const updatedAddresses = isFirstOrDefault
            ? userAddresses.map((a) => ({ ...a, isDefault: false }))
            : userAddresses;

          return {
            savedAddresses: {
              ...state.savedAddresses,
              [userId]: [...updatedAddresses, { ...newAddress, isDefault: isFirstOrDefault }],
            },
          };
        });
      },

      updateSavedAddress: (userId, addressId, updates) => {
        set((state) => {
          const userAddresses = state.savedAddresses[userId] || [];
          return {
            savedAddresses: {
              ...state.savedAddresses,
              [userId]: userAddresses.map((addr) =>
                addr.id === addressId ? { ...addr, ...updates } : addr
              ),
            },
          };
        });
      },

      deleteSavedAddress: (userId, addressId) => {
        set((state) => {
          const userAddresses = state.savedAddresses[userId] || [];
          const filteredAddresses = userAddresses.filter((addr) => addr.id !== addressId);
          
          // If we deleted the default, make the first one default
          if (filteredAddresses.length > 0 && !filteredAddresses.some((a) => a.isDefault)) {
            const firstAddress = filteredAddresses[0];
            if (firstAddress) {
              firstAddress.isDefault = true;
            }
          }

          return {
            savedAddresses: {
              ...state.savedAddresses,
              [userId]: filteredAddresses,
            },
          };
        });
      },

      setDefaultAddress: (userId, addressId) => {
        set((state) => {
          const userAddresses = state.savedAddresses[userId] || [];
          return {
            savedAddresses: {
              ...state.savedAddresses,
              [userId]: userAddresses.map((addr) => ({
                ...addr,
                isDefault: addr.id === addressId,
              })),
            },
          };
        });
      },

      getDefaultAddress: (userId) => {
        const userAddresses = get().savedAddresses[userId] || [];
        return userAddresses.find((addr) => addr.isDefault);
      },
    }),
    {
      name: "shipping-address-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useShippingStore;
