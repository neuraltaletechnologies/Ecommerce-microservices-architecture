import ProductList from "@/components/ProductList";
import HeroSection from "@/components/HeroSection";
import TrustIndicators from "@/components/TrustIndicators";

const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) => {
  const category = (await searchParams).category;
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full width */}
      <HeroSection />
      
      {/* Trust Indicators - With container */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustIndicators />
        </div>
      </section>
      
      {/* Featured Products - With container */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated selection of the latest and greatest tech products
            </p>
          </div>
          <ProductList category={category} params="homepage"/>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
