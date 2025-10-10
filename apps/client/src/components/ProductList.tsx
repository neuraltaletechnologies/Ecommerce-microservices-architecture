import { ProductsType, ProductType } from "@repo/types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";

// NEURALTALE TECH PRODUCTS - Comprehensive catalog
const techProducts: ProductType[] = [
  // Premium Smartphones
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    shortDescription: "The ultimate iPhone with titanium design, Action Button, and powerful A17 Pro chip.",
    description: "Experience the pinnacle of iPhone innovation with the iPhone 15 Pro Max. Featuring a lightweight titanium design, the revolutionary Action Button for quick access to your favorite features, and the industry-leading A17 Pro chip with 6-core GPU. The advanced camera system captures stunning detail with 5x Telephoto zoom and next-generation portraits with Focus and Depth Control.",
    price: 1199.99,
    sizes: ["128GB", "256GB", "512GB", "1TB"],
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
    images: {
      "Natural Titanium": "/products/iphone-15-pro-natural.jpg",
      "Blue Titanium": "/products/iphone-15-pro-blue.jpg",
      "White Titanium": "/products/iphone-15-pro-white.jpg",
      "Black Titanium": "/products/iphone-15-pro-black.jpg",
    },
    categorySlug: "smartphones",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    shortDescription: "AI-powered smartphone with S Pen, 200MP camera, and brilliant 6.8\" Dynamic AMOLED display.",
    description: "Discover the power of Galaxy AI with the Samsung Galaxy S24 Ultra. This premium smartphone features a built-in S Pen for precision control, a pro-grade 200MP camera system with AI-enhanced photography, and a stunning 6.8-inch Dynamic AMOLED 2X display. The Snapdragon 8 Gen 3 processor delivers exceptional performance for gaming, productivity, and creative tasks.",
    price: 1299.99,
    sizes: ["256GB", "512GB", "1TB"],
    colors: ["Titanium Gray", "Titanium Black", "Titanium Violet", "Titanium Yellow"],
    images: {
      "Titanium Gray": "/products/galaxy-s24-ultra-gray.jpg",
      "Titanium Black": "/products/galaxy-s24-ultra-black.jpg",
      "Titanium Violet": "/products/galaxy-s24-ultra-violet.jpg",
      "Titanium Yellow": "/products/galaxy-s24-ultra-yellow.jpg",
    },
    categorySlug: "smartphones",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Premium Laptops
  {
    id: 3,
    name: "MacBook Pro 16-inch M4 Pro",
    shortDescription: "Professional laptop with M4 Pro chip, Liquid Retina XDR display, and up to 22-hour battery life.",
    description: "Unleash your creativity with the MacBook Pro 16-inch powered by the revolutionary M4 Pro chip. Features a stunning Liquid Retina XDR display with 1000 nits sustained brightness, advanced thermal design for sustained pro performance, and an impressive battery life of up to 22 hours. Perfect for video editing, 3D rendering, and software development.",
    price: 2499.99,
    sizes: ["512GB", "1TB", "2TB", "4TB"],
    colors: ["Space Black", "Silver"],
    images: {
      "Space Black": "/products/macbook-pro-16-space-black.jpg",
      "Silver": "/products/macbook-pro-16-silver.jpg",
    },
    categorySlug: "laptops",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: "Dell XPS 15 OLED",
    shortDescription: "Premium Windows laptop with 4K OLED InfinityEdge display and 13th Gen Intel processors.",
    description: "Experience premium performance with the Dell XPS 15 featuring a breathtaking 4K OLED InfinityEdge display with 100% DCI-P3 color accuracy. Powered by 13th Gen Intel Core processors and NVIDIA GeForce RTX graphics, this laptop delivers exceptional performance for creative professionals and power users. The precision-crafted aluminum chassis ensures durability and style.",
    price: 1899.99,
    sizes: ["512GB", "1TB", "2TB"],
    colors: ["Platinum Silver", "Graphite"],
    images: {
      "Platinum Silver": "/products/dell-xps-15-silver.jpg",
      "Graphite": "/products/dell-xps-15-graphite.jpg",
    },
    categorySlug: "laptops",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Audio Equipment
  {
    id: 5,
    name: "Sony WH-1000XM5",
    shortDescription: "Industry-leading noise canceling headphones with 30-hour battery and crystal-clear calls.",
    description: "Immerse yourself in premium sound with the Sony WH-1000XM5 wireless headphones. Featuring industry-leading noise cancellation, exceptional sound quality with LDAC codec support, and an impressive 30-hour battery life. The lightweight design with soft leather cushioning ensures all-day comfort, while Speak-to-Chat technology automatically pauses music when you start talking.",
    price: 399.99,
    sizes: ["Standard"],
    colors: ["Black", "Silver"],
    images: {
      "Black": "/products/sony-wh1000xm5-black.jpg",
      "Silver": "/products/sony-wh1000xm5-silver.jpg",
    },
    categorySlug: "audio",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    name: "AirPods Pro (3rd Generation)",
    shortDescription: "Premium wireless earbuds with Active Noise Cancellation and Spatial Audio support.",
    description: "Experience premium wireless audio with AirPods Pro featuring Active Noise Cancellation, Transparency mode, and Personalized Spatial Audio. The H2 chip delivers smarter noise cancellation and superior three-dimensional sound. With up to 6 hours of listening time and the MagSafe Charging Case providing multiple additional charges.",
    price: 249.99,
    sizes: ["Standard"],
    colors: ["White"],
    images: {
      "White": "/products/airpods-pro-3rd-gen.jpg",
    },
    categorySlug: "audio",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Gaming Equipment
  {
    id: 7,
    name: "Logitech MX Master 3S",
    shortDescription: "Advanced wireless mouse with 8K DPI sensor, quiet clicks, and 70-day battery life.",
    description: "Achieve precision and comfort with the Logitech MX Master 3S, featuring an 8000 DPI sensor for ultimate tracking accuracy. The 90% quieter clicks provide a premium experience without disturbing others. With 70-day battery life, USB-C fast charging, and seamless connectivity across multiple devices, it's perfect for professionals and creatives.",
    price: 99.99,
    sizes: ["Standard"],
    colors: ["Graphite", "Pale Gray"],
    images: {
      "Graphite": "/products/mx-master-3s-graphite.jpg",
      "Pale Gray": "/products/mx-master-3s-pale-gray.jpg",
    },
    categorySlug: "accessories",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 8,
    name: "Logitech K380 Multi-Device Keyboard",
    shortDescription: "Compact wireless keyboard with Easy-Switch technology for seamless multi-device typing.",
    description: "Type comfortably on the Logitech K380, a compact wireless keyboard designed for multi-device use. Easy-Switch technology lets you connect up to three devices and switch between them with the press of a button. The round concave keys provide a comfortable, familiar typing experience, while the 2-year battery life ensures long-lasting performance.",
    price: 39.99,
    sizes: ["Compact"],
    colors: ["Dark Grey", "Off-White", "Blue"],
    images: {
      "Dark Grey": "/products/k380-dark-grey.jpg",
      "Off-White": "/products/k380-off-white.jpg",
      "Blue": "/products/k380-blue.jpg",
    },
    categorySlug: "accessories",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Gaming Laptops
  {
    id: 19,
    name: "ASUS ROG Strix G15",
    shortDescription: "AMD Ryzen 7 5800H, RTX 3060, 144Hz FHD",
    description: "High-performance gaming laptop with AMD Ryzen 7 processor and NVIDIA GeForce RTX 3060 graphics. Features a 144Hz Full HD display for smooth gaming.",
    price: 1299,
    sizes: ["15.6in", "17.3in"],
    colors: ["Eclipse Gray", "Electro Punk"],
    images: {
      "Eclipse Gray": "/products/asus-rog-gray.jpg",
      "Electro Punk": "/products/asus-rog-pink.jpg",
    },
    categorySlug: "gaming-laptops",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 20,
    name: "MSI Katana 15",
    shortDescription: "Intel Core i7-12650H, RTX 4060, 144Hz",
    description: "Gaming laptop with Intel 12th Gen processor and RTX 4060 graphics. Perfect for gaming and content creation with high refresh rate display.",
    price: 1499,
    sizes: ["15.6in"],
    colors: ["Black", "Blue"],
    images: {
      "Black": "/products/msi-katana-black.jpg",
      "Blue": "/products/msi-katana-blue.jpg",
    },
    categorySlug: "gaming-laptops",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Tablets
  {
    id: 21,
    name: "iPad Pro 12.9\"",
    shortDescription: "M2 chip, 128GB, Wi-Fi + Cellular",
    description: "Ultimate iPad experience with M2 chip. Features Liquid Retina XDR display and support for Apple Pencil (2nd generation).",
    price: 1099,
    sizes: ["128GB", "256GB", "512GB", "1TB"],
    colors: ["Space Gray", "Silver"],
    images: {
      "Space Gray": "/products/ipad-pro-gray.jpg",
      "Silver": "/products/ipad-pro-silver.jpg",
    },
    categorySlug: "tablets",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 22,
    name: "Samsung Galaxy Tab S9",
    shortDescription: "Snapdragon 8 Gen 2, 128GB, 11 inch",
    description: "Premium Android tablet with Snapdragon processor. Includes S Pen and features a stunning AMOLED display.",
    price: 799,
    sizes: ["128GB", "256GB"],
    colors: ["Graphite", "Beige", "Mint"],
    images: {
      "Graphite": "/products/galaxy-tab-graphite.jpg",
      "Beige": "/products/galaxy-tab-beige.jpg",
      "Mint": "/products/galaxy-tab-mint.jpg",
    },
    categorySlug: "tablets",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Monitors
  {
    id: 23,
    name: "LG UltraGear 27GL850",
    shortDescription: "27\" QHD IPS, 144Hz, 1ms, G-Sync Compatible",
    description: "High-performance gaming monitor with Nano IPS technology. Features 144Hz refresh rate and 1ms response time for competitive gaming.",
    price: 449,
    sizes: ["27in"],
    colors: ["Black"],
    images: {
      "Black": "/products/lg-ultragear-black.jpg",
    },
    categorySlug: "monitors",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 24,
    name: "Samsung Odyssey G7",
    shortDescription: "32\" Curved QLED, 240Hz, 1ms, G-Sync",
    description: "Curved gaming monitor with QLED technology and 1000R curvature. Features 240Hz refresh rate for ultimate gaming performance.",
    price: 699,
    sizes: ["27in", "32in"],
    colors: ["Black"],
    images: {
      "Black": "/products/samsung-odyssey-black.jpg",
    },
    categorySlug: "monitors",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Wearables
  {
    id: 25,
    name: "Apple Watch Series 9",
    shortDescription: "GPS + Cellular, 45mm, Titanium",
    description: "Advanced smartwatch with S9 SiP and Double Tap gesture. Features Always-On Retina display and comprehensive health tracking.",
    price: 749,
    sizes: ["41mm", "45mm"],
    colors: ["Natural Titanium", "Blue Titanium", "Silver"],
    images: {
      "Natural Titanium": "/products/apple-watch-titanium.jpg",
      "Blue Titanium": "/products/apple-watch-blue.jpg",
      "Silver": "/products/apple-watch-silver.jpg",
    },
    categorySlug: "wearables",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 26,
    name: "Samsung Galaxy Watch6",
    shortDescription: "40mm, Bluetooth, Health Monitoring",
    description: "Advanced smartwatch with comprehensive health monitoring. Features sleep tracking, heart rate monitoring, and long battery life.",
    price: 329,
    sizes: ["40mm", "44mm"],
    colors: ["Graphite", "Gold", "Silver"],
    images: {
      "Graphite": "/products/galaxy-watch-graphite.jpg",
      "Gold": "/products/galaxy-watch-gold.jpg",
      "Silver": "/products/galaxy-watch-silver.jpg",
    },
    categorySlug: "wearables",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const fetchData = async ({
  category,
  sort,
  search,
  params,
}: {
  category?: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
}) => {
  // For development, return our curated tech products
  // In production, this would fetch from your product service
  let filteredProducts = [...techProducts];

  // Apply category filter
  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter(product => 
      product.categorySlug === category
    );
  }

  // Apply search filter
  if (search) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply sorting
  switch (sort) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "name":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
    default:
      filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Limit for homepage
  if (params === "homepage") {
    filteredProducts = filteredProducts.slice(0, 8);
  }

  return filteredProducts;

  // Uncomment below for production API call
  /*
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?${category ? `category=${category}` : ""}${search ? `&search=${search}` : ""}&sort=${sort || "newest"}${params === "homepage" ? "&limit=8" : ""}`
  );
  const data: ProductType[] = await res.json();
  return data;
  */
};

const ProductList = async ({
  category,
  sort,
  search,
  params,
}: {
  category: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
}) => {
  const products = await fetchData({ category, sort, search, params });
  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Premium Tech Products
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover cutting-edge technology from leading brands. From smartphones to gaming gear, 
          find the perfect tech products for your lifestyle.
        </p>
      </div>

      <Categories />
      {params === "products" && <Filter />}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 lg:gap-12">
        {Array.isArray(products) && products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {params === "homepage" && (
        <div className="flex justify-center mt-12">
          <Link
            href={category ? `/products/?category=${category}` : "/products"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
          >
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductList;