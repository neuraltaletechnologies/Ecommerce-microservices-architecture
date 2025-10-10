import ProductInteraction from "@/components/ProductInteraction";
import { formatTzs } from "@/utils/currency";
import { ProductType } from "@repo/types";
import Image from "next/image";
import { 
  Star, 
  Shield, 
  Truck, 
  RotateCcw, 
  Clock, 
  CheckCircle, 
  Heart,
  Share2,
  Tag,
  Package,
  Zap,
  Globe
} from "lucide-react";


const fetchProduct = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${id}`
  );
  const data: ProductType = await res.json();
  return data;
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
    const { id } = await params;

  const product = await fetchProduct(id);
  return {
    title: product.name,
    describe: product.description,
  };
};

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color: string; size: string }>;
}) => {
  const { size, color } = await searchParams;
  const { id } = await params;

  const product = await fetchProduct(id);

  const selectedSize = size || (product.sizes?.[0] as string) || "";
  const selectedColor = color || (product.colors?.[0] as string) || "";
  
  // Extract specifications from product data
  const specifications = [
    { label: "Product Name", value: product.name },
    { label: "Short Description", value: product.shortDescription },
    { label: "Category", value: product.categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) },
    { label: "Available Sizes", value: product.sizes?.join(", ") || "Standard" },
    { label: "Available Colors", value: product.colors?.join(", ") || "Default" },
    { label: "Product ID", value: `#${product.id}` },
    { label: "Last Updated", value: new Date(product.updatedAt).toLocaleDateString() },
  ];

  // Extract key features from shortDescription for gaming laptops
  const getKeyFeatures = (shortDesc: string, category: string) => {
    const features = [];
    
    // Parse processor info
    if (shortDesc.includes('AMD Ryzen')) {
      const ryzenMatch = shortDesc.match(/AMD Ryzen \w+ \w+/);
      if (ryzenMatch) features.push({ label: "Processor", value: ryzenMatch[0] });
    } else if (shortDesc.includes('Intel Core')) {
      const intelMatch = shortDesc.match(/Intel Core [^,]+/);
      if (intelMatch) features.push({ label: "Processor", value: intelMatch[0] });
    }
    
    // Parse graphics info
    if (shortDesc.includes('RTX')) {
      const rtxMatch = shortDesc.match(/RTX \w+/);
      if (rtxMatch) features.push({ label: "Graphics", value: `NVIDIA GeForce ${rtxMatch[0]}` });
    }
    
    // Parse display info
    if (shortDesc.includes('Hz')) {
      const displayMatch = shortDesc.match(/\d+Hz[^,]*/);
      if (displayMatch) features.push({ label: "Display", value: displayMatch[0] });
    }
    
    // Add category-specific features
    if (category === 'gaming-laptops') {
      features.push({ label: "Type", value: "Gaming Laptop" });
      features.push({ label: "Target Use", value: "Gaming & Content Creation" });
    }
    
    return features;
  };

  const keyFeatures = getKeyFeatures(product.shortDescription, product.categorySlug);

  // Service features
  const serviceFeatures = [
    { icon: Shield, text: "2 Year Warranty" },
    { icon: Truck, text: "Free Shipping" },
    { icon: RotateCcw, text: "30-Day Returns" },
    { icon: Zap, text: "Fast Processing" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <div className="flex items-center space-x-2">
          <span>Home</span>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span className="capitalize">{product.categorySlug}</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* IMAGE SECTION */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
            <Image
              src={
                (product.images as Record<string, string>)?.[selectedColor] || "/products/1g.png"
              }
              alt={product.name}
              fill
              className="object-contain p-8"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 space-y-2">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                In Stock
              </span>
              {product.price < 50000 && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Sale
                </span>
              )}
            </div>
            {/* Action buttons */}
            <div className="absolute top-4 right-4 space-y-2">
              <button 
                className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                aria-label="Add to wishlist"
                title="Add to wishlist"
              >
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                aria-label="Share product"
                title="Share product"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Thumbnail Images */}
          <div className="flex space-x-2 overflow-x-auto">
            {product.colors?.map((color) => (
              <div
                key={color}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-colors ${
                  selectedColor === color ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <Image
                  src={(product.images as Record<string, string>)?.[color] || "/products/1g.png"}
                  alt={`${product.name} in ${color}`}
                  width={80}
                  height={80}
                  className="object-contain w-full h-full p-2 bg-gray-50"
                />
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-blue-600 font-medium capitalize">
                {product.categorySlug.replace(/-/g, ' ')}
              </span>
              <Tag className="w-4 h-4 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            
            {/* Short Description as subtitle */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 text-lg font-medium">{product.shortDescription}</p>
            </div>
            
            {/* Product Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>Product ID: #{product.id}</span>
              <span>•</span>
              <span>Added: {new Date(product.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">(4.2 out of 5 • 127 reviews)</span>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatTzs(product.price / 100, true)}
              </span>
              {product.price < 50000 && (
                <span className="text-lg text-gray-500 line-through">
                  {formatTzs((product.price * 1.2) / 100, true)}
                </span>
              )}
            </div>
            <p className="text-sm text-green-600 font-medium">✓ Price includes VAT</p>
          </div>

          {/* Specifications */}
          <div className="border-t border-b border-gray-200 py-6">
            <h3 className="font-medium text-gray-900 mb-4">Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Available Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Available Sizes</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sizeOption) => (
                      <span
                        key={sizeOption}
                        className={`px-3 py-1 rounded-full text-sm border ${
                          selectedSize === sizeOption
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 text-gray-600"
                        }`}
                      >
                        {sizeOption}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Available Colors</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((colorOption) => (
                      <span
                        key={colorOption}
                        className={`px-3 py-1 rounded-full text-sm border ${
                          selectedColor === colorOption
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 text-gray-600"
                        }`}
                      >
                        {colorOption}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <ProductInteraction
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
          />

          {/* Key Product Features */}
          {keyFeatures.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Key Features</h3>
              <div className="grid grid-cols-1 gap-3">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="flex justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-900">{feature.label}</span>
                    <span className="text-sm text-blue-700">{feature.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Features */}
          <div className="grid grid-cols-2 gap-4">
            {serviceFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <feature.icon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Payment Methods</h3>
            <div className="flex items-center gap-3">
              <Image
                src="/klarna.png"
                alt="Klarna"
                width={60}
                height={30}
                className="rounded border border-gray-200"
              />
              <Image
                src="/cards.png"
                alt="Credit Cards"
                width={60}
                height={30}
                className="rounded border border-gray-200"
              />
              <Image
                src="/stripe.png"
                alt="Stripe"
                width={60}
                height={30}
                className="rounded border border-gray-200"
              />
            </div>
          </div>

          {/* Trust Signals */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Secure Purchase</span>
            </div>
            <p className="text-sm text-blue-700">
              Your payment information is processed securely. We do not store credit card details.
            </p>
          </div>
        </div>
      </div>

      {/* DETAILED DESCRIPTION & SPECS */}
      <div className="mt-16 space-y-12">
        {/* Description */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            {/* Short Description Highlight */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Key Highlights
              </h3>
              <p className="text-lg text-gray-800 font-medium">
                {product.shortDescription}
              </p>
            </div>

            {/* Full Description */}
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                {product.description}
              </p>
            </div>
            
            {/* Enhanced Product Details Grid */}
            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  What&apos;s Included
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {product.name}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Power Adapter & Cable
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    User Manual & Documentation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Warranty Card
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Original Packaging
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Product Information
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Product ID:</span>
                    <span className="font-medium">#{product.id}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium capitalize">{product.categorySlug.replace(/-/g, ' ')}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Available Sizes:</span>
                    <span className="font-medium">{product.sizes?.length || 0}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Color Options:</span>
                    <span className="font-medium">{product.colors?.length || 0}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Added:</span>
                    <span className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <dl className="divide-y divide-gray-200">
              {specifications.map((spec, index) => (
                <div key={index} className="flex py-4 px-8">
                  <dt className="w-1/3 font-medium text-gray-900">{spec.label}</dt>
                  <dd className="w-2/3 text-gray-700">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Shipping & Returns */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping & Returns</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Free standard shipping on orders over TZS 50,000. Express shipping available.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <RotateCcw className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Easy Returns</h3>
              </div>
              <p className="text-gray-600 text-sm">
                30-day return policy. Items must be in original condition and packaging.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Fast Processing</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Orders are processed within 24 hours. Track your order every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* Legal Notice */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <p className="text-gray-600 text-sm leading-relaxed">
            By clicking &quot;Add to Cart&quot; or &quot;Buy Now&quot;, you agree to our{" "}
            <span className="text-blue-600 underline hover:text-blue-800 cursor-pointer">Terms & Conditions</span>{" "}
            and <span className="text-blue-600 underline hover:text-blue-800 cursor-pointer">Privacy Policy</span>
            . You authorize us to charge your selected payment method for the
            total amount shown. All sales are subject to our return and{" "}
            <span className="text-blue-600 underline hover:text-blue-800 cursor-pointer">Refund Policies</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
