"use client";

import ShippingForm from "@/components/ShippingForm";
import useCartStore from "@/stores/cartStore";
import { formatTzs } from "@/utils/currency";
import { ShippingFormInputs, CartItemType } from "@repo/types";
import { ArrowRight, Trash2, ShoppingBag, Package, CreditCard, Minus, Plus, Edit2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const steps = [
  {
    id: 1,
    title: "Shopping Cart",
  },
  {
    id: 2,
    title: "Shipping Address",
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
  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const activeStep = parseInt(searchParams.get("step") || "1");

  const { cart, removeFromCart, updateCartItem } = useCartStore();
  
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
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-4">
              <div
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                  step.id === activeStep 
                    ? "bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg shadow-gray-900/20" 
                    : step.id < activeStep
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-100 border border-gray-200"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    step.id === activeStep 
                      ? "bg-white text-gray-900" 
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
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden lg:block w-12 h-0.5 ${step.id < activeStep ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
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
                        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:scale-105"
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
                              src={
                                (item.images as Record<string, string>)?.[
                                  item.selectedColor
                                ] || ""
                              }
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
                                  <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
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
                                      className="inline-flex items-center gap-1.5 text-xs lg:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-4">
                      <Package className="w-5 h-5" />
                      <span className="font-medium text-sm">Shipping Information</span>
                    </div>
                  </div>
                  <ShippingForm setShippingForm={setShippingForm} />
                </div>
              ) : activeStep === 3 && shippingForm ? (
                // Confirm Order Section
                <div className="p-6 lg:p-8 space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Confirm Your Order</h3>
                      <p className="text-sm text-gray-600">Review and complete your purchase</p>
                    </div>
                  </div>
                  
                  {/* Delivery Options */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-gray-700" />
                      Choose Delivery Method
                    </h4>
                    <div className="grid gap-3">
                      <label className="relative flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all duration-300 group">
                        <input type="radio" name="delivery" value="pickup" className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900 block">In-Store Pickup and Pay</span>
                          <span className="text-sm text-gray-600">Pick up from our store location</span>
                        </div>
                        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </label>
                      <label className="relative flex items-center gap-4 p-4 border-2 border-blue-500 bg-blue-50 rounded-xl cursor-pointer transition-all duration-300 shadow-sm">
                        <input type="radio" name="delivery" value="delivery" className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500" defaultChecked />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900 block">Pay and Deliver</span>
                          <span className="text-sm text-gray-600">Home delivery service</span>
                        </div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      </label>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-5">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-gray-700" />
                      Pay by Card or Mobile Money
                    </h4>
                    
                    {/* Payment Icons */}
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-2.5 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-sm font-semibold text-blue-900">Visa</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-br from-red-50 to-red-100 px-4 py-2.5 rounded-lg border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-sm font-semibold text-red-900">MasterCard</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-br from-indigo-50 to-indigo-100 px-4 py-2.5 rounded-lg border border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-sm font-semibold text-indigo-900">Amex</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-br from-yellow-50 to-yellow-100 px-4 py-2.5 rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-sm font-semibold text-yellow-900">M-Pesa TZ</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-2.5 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-sm font-semibold text-blue-900">TigoPesa TZ</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-br from-green-50 to-green-100 px-4 py-2.5 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-sm font-semibold text-green-900">Pesapal E-wallet</span>
                      </div>
                    </div>

                    {/* Pesapal Logo */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-bold inline-block shadow-lg shadow-green-600/20 text-lg tracking-wide">
                          pesapal
                        </div>
                        <p className="text-xs text-gray-600 mt-3">Secure Payment Gateway</p>
                      </div>
                    </div>

                    {/* Payment Instructions */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 space-y-3 shadow-sm">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        <strong className="text-blue-900">Swahili:</strong> Lipia kwa Tigopesa au Card za bank zote zinakubalika. 
                        Payment via Pesapal Gateway for credit/debit card or mobile money via Tigopesa.
                      </p>
                      <div className="h-px bg-blue-200" />
                      <p className="text-sm text-gray-800 leading-relaxed">
                        <strong className="text-blue-900">English:</strong> Pay with Tigopesa or all bank cards are accepted. 
                        Payment via Pesapal Gateway for credit/debit card or mobile money via Tigopesa.
                      </p>
                    </div>

                    {/* Contact Instructions */}
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 p-5 rounded-xl space-y-3 shadow-sm">
                      <p className="text-sm text-amber-900 leading-relaxed">
                        <strong>Swahili:</strong> Asante kwa oda yako, Ukimaliza malipo tafadhali tupigie kuconfirm payment yako.
                      </p>
                      <div className="h-px bg-amber-200" />
                      <p className="text-sm text-amber-900 leading-relaxed">
                        <strong>English:</strong> Thanks for your order! Please call <strong className="text-amber-950">0653520829</strong> or WhatsApp us to confirm your order once you are done with the payment.
                      </p>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <input type="checkbox" id="terms" className="w-5 h-5 text-blue-600 mt-0.5 rounded focus:ring-2 focus:ring-blue-500" required />
                      <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed flex-1">
                        I have read and agree to the website <a href="/terms" className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-2">terms and conditions</a> *
                      </label>
                    </div>

                    {/* Place Order Button */}
                    <button
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 active:from-green-800 active:to-green-900 text-white font-bold py-5 px-6 rounded-xl transition-all duration-300 text-lg shadow-xl shadow-green-600/30 hover:shadow-2xl hover:shadow-green-600/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
                      onClick={() => {
                        // Handle order placement
                        alert("Order placed! Please proceed with payment via Pesapal.");
                      }}
                    >
                      <CreditCard className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      Place Order & Pay
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 lg:p-8 text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                    <Package className="w-8 h-8 text-amber-600" />
                  </div>
                  <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    Please fill in the shipping form to continue with your order.
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
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-semibold text-green-600">Free</p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-gray-600">Surcharge Fee</p>
                    <p className="font-semibold text-gray-900">{formatTzs(0)}</p>
                  </div>
                  <div className="h-px bg-gray-200 my-4" />
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-base font-bold text-gray-900">Total</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatTzs(cart.reduce((acc, item) => acc + item.price * item.quantity, 0))}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 pt-2">Includes TZS TRA Tax</p>
                </div>
                {activeStep === 1 && !isEmpty && (
                  <button
                    onClick={() => router.push("/cart?step=2", { scroll: false })}
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 active:from-gray-950 active:to-gray-900 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-gray-900/30 hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    Continue to Shipping
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
                {activeStep === 2 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-blue-800 font-medium">Complete shipping form to continue</p>
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
