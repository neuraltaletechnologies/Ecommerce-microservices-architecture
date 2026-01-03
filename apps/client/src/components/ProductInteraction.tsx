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
    // Navigate to cart with shipping step
    router.push("/cart?step=2");
  };
  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* SIZE */}
      <div className="flex flex-col gap-2 text-xs">
        <span className="text-gray-500">Size</span>
        <div className="flex items-center gap-2">
          {product.sizes?.length > 0 ? (
            product.sizes.map((size: string) => (
              <div
                className={`cursor-pointer border-1 p-[2px] ${
                  selectedSize === size ? "border-gray-600" : "border-gray-300"
                }`}
                key={size}
                onClick={() => handleTypeChange("size", size)}
              >
                <div
                  className={`w-6 h-6 text-center flex items-center justify-center ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {size.toUpperCase()}
                </div>
              </div>
            ))
          ) : (
            <span className="text-gray-400">No sizes available</span>
          )}
        </div>
      </div>
      {/* COLOR */}
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-gray-500">Color</span>
        <div className="flex items-center gap-2">
          {product.colors?.length > 0 ? (
            product.colors.map((color: string) => (
              <div
                className={`cursor-pointer border-1 p-[2px] ${
                  selectedColor === color ? "border-gray-300" : "border-white"
                }`}
                key={color}
                onClick={() => handleTypeChange("color", color)}
              >
                <div className={`w-6 h-6`} style={{ backgroundColor: color }} />
              </div>
            ))
          ) : (
            <span className="text-gray-400">No colors available</span>
          )}
        </div>
      </div>
      {/* QUANTITY */}
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-gray-500">Quantity</span>
        <div className="flex items-center gap-2">
          <button
            className="cursor-pointer border-1 border-gray-300 p-1"
            onClick={() => handleQuantityChange("decrement")}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span>{quantity}</span>
          <button
            className="cursor-pointer border-1 border-gray-300 p-1"
            onClick={() => handleQuantityChange("increment")}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* BUTTONS */}
      <button
        onClick={handleAddToCart}
        className="bg-[#FDB913] text-[#001E3C] px-4 py-2 rounded-md shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold hover:bg-[#e5a811] transition-all"
      >
        <Plus className="w-4 h-4" />
        Add to Cart
      </button>
      <button 
        onClick={handleBuyNow}
        className="ring-1 ring-[#001E3C] shadow-lg text-[#001E3C] px-4 py-2 rounded-md flex items-center justify-center cursor-pointer gap-2 text-sm font-semibold hover:ring-[#0A7EA4] hover:bg-[#001E3C]/5 transition-all"
      >
        <ShoppingCart className="w-4 h-4" />
        Buy this Item
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
