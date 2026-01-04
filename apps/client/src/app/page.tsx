import ProductList from "@/components/ProductList";
import HeroSectionWrapper from "@/components/HeroSectionWrapper";
import TrustIndicators from "@/components/TrustIndicators";
import ShopByCategory from "@/components/ShopByCategory";
import FlashDealsSection from "@/components/homepage/FlashDealsSection";
import WhyChooseSection from "@/components/homepage/WhyChooseSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import NewsletterSection from "@/components/homepage/NewsletterSection";
import LiveStatsCounter from "@/components/homepage/LiveStatsCounter";
import BackToTopButton from "@/components/homepage/BackToTopButton";
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
      {/* Hero Section - Full width with brand gradients */}
      <HeroSectionWrapper />
      
      
      
      {/* Flash Deals Section - Full width golden yellow */}
      <FlashDealsSection />
      
      {/* Featured Products - White background */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-[#FDB913]/20 text-[#001E3C] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              Featured Collection
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#001E3C]">
              Trending Products
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Discover our most popular tech products, handpicked for quality and performance
            </p>
          </div>
          <ProductList category={category} params="homepage"/>
        </div>
      </section>

        
      {/* Why Choose Neurashop - Cream background */}
      <WhyChooseSection />

      {/* Trust Indicators - Cream gradient background */}
      <section className="py-12 bg-white">
        <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustIndicators />
        </div>
      </section>
    
      
      {/* Shop By Category Section */}
      <section className="bg-white">
        <ShopByCategory />
      </section>
      
      {/* Customer Testimonials - White background */}
      <TestimonialsSection />
      
      {/* Newsletter & Community - Teal to Navy gradient */}
      <NewsletterSection />
      
      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
};

export default Homepage;
