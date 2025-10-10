"use client";

import ShippingForm from "@/components/ShippingForm";
import useCartStore from "@/stores/cartStore";
import { ShippingFormInputs } from "@repo/types";
import { ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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

const CartPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();

  const activeStep = parseInt(searchParams.get("step") || "1");

  const { cart, removeFromCart } = useCartStore();
  return (
    <div className="flex flex-col gap-8 items-center justify-center mt-12">
      {/* TITLE */}
      <h1 className="text-2xl font-medium">Your Shopping Cart</h1>
      {/* STEPS */}
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {steps.map((step) => (
          <div
            className={`flex items-center gap-2 border-b-2 pb-4 ${
              step.id === activeStep ? "border-gray-800" : "border-gray-200"
            }`}
            key={step.id}
          >
            <div
              className={`w-6 h-6 rounded-full text-white p-4 flex items-center justify-center ${
                step.id === activeStep ? "bg-gray-800" : "bg-gray-400"
              }`}
            >
              {step.id}
            </div>
            <p
              className={`text-sm font-medium ${
                step.id === activeStep ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>
      {/* STEPS & DETAILS */}
      <div className="w-full flex flex-col lg:flex-row gap-16">
        {/* STEPS */}
        <div className="w-full lg:w-7/12 shadow-lg border-1 border-gray-100 p-8 rounded-lg flex flex-col gap-8">
          {activeStep === 1 ? (
            cart.map((item) => (
              // SINGLE CART ITEM
              <div
                className="flex items-center justify-between"
                key={item.id + item.selectedSize + item.selectedColor}
              >
                {/* IMAGE AND DETAILS */}
                <div className="flex gap-8">
                  {/* IMAGE */}
                  <div className="relative w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={
                        (item.images as Record<string, string>)?.[
                          item.selectedColor
                        ] || ""
                      }
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {/* ITEM DETAILS */}
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-xs text-gray-500">
                        Size: {item.selectedSize}
                      </p>
                      <p className="text-xs text-gray-500">
                        Color: {item.selectedColor}
                      </p>
                    </div>
                    <p className="font-medium">TZs {(item.price * item.quantity * 2300).toLocaleString()}</p>
                  </div>
                </div>
                {/* DELETE BUTTON */}
                <button
                  onClick={() => removeFromCart(item)}
                  className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-all duration-300 text-red-400 flex items-center justify-center cursor-pointer"
                  aria-label={`Remove ${item.name} from cart`}
                  title={`Remove ${item.name} from cart`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : activeStep === 2 ? (
            <ShippingForm setShippingForm={setShippingForm} />
          ) : activeStep === 3 && shippingForm ? (
            // Confirm Order Section
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Your Order</h3>
              
              {/* Delivery Options */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800">Choose Delivery Method</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="delivery" value="pickup" className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">In-Store Pickup and Pay</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="delivery" value="delivery" className="w-4 h-4 text-blue-600" defaultChecked />
                    <span className="font-medium">Pay and Deliver</span>
                  </label>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800">Pay by Card or Mobile Money</h4>
                
                {/* Payment Icons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded">
                    <span className="text-sm font-medium text-blue-900">Visa</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded">
                    <span className="text-sm font-medium text-red-900">MasterCard</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded">
                    <span className="text-sm font-medium text-blue-900">Amex</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-2 rounded">
                    <span className="text-sm font-medium text-yellow-900">M-Pesa TZ</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded">
                    <span className="text-sm font-medium text-blue-900">TigoPesa TZ</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded">
                    <span className="text-sm font-medium text-green-900">Pesapal E-wallet</span>
                  </div>
                </div>

                {/* Pesapal Logo */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="bg-green-600 text-white px-4 py-2 rounded font-bold inline-block mb-3">
                      pesapal
                    </div>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <p className="text-sm text-gray-700">
                    <strong>Swahili:</strong> Lipia kwa Tigopesa au Card za bank zote zinakubalika. 
                    Payment via Pesapal Gateway for credit/debit card or mobile money via Tigopesa.
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>English:</strong> Pay with Tigopesa or all bank cards are accepted. 
                    Payment via Pesapal Gateway for credit/debit card or mobile money via Tigopesa.
                  </p>
                </div>

                {/* Contact Instructions */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-amber-800">
                    <strong>Swahili:</strong> Asante kwa oda yako, Ukimaliza malipo tafadhali tupigie kuconfirm payment yako.
                  </p>
                  <p className="text-sm text-amber-800">
                    <strong>English:</strong> Thanks for your order! Please call <strong>0653520829</strong> or WhatsApp us to confirm your order once you are done with the payment.
                  </p>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <input type="checkbox" id="terms" className="w-4 h-4 text-blue-600 mt-1" required />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I have read and agree to the website <a href="/terms" className="text-blue-600 hover:text-blue-700">terms and conditions</a> *
                  </label>
                </div>

                {/* Place Order Button */}
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 text-lg"
                  onClick={() => {
                    // Handle order placement
                    alert("Order placed! Please proceed with payment via Pesapal.");
                  }}
                >
                  Place Order
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Please fill in the shipping form to continue.
            </p>
          )}
        </div>
        {/* DETAILS */}
        <div className="w-full lg:w-5/12 shadow-lg border-1 border-gray-100 p-8 rounded-lg flex flex-col gap-8 h-max">
          <h2 className="font-semibold">Order Summary</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Subtotal</p>
              <p className="font-medium">
                TZs {(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 2300).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Flat rate:</p>
              <p className="font-medium">TZs 0</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Surcharge Fee</p>
              <p className="font-medium">TZs 0</p>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <p className="text-gray-800 font-semibold">Total (includes TZs TRA Tax)</p>
              <p className="font-medium">
                TZs {(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 2300).toLocaleString()}
              </p>
            </div>
          </div>
          {activeStep === 1 && (
            <button
              onClick={() => router.push("/cart?step=2", { scroll: false })}
              className="w-full bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
