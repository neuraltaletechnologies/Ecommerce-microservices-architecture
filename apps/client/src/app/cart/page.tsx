"use client";

import DeliveryForm from "@/components/DeliveryForm";
import StripePaymentForm from "@/components/StripePaymentForm";
import useCartStore from "@/stores/cartStore";
import useDeliveryStore from "@/stores/deliveryStore";
import { formatTzs } from "@/utils/currency";
import { DeliveryFormInputs } from "@repo/types";
import { ArrowRight, ArrowLeft, Trash2, ShoppingBag, Package, CreditCard, Minus, Plus, Edit2, Lock, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

const steps = [
  {
    id: 1,
    title: "Shopping Cart",
  },
  {
    id: 2,
    title: "Delivery Address",
  },
  {
    id: 3,
    title: "Confirm Order",
  },
];

// TEMPORARY
// const cartItems: CartItemsType = [
//   {
//     id: 1,
//     name: "Adidas CoreFit T-Shirt",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 39.9,
//     sizes: ["s", "m", "l", "xl", "xxl"],
//     colors: ["gray", "purple", "green"],
//     images: {
//       gray: "/products/1g.png",
//       purple: "/products/1p.png",
//       green: "/products/1gr.png",
//     },
//     quantity: 1,
//     selectedSize: "m",
//     selectedColor: "gray",
//   },
//   {
//     id: 2,
//     name: "Puma Ultra Warm Zip",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 59.9,
//     sizes: ["s", "m", "l", "xl"],
//     colors: ["gray", "green"],
//     images: { gray: "/products/2g.png", green: "/products/2gr.png" },
//     quantity: 1,
//     selectedSize: "l",
//     selectedColor: "gray",
//   },
//   {
//     id: 3,
//     name: "Nike Air Essentials Pullover",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 69.9,
//     sizes: ["s", "m", "l"],
//     colors: ["green", "blue", "black"],
//     images: {
//       green: "/products/3gr.png",
//       blue: "/products/3b.png",
//       black: "/products/3bl.png",
//     },
//     quantity: 1,
//     selectedSize: "l",
//     selectedColor: "black",
//   },
// ];

const CartPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const { cart, removeFromCart, updateCartItem, hasHydrated: cartHydrated } = useCartStore();
  const { 
    currentDeliveryData, 
    setCurrentDeliveryData,
    setDeliveryMethod,
    hasHydrated: deliveryHydrated 
  } = useDeliveryStore();
  
  // Use persisted delivery data or undefined
  const [deliveryForm, setDeliveryFormState] = useState<DeliveryFormInputs | undefined>(undefined);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<"pickup" | "delivery">("delivery");
  const [shippingFee, setShippingFee] = useState(15000); // Default to delivery cost
  
  // Mark component as mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Sync with persisted data after hydration
  useEffect(() => {
    if (deliveryHydrated && currentDeliveryData) {
      setDeliveryFormState(currentDeliveryData);
    }
  }, [deliveryHydrated, currentDeliveryData]);
  
  // Update delivery form and persist it
  const setDeliveryForm = (data: DeliveryFormInputs) => {
    setDeliveryFormState(data);
    setCurrentDeliveryData(data);
  };

  // Handle delivery method change
  const handleDeliveryMethodChange = (method: "pickup" | "delivery") => {
    setSelectedDeliveryMethod(method);
    setDeliveryMethod(method);
    setShippingFee(method === "pickup" ? 0 : 15000);
  };

  const activeStep = parseInt(searchParams.get("step") || "1");
  
  // Wait for hydration before showing cart data
  if (!mounted || !cartHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span>Loading cart...</span>
        </div>
      </div>
    );
  }
  
  const isEmpty = cart.length === 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* TITLE */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2">Your Shopping Cart</h1>
          <p className="text-gray-600 text-sm lg:text-base">{isEmpty ? "Your cart is empty" : `${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`}</p>
        </div>
        
        {/* STEPS */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 mb-12">
          {steps.map((step, index) => {
            return (
            <div key={step.id} className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (step.id < activeStep) {
                    // Can always go back to previous steps
                    router.push(`/cart?step=${step.id}`, { scroll: false });
                  }
                }}
                disabled={step.id >= activeStep}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                  step.id === activeStep 
                    ? "bg-gradient-to-r from-[#001E3C] to-[#0A7EA4] shadow-lg shadow-[#001E3C]/20" 
                    : step.id < activeStep
                    ? "bg-green-50 border border-green-200 cursor-pointer hover:bg-green-100 hover:border-green-300"
                    : "bg-gray-100 border border-gray-200 cursor-not-allowed opacity-60"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    step.id === activeStep 
                      ? "bg-[#FDB913] text-[#001E3C]" 
                      : step.id < activeStep
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-400"
                  }`}
                >
                  {step.id < activeStep ? "✓" : step.id}
                </div>
                <p
                  className={`text-sm lg:text-base font-semibold whitespace-nowrap transition-all duration-300 ${
                    step.id === activeStep 
                      ? "text-white" 
                      : step.id < activeStep
                      ? "text-green-700"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
              </button>
              {index < steps.length - 1 && (
                <div className={`hidden lg:block w-12 h-0.5 ${step.id < activeStep ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
            );
          })}
        </div>
        {/* STEPS & DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              {activeStep === 1 ? (
                <div className="p-6 lg:p-8">
                  {isEmpty ? (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                      <p className="text-gray-600 mb-8">Add some items to get started!</p>
                      <button
                        onClick={() => router.push("/")}
                        className="inline-flex items-center gap-2 bg-[#FDB913] hover:bg-[#e5a811] text-[#001E3C] px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-[#FDB913]/20 hover:shadow-xl hover:shadow-[#FDB913]/30 hover:scale-105"
                      >
                        Continue Shopping
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cart.map((item) => {
                        const itemKey = item.id + item.selectedSize + item.selectedColor;
                        const isEditing = editingItem === itemKey;
                        
                        return (
                        // SINGLE CART ITEM
                        <div
                          className="group flex flex-col lg:flex-row items-start gap-4 lg:gap-6 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0 hover:bg-gray-50/50 -mx-6 px-6 lg:-mx-8 lg:px-8 py-4 rounded-xl transition-all duration-300"
                          key={itemKey}
                        >
                          {/* IMAGE */}
                          <div className="relative w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                            <Image
                              src={(() => {
                                try {
                                  const images = item.images as Record<string, string | string[]>;
                                  const imageValue = images?.[item.selectedColor];
                                  const result = Array.isArray(imageValue) ? imageValue[0] : imageValue;
                                  return result && typeof result === 'string' ? result : "/products/placeholder.jpg";
                                } catch {
                                  return "/products/placeholder.jpg";
                                }
                              })()}
                              alt={item.name}
                              fill
                              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          
                          {/* DETAILS */}
                          <div className="flex-1 w-full space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-base lg:text-lg font-semibold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors mb-3">
                                  {item.name}
                                </h3>
                                
                                {isEditing ? (
                                  // EDITING MODE
                                  <div className="space-y-4 bg-[#FDB913]/10 border border-[#FDB913]/30 rounded-xl p-4">
                                    {/* Quantity Editor */}
                                    <div className="flex items-center gap-3">
                                      <label className="text-sm font-semibold text-gray-900 w-20">Quantity:</label>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => {
                                            if (item.quantity > 1) {
                                              updateCartItem(item, { quantity: item.quantity - 1 });
                                            }
                                          }}
                                          disabled={item.quantity <= 1}
                                          className="w-8 h-8 rounded-lg bg-white border-2 border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                                          aria-label="Decrease quantity"
                                        >
                                          <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-semibold text-gray-900">{item.quantity}</span>
                                        <button
                                          onClick={() => updateCartItem(item, { quantity: item.quantity + 1 })}
                                          className="w-8 h-8 rounded-lg bg-white border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center transition-all"
                                          aria-label="Increase quantity"
                                        >
                                          <Plus className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Size Selector */}
                                    <div className="flex items-center gap-3">
                                      <label className="text-sm font-semibold text-gray-900 w-20">Size:</label>
                                      <div className="flex flex-wrap gap-2">
                                        {item.sizes?.map((size) => (
                                          <button
                                            key={size}
                                            onClick={() => updateCartItem(item, { selectedSize: size })}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border-2 ${
                                              item.selectedSize === size
                                                ? "bg-gray-900 text-white border-gray-900"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                            }`}
                                          >
                                            {size.toUpperCase()}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Color Selector */}
                                    <div className="flex items-center gap-3">
                                      <label className="text-sm font-semibold text-gray-900 w-20">Color:</label>
                                      <div className="flex flex-wrap gap-2">
                                        {item.colors?.map((color) => (
                                          <button
                                            key={color}
                                            onClick={() => updateCartItem(item, { selectedColor: color })}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all border-2 ${
                                              item.selectedColor === color
                                                ? "bg-gray-900 text-white border-gray-900"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                            }`}
                                          >
                                            {color}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Done Button */}
                                    <div className="flex justify-end pt-2">
                                      <button
                                        onClick={() => setEditingItem(null)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-all"
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  // VIEW MODE
                                  <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs lg:text-sm text-gray-600">
                                      <span className="inline-flex items-center gap-1">
                                        <span className="font-medium text-gray-900">Qty:</span> {item.quantity}
                                      </span>
                                      <span className="inline-flex items-center gap-1">
                                        <span className="font-medium text-gray-900">Size:</span> 
                                        <span className="uppercase">{item.selectedSize}</span>
                                      </span>
                                      <span className="inline-flex items-center gap-1.5">
                                        <span className="font-medium text-gray-900">Color:</span>
                                        <span className="capitalize">{item.selectedColor}</span>
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => setEditingItem(itemKey)}
                                      className="inline-flex items-center gap-1.5 text-xs lg:text-sm text-[#0A7EA4] hover:text-[#001E3C] font-medium transition-colors"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                      Edit options
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* DELETE BUTTON */}
                              <button
                                onClick={() => removeFromCart(item)}
                                className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-red-50 hover:bg-red-100 active:bg-red-200 transition-all duration-300 text-red-500 hover:text-red-600 flex items-center justify-center cursor-pointer group/delete hover:shadow-md hover:scale-110 flex-shrink-0"
                                aria-label={`Remove ${item.name} from cart`}
                                title={`Remove ${item.name} from cart`}
                              >
                                <Trash2 className="w-4 h-4 lg:w-5 lg:h-5 group-hover/delete:scale-110 transition-transform" />
                              </button>
                            </div>

                            {/* PRICE */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <span className="text-sm text-gray-600">Item total:</span>
                              <p className="font-bold text-lg lg:text-xl text-gray-900">
                                {formatTzs(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : activeStep === 2 ? (
                <div className="p-6 lg:p-8">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-[#FDB913]/20 text-[#001E3C] px-4 py-2 rounded-lg mb-4">
                      <Package className="w-5 h-5" />
                      <span className="font-medium text-sm">Delivery Information</span>
                    </div>
                  </div>
                  <DeliveryForm setDeliveryForm={setDeliveryForm} initialData={deliveryForm} />
                </div>
              ) : activeStep === 3 && deliveryForm ? (
                // Confirm Order Section - Redesigned
                <div className="p-6 lg:p-8">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#001E3C] to-[#0A7EA4] rounded-2xl flex items-center justify-center shadow-lg shadow-[#001E3C]/20">
                        <CreditCard className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Complete Your Order</h3>
                        <p className="text-sm text-gray-500">Review details and pay securely</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push("/cart?step=1", { scroll: false })}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Cart
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Delivery Address */}
                    <div className="bg-gradient-to-r from-[#001E3C]/5 to-[#0A7EA4]/5 border border-[#0A7EA4]/20 rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#0A7EA4]" />
                          Delivery Address
                        </h4>
                        <button
                          type="button"
                          onClick={() => router.push("/cart?step=2", { scroll: false })}
                          className="text-xs text-[#0A7EA4] hover:text-[#001E3C] font-semibold transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="font-semibold text-gray-900">{deliveryForm.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{deliveryForm.address}</p>
                        <p className="text-sm text-gray-600">{deliveryForm.city}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-700">Phone:</span> {deliveryForm.phone}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-700">Email:</span> {deliveryForm.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Method */}
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Delivery Method
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <label className={`relative flex items-center gap-3 p-4 bg-white border-2 rounded-xl hover:border-gray-300 cursor-pointer transition-all ${
                          selectedDeliveryMethod === "pickup" 
                            ? "border-[#FDB913] bg-[#FDB913]/10" 
                            : "border-gray-200"
                        }`}>
                          <input 
                            type="radio" 
                            name="delivery" 
                            value="pickup" 
                            checked={selectedDeliveryMethod === "pickup"}
                            onChange={() => handleDeliveryMethodChange("pickup")}
                            className="w-4 h-4 text-[#FDB913] focus:ring-[#FDB913]" 
                          />
                          <div>
                            <span className="font-semibold text-gray-900 text-sm block">Store Pickup</span>
                            <span className="text-xs text-gray-500">Pick up & pay at store</span>
                            <span className="text-xs font-semibold text-green-600 block mt-1">Free</span>
                          </div>
                        </label>
                        <label className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedDeliveryMethod === "delivery" 
                            ? "border-[#FDB913] bg-[#FDB913]/10" 
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}>
                          <input 
                            type="radio" 
                            name="delivery" 
                            value="delivery"
                            checked={selectedDeliveryMethod === "delivery"}
                            onChange={() => handleDeliveryMethodChange("delivery")}
                            className="w-4 h-4 text-[#FDB913] focus:ring-[#FDB913]" 
                          />
                          <div>
                            <span className="font-semibold text-gray-900 text-sm block">Home Delivery</span>
                            <span className="text-xs text-gray-500">Pay now, deliver to you</span>
                            <span className="text-xs font-semibold text-[#0A7EA4] block mt-1">15,000 TZS</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Payment Section */}
                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-5">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Payment
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-blue-50 rounded text-xs font-bold text-blue-700">VISA</div>
                          <div className="px-2 py-1 bg-red-50 rounded text-xs font-bold text-red-700">MC</div>
                          <div className="px-2 py-1 bg-indigo-50 rounded text-xs font-bold text-indigo-700">AMEX</div>
                        </div>
                      </div>
                      
                      {/* Stripe Form */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-100">
                        <StripePaymentForm deliveryForm={deliveryForm} />
                      </div>

                      {/* Security Badge */}
                      <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
                        <Lock className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-xs text-gray-500">256-bit SSL Encrypted • Powered by Stripe</span>
                      </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer">
                      <input type="checkbox" id="terms" className="w-5 h-5 text-[#FDB913] mt-0.5 rounded focus:ring-[#FDB913]" required />
                      <span className="text-sm text-gray-700 leading-relaxed">
                        I agree to the <a href="https://neuraltale.com/terms/" target="_blank" rel="noopener noreferrer" className="text-[#0A7EA4] hover:text-[#001E3C] font-semibold underline">Terms & Conditions</a> and <a href="/privacy" className="text-[#0A7EA4] hover:text-[#001E3C] font-semibold underline">Privacy Policy</a>
                      </span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-6 lg:p-8 text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                    <Package className="w-8 h-8 text-amber-600" />
                  </div>
                  <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    Please fill in the delivery form to continue with your order.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* ORDER SUMMARY */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 sticky top-4">
              <div className="p-6 lg:p-8 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-semibold text-gray-900">
                      {formatTzs(cart.reduce((acc, item) => acc + item.price * item.quantity, 0))}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-gray-600">Delivery</p>
                    <p className={`font-semibold ${shippingFee === 0 ? "text-green-600" : "text-gray-900"}`}>
                      {shippingFee === 0 ? "Free" : formatTzs(shippingFee)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-gray-600">Surcharge Fee</p>
                    <p className="font-semibold text-gray-900">{formatTzs(0)}</p>
                  </div>
                  <div className="h-px bg-gray-200 my-4" />
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-base font-bold text-gray-900">Total</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatTzs(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) + shippingFee)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 pt-2">Includes TZS TRA Tax</p>
                </div>
                {activeStep === 1 && !isEmpty && (
                  <button
                    onClick={() => router.push("/cart?step=2", { scroll: false })}
                    className="w-full bg-gradient-to-r from-[#001E3C] to-[#0A7EA4] hover:from-[#0A7EA4] hover:to-[#001E3C] active:from-[#001E3C] active:to-[#0A7EA4] text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-[#001E3C]/20 hover:shadow-2xl hover:shadow-[#001E3C]/30 hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    Continue to Delivery
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
                {activeStep === 2 && (
                  <div className="bg-[#FDB913]/10 border border-[#FDB913]/30 rounded-xl p-4 text-center">
                    <p className="text-sm text-[#001E3C] font-medium">Complete delivery form to continue</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CartPageContent />
    </Suspense>
  );
};

export default CartPage;
