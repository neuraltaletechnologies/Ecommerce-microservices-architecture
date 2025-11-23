import ProductList from "@/components/ProductList";
import CategoryFilter from "@/components/CategoryFilter";
import CategoryFilterSheet from "@/components/CategoryFilterSheet";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}): Promise<Metadata> {
  const { category, search } = await searchParams;
  
  const categoryTitles: Record<string, string> = {
    laptops: "Gaming & Business Laptops",
    smartphones: "Smartphones & Mobile Devices",
    audio: "Wireless Earbuds & Headphones",
    wearables: "Smartwatches & Fitness Trackers",
    gaming: "Gaming Laptops & Accessories",
    accessories: "Tech Accessories & Gadgets",
  };

  const categoryDescriptions: Record<string, string> = {
    laptops: "Shop high-performance gaming laptops and business notebooks in Tanzania. Latest Intel & AMD processors, RTX graphics, fast SSDs. Fast delivery across Dar es Salaam.",
    smartphones: "Buy latest smartphones from top brands in Tanzania. 5G enabled, powerful cameras, fast processors. Best prices guaranteed.",
    audio: "Premium wireless earbuds, noise-canceling headphones, and audio equipment in Tanzania. Superior sound quality, long battery life.",
    wearables: "Smartwatches, fitness trackers, and wearable technology in Tanzania. Track health, receive notifications, stay connected.",
    gaming: "Gaming laptops in Tanzania with RTX graphics, high refresh rate displays, RGB keyboards. Built for esports and streaming.",
    accessories: "Computer accessories, phone cases, chargers, cables and tech gadgets in Tanzania. Quality products at great prices.",
  };

  if (search) {
    return {
      title: `Search Results: "${search}" - Neuraltale Tech Store`,
      description: `Find ${search} and related products at Neuraltale. Browse our collection of premium tech products.`,
      alternates: { canonical: `/products?search=${search}` },
    };
  }

  if (category && categoryTitles[category]) {
    return {
      title: `${categoryTitles[category]} - Buy Online | Neuraltale`,
      description: categoryDescriptions[category] || "Shop premium tech products at Neuraltale.",
      keywords: `${category}, buy ${category}, ${category} online, best ${category}, premium ${category}`,
      alternates: { canonical: `/products?category=${category}` },
      openGraph: {
        title: `${categoryTitles[category]} - Neuraltale`,
        description: categoryDescriptions[category],
        url: `https://eshop.neuraltale.com/products?category=${category}`,
      },
    };
  }

  return {
    title: "All Products - Shop Premium Tech & Electronics in Tanzania | Neuraltale",
    description: "Browse our complete collection of laptops, smartphones, audio devices, gaming gear, wearables & accessories in Tanzania. Premium tech products with fast delivery across Tanzania.",
    keywords: "all products, tech products, electronics store, buy gadgets online, tech shop",
    alternates: { canonical: '/products' },
    openGraph: {
      title: "All Products - Neuraltale Tech Store",
      description: "Browse our complete collection of premium tech products. Fast worldwide shipping.",
      url: "https://eshop.neuraltale.com/products",
    },
  };
}

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string; sort: string; search: string }>;
}) => {
  const category = (await searchParams).category;
  const sort = (await searchParams).sort;
  const search = (await searchParams).search;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <CategoryFilterSheet />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Desktop Sidebar Filter */}
          <aside className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-4">
              <CategoryFilter />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <ProductList
              category={category}
              sort={sort}
              search={search}
              params="products"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
