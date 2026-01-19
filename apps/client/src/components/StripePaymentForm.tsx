"use client";

import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { CartItemsType, DeliveryFormInputs } from "@repo/types";
import CheckoutForm from "./CheckoutForm";
import useCartStore from "@/stores/cartStore";
import { AlertCircle, RefreshCw } from "lucide-react";

const stripe = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const fetchClientSecret = async (cart: CartItemsType, token: string): Promise<string> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
      {
        method: "POST",
        body: JSON.stringify({ cart }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.ok) {
      let errorMessage = "Failed to create checkout session";
      try {
        const errorJson = await response.json();
        console.error("Payment service error response:", response.status, errorJson);
        errorMessage = errorJson.error?.message || errorJson.error || errorMessage;
      } catch {
        const errorText = await response.text();
        console.error("Payment service error text:", response.status, errorText);
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const json = await response.json();
    console.log("Payment service response:", json);
    
    if (json.error) {
      const errorMessage = typeof json.error === 'object' 
        ? json.error.message || JSON.stringify(json.error)
        : String(json.error);
      console.error("Payment service returned error object:", json.error);
      console.error("Parsed error message:", errorMessage);
      throw new Error(errorMessage);
    }
    
    // Check for various possible property names
    const clientSecret = 
      json.checkoutSessionClientSecret || 
      json.client_secret || 
      json.clientSecret ||
      json.sessionClientSecret;
    
    if (!clientSecret) {
      console.error("No client secret found. Full response:", JSON.stringify(json));
      console.error("Response object keys:", Object.keys(json));
      throw new Error(`No client secret in response. Available keys: ${Object.keys(json).join(', ')}`);
    }
    
    console.log("Successfully obtained client secret");
    return clientSecret;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("fetchClientSecret error:", errorMsg);
    console.error("Full error object:", error);
    throw error;
  }
};

const StripePaymentForm = ({
  deliveryForm,
}: {
  deliveryForm: DeliveryFormInputs;
}) => {
  const { cart } = useCartStore();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    
    getToken()
      .then((token) => {
        if (token) {
          setToken(token);
        } else {
          setError("Failed to authenticate. Please sign in again.");
        }
      })
      .catch((err) => {
        console.error("Error getting token:", err);
        setError("Failed to authenticate. Please sign in again.");
      });
  }, [getToken, isLoaded]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setError(null);
    try {
      const newToken = await getToken();
      if (newToken) {
        setToken(newToken);
      } else {
        setError("Failed to authenticate. Please sign in again.");
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
      setError("Failed to refresh session. Please try again.");
    } finally {
      setIsRetrying(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span>Initializing...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span>Loading payment form...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
          {isRetrying ? "Retrying..." : "Try Again"}
        </button>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-gray-600 text-sm">Your cart is empty</p>
          <p className="text-gray-500 text-xs mt-1">Add items to proceed with payment</p>
        </div>
      </div>
    );
  }

  return (
    <CheckoutProvider
      stripe={stripe}
      options={{
        fetchClientSecret: async () => {
          try {
            return await fetchClientSecret(cart, token);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Payment initialization failed");
            throw err;
          }
        },
      }}
    >
      <CheckoutForm deliveryForm={deliveryForm} />
    </CheckoutProvider>
  );
};

export default StripePaymentForm;
