import ProductList from "@/components/ProductList";
import HeroSection from "@/components/HeroSection";
import TrustIndicators from "@/components/TrustIndicators";
import ShopByCategory from "@/components/ShopByCategory";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Shop Premium Tech & Electronics Online in Tanzania",
  description: "Discover cutting-edge technology at Neurashop by Neuraltale Tanzania. Shop gaming laptops, smartphones, wireless earbuds, smartwatches & more. Fast delivery across Tanzania. Best prices guaranteed.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Neurashop by Neuraltale Tanzania - Premium Tech Store | Home",
    description: "Shop premium laptops, smartphones, gaming gear & electronics in Tanzania. Fast delivery across all regions.",
    url: "https://neurashop.neuraltale.com",
  },
};

const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) => {
  const category = (await searchParams).category;
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full width */}
      <HeroSection  />
      
    
      
      {/* Featured Products - With container */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Premium Tech Products
        </h2>
        
      </div>
          <ProductList category={category} params="homepage"/>
        </div>
      </section>

       {/* Trust Indicators - With container */}
      <section className="py-12 bg-white">
        <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustIndicators />
        </div>
      </section>
      <section>
        {/* Shop By Category Section */}
      <ShopByCategory />
      </section>
    </div>
  );
};

export default Homepage;
