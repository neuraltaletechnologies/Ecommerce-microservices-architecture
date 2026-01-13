"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@repo/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "react-toastify";

const ProductInteractionContent = ({
  product,
  selectedSize,
  selectedColor,
}: {
  product: ProductType;
  selectedSize: string;
  selectedColor: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCartStore();

  const handleTypeChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else {
      if (quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      selectedColor,
      selectedSize,
    });
    toast.success("Product added to cart");
  };

  const handleBuyNow = () => {
    addToCart({
      ...product,
      quantity,
      selectedColor,
      selectedSize,
    });
    toast.success("Proceeding to checkout...");
    // Navigate to cart with delivery step
    router.push("/cart?step=2");
  };
  return (
    <div className="flex flex-col gap-4">
      {/* QUANTITY */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Quantity</label>
        <div className="flex items-center gap-3">
          <button
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-[#FDB913] hover:bg-[#FDB913]/10 transition-all"
            onClick={() => handleQuantityChange("decrement")}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-lg font-semibold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
          <button
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-[#FDB913] hover:bg-[#FDB913]/10 transition-all"
            onClick={() => handleQuantityChange("increment")}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* BUTTONS */}
      <button
        onClick={handleAddToCart}
        className="bg-[#FDB913] text-[#001E3C] px-6 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold hover:bg-[#e5a811] hover:shadow-xl transition-all"
      >
        <Plus className="w-5 h-5" />
        Add to Cart
      </button>
      <button 
        onClick={handleBuyNow}
        className="border-2 border-[#001E3C] shadow-lg text-[#001E3C] px-6 py-3 rounded-lg flex items-center justify-center cursor-pointer gap-2 text-sm font-semibold hover:bg-[#001E3C] hover:text-white transition-all"
      >
        <ShoppingCart className="w-5 h-5" />
        Buy Now
      </button>
    </div>
  );
};

const ProductInteraction = ({
  product,
  selectedSize,
  selectedColor,
}: {
  product: ProductType;
  selectedSize: string;
  selectedColor: string;
}) => {
  return (
    <Suspense fallback={<div className="w-full h-48" />}>
      <ProductInteractionContent product={product} selectedSize={selectedSize} selectedColor={selectedColor} />
    </Suspense>
  );
};

export default ProductInteraction;
