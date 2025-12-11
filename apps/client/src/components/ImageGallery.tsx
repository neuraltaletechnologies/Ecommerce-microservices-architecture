"use client";

import { ProductType } from "@repo/types";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  product: ProductType;
  selectedColor: string;
}

export default function ImageGallery({ product, selectedColor }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);

  // Handle both old structure {main, gallery} and new structure {color: url}
  const getProductImages = () => {
    const images = product.images as any;
    
    // Check if it's the old structure with 'main' and 'gallery'
    if (images && typeof images === 'object' && 'main' in images) {
      const mainImage = images.main || "/products/1g.png";
      const galleryImages = Array.isArray(images.gallery) ? images.gallery : [];
      
      return [
        { url: mainImage, label: "Main View", isMain: true },
        ...galleryImages.map((url: string, index: number) => ({
          url: url || "/products/1g.png",
          label: `View ${index + 2}`,
          isMain: false
        }))
      ];
    }
    
    // New structure: color-keyed images (can be string or array)
    if (images && typeof images === 'object') {
      // Get images for the selected color
      let selectedColorImages: string[] = [];
      const colorData = images[selectedColor];
      
      if (typeof colorData === 'string') {
        selectedColorImages = [colorData];
      } else if (Array.isArray(colorData)) {
        selectedColorImages = colorData.filter((url: string) => url && url.trim() !== '');
      }
      
      // If no images for selected color, try first available color
      if (selectedColorImages.length === 0) {
        const firstColor = Object.keys(images)[0];
        if (firstColor) {
          const firstColorData = images[firstColor];
          if (typeof firstColorData === 'string') {
            selectedColorImages = [firstColorData];
          } else if (Array.isArray(firstColorData)) {
            selectedColorImages = firstColorData.filter((url: string) => url && url.trim() !== '');
          }
        }
      }
      
      // Build image array from selected color images
      if (selectedColorImages.length > 0) {
        return selectedColorImages.map((url: string, index: number) => ({
          url: url,
          label: index === 0 ? "Main View" : `View ${index + 1}`,
          isMain: index === 0
        }));
      }
    }
    
    // Fallback: no images available
    return [{ url: "/products/1g.png", label: "Product", isMain: true }];
  };

  const allImages = getProductImages();

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    setSelectedThumbnail((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    setSelectedThumbnail((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    setSelectedThumbnail(index);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Vertical Thumbnail Selector */}
      <div className="order-2 lg:order-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] pb-2 lg:pb-0">
        {allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all ${
              selectedThumbnail === index
                ? "border-blue-600 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
            aria-label={`View ${image.label} image`}
          >
            <Image
              src={image.url}
              alt={`${product.name} - ${image.label}`}
              width={96}
              height={96}
              className="w-full h-full object-contain bg-gray-50 p-2"
            />
          </button>
        ))}
      </div>

      {/* Main Image Display */}
      <div className="order-1 lg:order-2 flex-1">
        <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
          <Image
            src={allImages[currentImageIndex]?.url || '/products/1g.png'}
            alt={`${product.name} - ${allImages[currentImageIndex]?.label || 'Product view'}`}
            fill
            className="object-contain p-8"
            priority
          />

          {/* Navigation Arrows */}
          <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3">
            <button
              onClick={handlePrevious}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900" />
            </button>
            <button
              onClick={handleNext}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-900" />
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        </div>
      </div>
    </div>
  );
}
