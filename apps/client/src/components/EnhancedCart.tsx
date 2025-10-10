"use client";

import useCartStore from "@/stores/cartStore";
import { ShoppingCart, Plus, Minus, Trash2, Heart, Tag, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const EnhancedCart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const discount = appliedPromo === "NEURALTALE10" ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal + shipping + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "NEURALTALE10") {
      setAppliedPromo("NEURALTALE10");
      toast.success("Promo code applied! 10% discount");
    } else if (promoCode.toUpperCase() === "FREESHIP") {
      setAppliedPromo("FREESHIP");
      toast.success("Free shipping applied!");
    } else {
      toast.error("Invalid promo code");
    }
    setPromoCode("");
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.info("Promo code removed");
  };

  const handleSaveForLater = (itemId: number) => {
    // In a real app, this would save to wishlist
    removeFromCart(itemId);
    toast.success("Item saved to wishlist");
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Shopping Cart ({cartItems.length} items)
          </h2>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-gray-200">
        {cartItems.map((item) => {
          const itemImage = Object.values(item.images as Record<string, string>)[0];
          
          return (
            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={itemImage}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.shortDescription}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Size: {item.selectedSize}</span>
                    <span>Color: {item.selectedColor}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        TZs {(item.price * item.quantity * 2300).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        TZs {(item.price * 2300).toLocaleString()} each
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={() => handleSaveForLater(item.id)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Heart className="w-4 h-4" />
                      Save for later
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Promo Code */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleApplyPromo}
            disabled={!promoCode.trim()}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Apply Code
          </button>
        </div>
        
        {appliedPromo && (
          <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                {appliedPromo === "NEURALTALE10" ? "10% off applied" : "Free shipping applied"}
              </span>
            </div>
            <button
              onClick={handleRemovePromo}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Shipping
            </span>
            <span className="text-gray-900">
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">${tax.toFixed(2)}</span>
          </div>
          
          <div className="border-t border-gray-300 pt-2 mt-2">
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {shipping > 0 && (
          <div className="mt-4 text-sm text-blue-600">
            Add ${(100 - subtotal).toFixed(2)} more for free shipping!
          </div>
        )}
        
        <div className="mt-6 space-y-3">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            Proceed to Checkout
          </button>
          <Link
            href="/products"
            className="block w-full text-center text-blue-600 hover:text-blue-700 font-medium py-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCart;