"use client";

import { ProductType } from "@repo/types";
import { X, Star, ShoppingCart, Heart, Share2, Eye, Zap, Shield, Truck } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useCartStore from "@/stores/cartStore";

interface QuickViewModalProps {
  product: ProductType | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCartStore();

  // Initialize selected options when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || "");
      setSelectedColor(product.colors[0] || "");
      setSelectedImageIndex(0);
      setQuantity(1);
      setIsWishlisted(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    });
    toast.success(`${quantity} item(s) added to cart`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.origin + `/products/${product.id}`,
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.origin + `/products/${product.id}`);
      toast.success("Product link copied to clipboard!");
    }
  };

  // Generate a realistic rating for demo purposes
  const rating = 4.3 + (product.id % 10) * 0.06;
  const reviewCount = 150 + (product.id * 23);

  // Get product images
  const productImages = Object.values(product.images as Record<string, string>);
  const currentImage = productImages[selectedImageIndex] || productImages[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Quick View</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close quick view"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={currentImage}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === selectedImageIndex ? "border-blue-500" : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.shortDescription}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {rating.toFixed(1)} ({reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    TZs {(product.price * 2300).toLocaleString()}
                  </span>
                  {product.id % 4 === 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg text-gray-500 line-through">
                        TZs {(product.price * 1.15 * 2300).toLocaleString()}
                      </span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium">
                        Save 15%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {/* Size/Storage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {product.categorySlug === "smartphones" || product.categorySlug === "tablets" ? "Storage" : "Size"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                          selectedSize === size
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color: {selectedColor}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? "border-blue-500 scale-110"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{ 
                          backgroundColor: color.toLowerCase().includes('titanium') ? '#8B7355' :
                                         color.toLowerCase().includes('space') ? '#1a1a1a' :
                                         color.toLowerCase().includes('silver') ? '#C0C0C0' :
                                         color.toLowerCase().includes('gold') ? '#FFD700' :
                                         color.toLowerCase().includes('black') ? '#000000' :
                                         color.toLowerCase().includes('white') ? '#FFFFFF' :
                                         color.toLowerCase().includes('blue') ? '#007AFF' :
                                         color.toLowerCase().includes('purple') ? '#AF52DE' :
                                         color.toLowerCase().includes('pink') ? '#FF2D92' :
                                         color.toLowerCase().includes('yellow') ? '#FFCC00' :
                                         color.toLowerCase().includes('orange') ? '#FF9500' :
                                         color.toLowerCase().includes('red') ? '#FF3B30' :
                                         color.toLowerCase().includes('green') ? '#34C759' :
                                         color.toLowerCase().includes('gray') || color.toLowerCase().includes('grey') ? '#8E8E93' :
                                         '#6B7280'
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
                <div className="text-center">
                  <Truck className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <span className="text-xs text-gray-600">Free Shipping</span>
                </div>
                <div className="text-center">
                  <Shield className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <span className="text-xs text-gray-600">2 Year Warranty</span>
                </div>
                <div className="text-center">
                  <Zap className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                  <span className="text-xs text-gray-600">Fast Delivery</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart - TZs {(product.price * quantity * 2300).toLocaleString()}
                </button>
                
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={handleWishlist}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-colors ${
                      isWishlisted
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                    <span className="text-sm">Wishlist</span>
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      window.open(`/products/${product.id}`, '_blank');
                    }}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-300 text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;