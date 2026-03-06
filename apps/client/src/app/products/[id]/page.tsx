import ProductInteraction from "@/components/ProductInteraction";
import WishlistCompareButtons from "@/components/WishlistCompareButtons";
import { formatTzs } from "@/utils/currency";
import { ProductType } from "@repo/types";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  Star, 
  Shield, 
  Truck, 
  RotateCcw, 
  CheckCircle,
  Package,
  Zap,
  Info,
  Wifi,
  Battery,
  Cpu,
  Award,
  Globe,
  MessageSquare,
} from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import ExpandableSection from "@/components/ExpandableSection";
import SimilarProducts from "@/components/SimilarProducts";
import UserReviews from "@/components/UserReviews";
import { auth } from "@clerk/nextjs/server";


const fetchProduct = async (id: string) => {
  try {
    const productServiceUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;
    
    if (!productServiceUrl) {
      console.error("Product service URL is not configured");
      return null;
    }

    const { getToken } = await auth();
    const token = await getToken();
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(
      `${productServiceUrl}/products/${id}`,
      {
        headers,
        cache: "no-store",
      }
    );
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to fetch product ${id}: ${res.status} ${res.statusText}`, errorText);
      return null;
    }
    
    const data: ProductType = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  try {
    const { id } = await params;
    const product = await fetchProduct(id);
    
    if (!product || !product.name) {
      return {
        title: 'Product Not Found | Neurashop',
        description: 'The requested product could not be found.',
      };
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://neurashop.neuraltale.com';
    const productUrl = `${baseUrl}/products/${id}`;
    
    // Extract image URL - handle both old {main, gallery} and new {color: url} structures
    const getImageUrl = (): string => {
      const images = product.images as any;
      
      if (!images) return '/logo.png';
      
      // Old structure: {main, gallery}
      if (images.main) return String(images.main);
      
      // New structure: {color: url or color: [urls]}
      if (typeof images === 'object' && !Array.isArray(images)) {
        const firstImage = Object.values(images)[0];
        if (firstImage) {
          // Handle array of URLs
          if (Array.isArray(firstImage)) {
            const validUrl = firstImage.find((url: any) => url && typeof url === 'string' && url.trim() !== '');
            if (validUrl) return String(validUrl);
          }
          // Handle string URL
          if (typeof firstImage === 'string' && firstImage.trim() !== '') {
            return String(firstImage);
          }
        }
      }
      
      // Array structure (legacy)
      if (Array.isArray(images) && images.length > 0) {
        const validUrl = images.find((url: any) => url && typeof url === 'string' && url.trim() !== '');
        if (validUrl) return String(validUrl);
      }
      
      return '/logo.png';
    };
    
    const imageUrl = getImageUrl();
    
    // Generate rich product description for SEO
    const seoDescription = `Buy ${product.name} online in Tanzania at Neurashop by Neuraltale. ${product.shortDescription || ''}. ${product.sizes?.length ? `Available in sizes: ${product.sizes.join(', ')}. ` : ''}${product.colors?.length ? `Colors: ${product.colors.join(', ')}. ` : ''}Fast delivery across Tanzania. Best price guaranteed. Shop now!`;

    return {
      title: `${product.name} - Buy Online | Neurashop`,
      description: seoDescription.slice(0, 160),
      keywords: `${product.name}, buy ${product.name}, ${product.categorySlug ? product.categorySlug.replace(/-/g, ' ') : 'electronics'}, ${product.name} price, ${product.name} online, premium ${product.categorySlug || 'tech'}`,
      alternates: {
        canonical: `/products/${id}`,
      },
      openGraph: {
        title: `${product.name} - Neurashop`,
        description: product.shortDescription || product.name,
        url: productUrl,
        siteName: 'Neurashop by Neuraltale',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - Neurashop`,
        description: product.shortDescription || product.name,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | Neurashop',
      description: 'Shop premium tech products at Neurashop by Neuraltale Tanzania.',
    };
  }
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
  
  // Handle product not found
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/products" className="inline-block bg-[#FDB913] text-[#001E3C] px-6 py-3 rounded-lg hover:bg-[#e5a811] transition-colors font-semibold">
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const selectedSize = size || (product.sizes?.[0] as string) || "";
  const selectedColor = color || (product.colors?.[0] as string) || "";
  
  // Tech highlights badges - use from DB or fallback to defaults
  const techHighlights = (product.techHighlights as Array<{label: string, icon: string}>) || [
    { label: "Wireless", icon: "Wifi" },
    { label: "40hr Battery", icon: "Battery" },
    { label: "Active ANC", icon: "Zap" },
    { label: "Bluetooth 5.3", icon: "Wifi" },
  ];

  // What's in the box - use from DB or fallback to defaults
  const boxContents = (product.boxContents as string[]) || [
    `${product.name}`,
    "USB-C Charging Cable",
    "Quick Start Guide",
    "Warranty Card",
    "Carrying Case",
    "Extra Ear Tips (S, M, L)"
  ];

  // Product features - use from DB or fallback to defaults
  const productFeatures = (product.productFeatures as Array<{title: string, description: string}>) || [
    {
      title: "Active Noise Cancellation",
      description: "Advanced ANC technology blocks up to 35dB of ambient noise for immersive listening experience"
    },
    {
      title: "Smart Touch Controls",
      description: "Intuitive touch sensors for play/pause, volume, and voice assistant activation"
    },
    {
      title: "Fast Charging",
      description: "Quick charge technology provides 5 hours of playback with just 10 minutes of charging"
    },
    {
      title: "Multi-Device Pairing",
      description: "Seamlessly connect to two devices simultaneously and switch between them"
    }
  ];

  // Technical specifications detailed - use from DB or fallback to defaults
  const technicalSpecs = (product.technicalSpecs as Record<string, Array<{label: string, value: string}>>) || {
    "Connectivity": [
      { label: "Bluetooth Version", value: "5.3" },
      { label: "Wireless Range", value: "Up to 10m (33ft)" },
      { label: "Codecs Supported", value: "SBC, AAC, aptX, aptX HD" },
      { label: "Multi-point Connection", value: "Yes (2 devices)" },
    ],
    "Battery & Charging": [
      { label: "Battery Capacity", value: "500mAh (each earbud)" },
      { label: "Playback Time", value: "Up to 40 hours (with case)" },
      { label: "Talk Time", value: "Up to 30 hours" },
      { label: "Standby Time", value: "200 hours" },
      { label: "Charging Time", value: "2 hours (full charge)" },
      { label: "Quick Charge", value: "10 min = 5 hours" },
      { label: "Charging Port", value: "USB Type-C" },
      { label: "Wireless Charging", value: "Qi-compatible" },
    ],
    "Audio Specifications": [
      { label: "Driver Size", value: "11mm dynamic drivers" },
      { label: "Frequency Response", value: "20Hz - 20kHz" },
      { label: "Impedance", value: "32Ω" },
      { label: "Sensitivity", value: "98dB ±3dB" },
      { label: "ANC Depth", value: "Up to -35dB" },
      { label: "Microphone", value: "Dual beamforming mics" },
    ],
    "Physical Specifications": [
      { label: "Earbud Dimensions", value: "25.4 x 21.6 x 24.8mm" },
      { label: "Case Dimensions", value: "61.3 x 50.1 x 25.5mm" },
      { label: "Earbud Weight", value: "5.4g (each)" },
      { label: "Case Weight", value: "45.2g" },
      { label: "Water Resistance", value: "IPX4" },
      { label: "Materials", value: "ABS, Silicone ear tips" },
    ],
    "Compatibility": [
      { label: "Operating Systems", value: "iOS 14+, Android 8.0+" },
      { label: "Companion App", value: "Available for iOS & Android" },
      { label: "Voice Assistants", value: "Siri, Google Assistant, Alexa" },
      { label: "System Requirements", value: "Bluetooth-enabled device" },
    ],
  };

  // Certifications - use from DB or fallback to defaults
  const certifications = (product.certifications as Array<{label: string, icon: string}>) || [
    { label: "CE Certified", icon: "Award" },
    { label: "FCC Approved", icon: "Award" },
    { label: "RoHS Compliant", icon: "Award" },
    { label: "Qi Certified", icon: "Award" },
  ];

  // Icon mapping for string-based icon names from database
  const iconMap: Record<string, any> = {
    Wifi, Battery, Zap, Award, Cpu, Package, Shield, Truck, Globe, Info, CheckCircle
  };

  // Extract image URL for structured data
  const getStructuredDataImage = (): string => {
    const images = product.images as any;
    
    if (!images) return '/logo.png';
    
    // Old structure: {main, gallery}
    if (images.main) return String(images.main);
    
    // New structure: {color: url or color: [urls]}
    if (typeof images === 'object' && !Array.isArray(images)) {
      const firstImage = Object.values(images)[0];
      if (firstImage) {
        // Handle array of URLs
        if (Array.isArray(firstImage)) {
          const validUrl = firstImage.find((url: any) => url && typeof url === 'string' && url.trim() !== '');
          if (validUrl) return String(validUrl);
        }
        // Handle string URL
        if (typeof firstImage === 'string' && firstImage.trim() !== '') {
          return String(firstImage);
        }
      }
    }
    
    // Array structure (legacy)
    if (Array.isArray(images) && images.length > 0) {
      const validUrl = images.find((url: any) => url && typeof url === 'string' && url.trim() !== '');
      if (validUrl) return String(validUrl);
    }
    
    return '/logo.png';
  };

  // Build product images array for schema
  const productImages: string[] = [];
  const images = product.images as Record<string, string | string[]> | undefined;
  if (images) {
    if (typeof images === 'object' && !Array.isArray(images)) {
      // Handle both string and array values
      Object.values(images).forEach(img => {
        if (typeof img === 'string' && img.trim() !== '') {
          productImages.push(img);
        } else if (Array.isArray(img)) {
          productImages.push(...img.filter((url: string) => typeof url === 'string' && url.trim() !== ''));
        }
      });
    } else if (Array.isArray(images)) {
      productImages.push(...images.filter(img => typeof img === 'string' && img.trim() !== ''));
    }
  }
  if (productImages.length === 0) {
    productImages.push(getStructuredDataImage());
  }
  // Remove duplicates
  const uniqueImages = [...new Set(productImages)];

  // Calculate stock availability string
  const getAvailabilityString = (status: string | undefined, quantity: number | undefined): string => {
    const statusValue = status || 'in_stock';
    const qty = quantity || 0;
    
    switch (statusValue) {
      case 'out_of_stock':
        return 'https://schema.org/OutOfStock';
      case 'pre_order':
        return 'https://schema.org/PreOrder';
      case 'limited_stock':
        return qty > 0 ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/OutOfStock';
      default:
        return qty > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
    }
  };

  // Build multiple offers for different colors
  const colorOffers = product.colors && product.colors.length > 0
    ? product.colors.map((color) => ({
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'TZS',
        availability: getAvailabilityString((product.stockStatus as string), product.stockQuantity as number),
        inventoryLevel: {
          '@type': 'QuantitativeValue',
          value: product.stockQuantity || 0,
        },
        color: color,
        url: `https://neurashop.neuraltale.com/products/${product.id}?color=${color}`,
        seller: {
          '@type': 'Organization',
          name: 'Neuraltale',
        },
      }))
    : [
        {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'TZS',
          availability: getAvailabilityString((product.stockStatus as string), product.stockQuantity as number),
          inventoryLevel: {
            '@type': 'QuantitativeValue',
            value: product.stockQuantity || 0,
          },
          url: `https://neurashop.neuraltale.com/products/${product.id}`,
          seller: {
            '@type': 'Organization',
            name: 'Neuraltale',
          },
        },
      ];

  // Build product schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://neurashop.neuraltale.com/products/${product.id}`,
    name: product.name,
    description: product.description,
    image: uniqueImages,
    brand: {
      '@type': 'Brand',
      name: 'Neuraltale',
    },
    offers: colorOffers.length > 1 ? colorOffers : colorOffers[0],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    category: product.categorySlug ? product.categorySlug.replace(/-/g, ' ') : 'Electronics',
    sku: String(product.id),
    itemCondition: 'https://schema.org/NewCondition',
    ...(product.productFeatures && product.productFeatures.length > 0 && {
      features: product.productFeatures.map((feature) => ({
        '@type': 'PropertyValue',
        name: feature.title,
        value: feature.description,
      })),
    }),
    ...(product.colors && product.colors.length > 0 && {
      color: product.colors,
    }),
    ...(product.sizes && product.sizes.length > 0 && {
      size: product.sizes,
    }),
    url: `https://neurashop.neuraltale.com/products/${product.id}`,
    weight: {
      '@type': 'QuantitativeValue',
      unitCode: 'KGM',
      value: '0.5',
    },
    seller: {
      '@type': 'Organization',
      '@id': 'https://neurashop.neuraltale.com',
      name: 'Neuraltale',
    },
  };

  return (
    <div className="bg-white">
      {/* Structured Data for Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://neurashop.neuraltale.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Products',
                item: 'https://neurashop.neuraltale.com/products',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: product.categorySlug ? product.categorySlug.replace(/-/g, ' ') : 'Products',
                item: product.categorySlug ? `https://neurashop.neuraltale.com/products?category=${product.categorySlug}` : 'https://neurashop.neuraltale.com/products',
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: product.name,
                item: `https://neurashop.neuraltale.com/products/${product.id}`,
              },
            ],
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#0A7EA4] transition-colors">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/products" className="hover:text-[#0A7EA4] transition-colors">
            Products
          </Link>
          <span className="text-gray-400">/</span>
          {product.categorySlug ? (
            <>
              <Link 
                href={`/products?category=${product.categorySlug}`}
                className="hover:text-[#0A7EA4] transition-colors capitalize"
              >
                {product.categorySlug.replace(/-/g, ' ')}
              </Link>
              <span className="text-gray-400">/</span>
            </>
          ) : null}
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 lg:gap-12">
          {/* LEFT COLUMN - Image Gallery (60%) */}
          <div className="space-y-8">
            <ImageGallery 
              product={product}
              selectedColor={selectedColor}
            />

            {/* Expandable Sections */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <ExpandableSection 
                title="Product Details" 
                defaultOpen={true}
                icon={<Info className="w-5 h-5" />}
              >
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Highlights</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Premium build quality with attention to detail</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Latest technology for superior performance</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Ergonomic design for extended use</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Compatible with all major platforms</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </ExpandableSection>

              <ExpandableSection 
                title="Technical Specifications"
                icon={<Cpu className="w-5 h-5" />}
              >
                <div className="space-y-6">
                  {Object.entries(technicalSpecs).map(([category, specs]) => (
                    <div key={category} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#0A7EA4] rounded"></span>
                        {category}
                      </h4>
                      <dl className="grid grid-cols-1 gap-2">
                        {specs.map((spec, index) => (
                          <div key={index} className="flex justify-between py-2 hover:bg-gray-50 px-2 rounded">
                            <dt className="text-sm text-gray-600 font-mono">{spec.label}:</dt>
                            <dd className="text-sm text-gray-900 font-medium">{spec.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              </ExpandableSection>

              <ExpandableSection 
                title="What's in the Box"
                icon={<Package className="w-5 h-5" />}
              >
                <ul className="space-y-2">
                  {boxContents.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 italic">
                    All items are new and sealed in original packaging
                  </p>
                </div>
              </ExpandableSection>

              <ExpandableSection 
                title="Features & Technology"
                icon={<Zap className="w-5 h-5" />}
              >
                <div className="space-y-4">
                  {productFeatures.map((feature, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-[#FDB913]/10 to-[#0A7EA4]/10 rounded-lg border border-[#FDB913]/20">
                      <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-sm text-gray-700">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </ExpandableSection>

              <ExpandableSection 
                title="Warranty & Support"
                icon={<Shield className="w-5 h-5" />}
              >
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">2-Year Manufacturer Warranty</h4>
                    </div>
                    <p className="text-sm text-green-800">
                      Full coverage for manufacturing defects and hardware failures
                    </p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Free repair or replacement for defective units</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>24/7 user support via email and chat</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Extended warranty options available at checkout</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Dedicated support team for technical assistance</span>
                    </li>
                  </ul>
                </div>
              </ExpandableSection>

              <ExpandableSection 
                title="Delivery & Returns"
                icon={<Truck className="w-5 h-5" />}
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Free Delivery</h4>
                    <p className="text-sm text-gray-700">
                      Free standard delivery on orders over TZS 50,000. Orders typically arrive within 3-5 business days.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Express Delivery</h4>
                    <p className="text-sm text-gray-700">
                      Need it faster? Choose express delivery for 1-2 day delivery (additional charges apply).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">30-Day Returns</h4>
                    <p className="text-sm text-gray-700">
                      Not satisfied? Return your purchase within 30 days for a full refund. Items must be unused and in original packaging.
                    </p>
                  </div>
                </div>
              </ExpandableSection>

              <ExpandableSection 
                title="Compatibility & Requirements"
                icon={<Globe className="w-5 h-5" />}
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Operating Systems</h4>
                    <div className="flex flex-wrap gap-2">
                      {["iOS 14+", "Android 8.0+", "Windows 10+", "macOS 11+"].map((os) => (
                        <span key={os} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                          {os}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Voice Assistants</h4>
                    <p className="text-sm text-gray-700">
                      Compatible with Siri, Google Assistant, and Amazon Alexa
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Companion App</h4>
                    <p className="text-sm text-gray-700">
                      Download the free app for iOS and Android to customize settings, update firmware, and access advanced features.
                    </p>
                  </div>
                </div>
              </ExpandableSection>
            </div>
          </div>
          

          {/* RIGHT COLUMN - Product Information (40%) */}
          <div className="space-y-6">
            {/* Product Title with Model Number */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 font-mono">Model: SKU-{product.id}</p>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? "text-[#FDB913] fill-[#FDB913]" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">4.8</span>
              <Link href="#reviews" className="text-sm text-[#0A7EA4] hover:text-[#001E3C] underline">
                (2,847 reviews)
              </Link>
            </div>

            {/* Price and Availability */}
            <div className="space-y-3 pb-6 border-b border-gray-200">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  {formatTzs(product.price)}
                </span>
                {product.price < 500000 && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatTzs(product.price * 1.2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">In Stock</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600 font-mono">SKU: #{product.id}</span>
              </div>
              <p className="text-xs text-gray-600">Price includes VAT • Free delivery on orders over TZS 50,000</p>
            </div>

            {/* Tech Highlights Badges */}
            <div className="space-y-3 pb-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {techHighlights.map((highlight, index) => {
                  const IconComponent = typeof highlight.icon === 'string' 
                    ? iconMap[highlight.icon] || Info 
                    : highlight.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#FDB913]/10 to-[#0A7EA4]/10 border border-[#FDB913]/30 rounded-lg"
                    >
                      <IconComponent className="w-4 h-4 text-[#0A7EA4]" />
                      <span className="text-sm font-medium text-[#001E3C]">{highlight.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div id="variants" className="space-y-3 pb-6 border-b border-gray-200">
                <label htmlFor="color-select" className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Color: <span className="font-normal text-gray-700 capitalize">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((colorOption: string) => (
                    <Link
                      key={colorOption}
                      href={`/products/${product.id}?color=${colorOption}${selectedSize ? `&size=${selectedSize}` : ''}`}
                      className={`px-4 py-2 border-2 rounded-lg font-medium text-sm transition-all ${
                        selectedColor === colorOption
                          ? "border-[#FDB913] bg-[#FDB913]/10 text-[#001E3C]"
                          : "border-gray-300 text-gray-700 hover:border-[#FDB913]/50"
                      }`}
                    >
                      {colorOption}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Size/Storage Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3 pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Storage: <span className="font-normal text-gray-700">{selectedSize}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((sizeOption: string) => (
                    <Link
                      key={sizeOption}
                      href={`/products/${product.id}?size=${sizeOption}${selectedColor ? `&color=${selectedColor}` : ''}`}
                      className={`px-4 py-3 border-2 rounded-lg font-medium text-sm text-center transition-all ${
                        selectedSize === sizeOption
                          ? "border-[#FDB913] bg-[#FDB913]/10 text-[#001E3C]"
                          : "border-gray-300 text-gray-700 hover:border-[#FDB913]/50"
                      }`}
                    >
                      {sizeOption}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Product Description */}
            <div className="space-y-4 pb-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">About This Product</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.shortDescription}
              </p>
              <p className="text-gray-700 leading-relaxed">
                Experience cutting-edge technology with the <strong className="text-gray-900">{product.name}</strong>. 
                Engineered for tech enthusiasts who demand <strong className="text-[#0A7EA4]">premium performance</strong> and 
                innovative features. Whether you&apos;re working, gaming, or creating content, this product delivers exceptional results.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Backed by our 2-year manufacturer warranty and featuring industry-leading specifications, 
                this is the perfect choice for those who refuse to compromise on quality.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <ProductInteraction
                product={product}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
              />
              <WishlistCompareButtons product={product} />
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Shield className="w-5 h-5 text-green-600" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Truck className="w-5 h-5 text-[#0A7EA4]" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <RotateCcw className="w-5 h-5 text-[#0A7EA4]" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Authentic Product</span>
              </div>
            </div>

           
          </div>
        </div>

        {/* Certifications & Ratings */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Certifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert, index) => {
              const IconComponent = typeof cert.icon === 'string' 
                ? iconMap[cert.icon] || Award 
                : cert.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-[#FDB913] hover:shadow-md transition-all"
                >
                  <IconComponent className="w-8 h-8 text-[#0A7EA4] mb-2" />
                  <span className="text-sm font-medium text-gray-900 text-center">{cert.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Reviews Section */}
        <div id="reviews" className="mt-16 border-t border-gray-200 pt-12">
          <UserReviews productId={product.id} />
        </div>

        {/* Q&A Section */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Questions & Answers</h2>
            <button className="px-6 py-2 bg-[#FDB913] text-[#001E3C] rounded-lg font-semibold hover:bg-[#e5a811] transition-all">
              Ask a Question
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Q&A Item */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#FDB913]/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#0A7EA4]" />
                </div>
                <div className="flex-1">
                  <div className="mb-3">
                    <span className="font-semibold text-gray-900">Q:</span>
                    <span className="ml-2 text-gray-700">Is this compatible with iPhone 15 Pro?</span>
                  </div>
                  <div className="pl-4 border-l-2 border-[#FDB913]">
                    <span className="font-semibold text-gray-900">A:</span>
                    <span className="ml-2 text-gray-700">
                      Yes, this product is fully compatible with iPhone 15 Pro and all iOS 14+ devices.
                    </span>
                    <p className="text-xs text-gray-500 mt-2">Answered by Neuraltale Support • 2 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#FDB913]/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#0A7EA4]" />
                </div>
                <div className="flex-1">
                  <div className="mb-3">
                    <span className="font-semibold text-gray-900">Q:</span>
                    <span className="ml-2 text-gray-700">What&apos;s the Bluetooth range?</span>
                  </div>
                  <div className="pl-4 border-l-2 border-[#FDB913]">
                    <span className="font-semibold text-gray-900">A:</span>
                    <span className="ml-2 text-gray-700">
                      Up to 10 meters (33 feet) with Bluetooth 5.3 connectivity in optimal conditions.
                    </span>
                    <p className="text-xs text-gray-500 mt-2">Answered by Community • 5 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button className="text-[#0A7EA4] hover:text-[#001E3C] font-medium">
              View all questions ({12})
            </button>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Share Your Experience
            </h2>
            <p className="text-gray-600 mb-6">
              Have you used this product? Help other tech enthusiasts make informed decisions by sharing your detailed review.
            </p>
            <button className="px-8 py-3 border-2 border-gray-900 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-all">
              Write a Technical Review
            </button>
          </div>
        </div>

        {/* Similar Products */}
        {product.categorySlug && (
          <div className="mt-16">
            <SimilarProducts 
              categorySlug={product.categorySlug}
              currentProductId={String(product.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
