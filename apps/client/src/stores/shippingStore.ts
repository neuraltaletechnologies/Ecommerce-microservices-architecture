"use client";

import { DeliveryFormInputs } from "@repo/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SavedDeliveryAddress = DeliveryFormInputs & {
  id: string;
  label: string;
  isDefault: boolean;
};

type DeliveryStoreState = {
  // Saved addresses per user (keyed by Clerk user ID)
  savedAddresses: Record<string, SavedDeliveryAddress[]>;
  // Current delivery form data (persists during checkout flow)
  currentDeliveryData: DeliveryFormInputs | null;
  // Selected delivery method: "pickup" | "delivery"
  deliveryMethod: "pickup" | "delivery";
  hasHydrated: boolean;
};

type DeliveryStoreActions = {
  getSavedAddresses: (userId: string) => SavedDeliveryAddress[];
  addSavedAddress: (userId: string, address: Omit<SavedDeliveryAddress, "id">) => void;
  updateSavedAddress: (userId: string, addressId: string, address: Partial<SavedDeliveryAddress>) => void;
  deleteSavedAddress: (userId: string, addressId: string) => void;
  setDefaultAddress: (userId: string, addressId: string) => void;
  getDefaultAddress: (userId: string) => SavedDeliveryAddress | undefined;
  // Current delivery data actions
  setCurrentDeliveryData: (data: DeliveryFormInputs | null) => void;
  getCurrentDeliveryData: () => DeliveryFormInputs | null;
  clearCurrentDeliveryData: () => void;
  // Delivery method actions
  setDeliveryMethod: (method: "pickup" | "delivery") => void;
  getDeliveryMethod: () => "pickup" | "delivery";
  getShippingFee: () => number; // Returns 0 for pickup, 15000 TZS for delivery
  setHasHydrated: (state: boolean) => void;
};

const useDeliveryStore = create<DeliveryStoreState & DeliveryStoreActions>()(
  persist(
    (set, get) => ({
      savedAddresses: {},
      currentDeliveryData: null,
      deliveryMethod: "delivery",
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      // Delivery method
      setDeliveryMethod: (method) => set({ deliveryMethod: method }),
      
      getDeliveryMethod: () => get().deliveryMethod,
      
      // Calculate shipping fee based on delivery method
      getShippingFee: () => {
        const method = get().deliveryMethod;
        return method === "pickup" ? 0 : 15000; // 0 for pickup, 15,000 TZS for home delivery
      },

      // Current delivery data methods
      setCurrentDeliveryData: (data) => set({ currentDeliveryData: data }),
      
      getCurrentDeliveryData: () => get().currentDeliveryData,
      
      clearCurrentDeliveryData: () => set({ currentDeliveryData: null }),

      getSavedAddresses: (userId) => {
        return get().savedAddresses[userId] || [];
      },

      addSavedAddress: (userId, address) => {
        const newAddress: SavedDeliveryAddress = {
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
      name: "delivery-address-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useDeliveryStore;
