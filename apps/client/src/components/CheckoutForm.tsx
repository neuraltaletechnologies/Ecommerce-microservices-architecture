"use client";

import { DeliveryFormInputs } from "@repo/types";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js";
import { ConfirmError } from "@stripe/stripe-js";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/stores/cartStore";
import useDeliveryStore from "@/stores/deliveryStore";
import { CreditCard, ArrowRight, Loader2 } from "lucide-react";

const CheckoutForm = ({
  deliveryForm,
}: {
  deliveryForm: DeliveryFormInputs;
}) => {
  const checkout = useCheckout();
  const router = useRouter();
  const { clearCart } = useCartStore();
  const { clearCurrentDeliveryData } = useDeliveryStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ConfirmError | null>(null);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await checkout.updateEmail(deliveryForm.email);
      await checkout.updateShippingAddress({
        name: "shipping_address",
        address: {
          line1: deliveryForm.address,
          city: deliveryForm.city,
          country: "TZ",
        },
      });

      const res = await checkout.confirm();
      if (res.type === "error") {
        setError(res.error);
        setLoading(false);
      } else {
        // Payment successful - clear cart, delivery data and redirect to return page
        clearCart();
        clearCurrentDeliveryData();
        // The session ID is available from the confirm result
        const sessionId = res.session?.id || "";
        router.push("/return?session_id=" + sessionId);
      }
    } catch (err) {
      setLoading(false);
      console.error("Payment error:", err);
    }
  };

  return (
    <form className="space-y-6">
      <PaymentElement 
        options={{ 
          layout: "tabs",
        }} 
      />
      <button 
        type="submit"
        disabled={loading} 
        onClick={handleClick}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:from-green-800 active:to-green-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-lg shadow-xl shadow-green-600/30 hover:shadow-2xl hover:shadow-green-600/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 group"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Pay Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error.message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
