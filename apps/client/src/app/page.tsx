import ProductList from "@/components/ProductList";
import HeroSectionWrapper from "@/components/HeroSectionWrapper";
import TrustIndicators from "@/components/TrustIndicators";
import ShopByCategory from "@/components/ShopByCategory";
import FlashDealsSection from "@/components/homepage/FlashDealsSection";
import WhyChooseSection from "@/components/homepage/WhyChooseSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import NewsletterSection from "@/components/homepage/NewsletterSection";
import LiveStatsCounter from "@/components/homepage/LiveStatsCounter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neurashop by Neuraltale - #1 Tech Store Tanzania | Buy Laptops, Phones & Electronics",
  description: "Welcome to Neurashop by Neuraltale - Tanzania's leading online tech store! Buy laptops, smartphones, tablets, gaming PCs, wireless earbuds, smartwatches & electronics at best prices. Free delivery in Dar es Salaam. Shop now for premium tech!",
  keywords: "neurashop, neuraltale, buy laptop Tanzania, buy phone Tanzania, tech store Tanzania, electronics Tanzania, IT devices Tanzania, computer shop Dar es Salaam, gaming laptop Tanzania, smartphone Tanzania",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Neurashop by Neuraltale - Tanzania's #1 Online Tech Store",
    description: "Buy laptops, smartphones, gaming gear & electronics at best prices in Tanzania. Powered by Neuraltale. Free delivery in Dar es Salaam!",
    url: "https://neurashop.neuraltale.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neurashop by Neuraltale - Buy Tech in Tanzania",
    description: "Tanzania's #1 tech store. Laptops, phones, gaming gear & electronics. Best prices guaranteed!",
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
      
      {/* User Testimonials - White background */}
      <TestimonialsSection />
      
      {/* Newsletter & Community - Teal to Navy gradient */}
      <NewsletterSection />
    </div>
  );
};

export default Homepage;
