import ProductList from "@/components/ProductList";
import HeroSection from "@/components/HeroSection";
import TrustIndicators from "@/components/TrustIndicators";
import ShopByCategory from "@/components/ShopByCategory";

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
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover cutting-edge technology from leading brands. From smartphones to gaming gear, 
          find the perfect tech products for your lifestyle.
        </p>
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
