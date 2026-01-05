"use client";

import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { CartItemsType, ShippingFormInputs } from "@repo/types";
import CheckoutForm from "./CheckoutForm";
import useCartStore from "@/stores/cartStore";

const stripe = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const fetchClientSecret = async (cart: CartItemsType, token: string) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
    {
      method: "POST",
      body: JSON.stringify({
        cart,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((json) => json.checkoutSessionClientSecret);
};

const StripePaymentForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const { cart } = useCartStore();
  const [token, setToken] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then((token) => setToken(token));
  }, [getToken]);

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

  return (
    <CheckoutProvider
      stripe={stripe}
      options={{ fetchClientSecret: () => fetchClientSecret(cart, token) }}
    >
      <CheckoutForm shippingForm={shippingForm} />
    </CheckoutProvider>
  );
};

export default StripePaymentForm;
