import HeroSection from "./HeroSection";

interface HeroProduct {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  images: Record<string, string[]>;
  categorySlug: string;
  colors: string[];
  sizes: string[];
  stockStatus: string;
  stockQuantity?: number;
}

async function getHeroProducts(): Promise<HeroProduct[]> {
  try {
    const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:8000';
    
    const response = await fetch(`${PRODUCT_SERVICE_URL}/products/hero`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      console.error('Failed to fetch hero products:', response.status);
      return [];
    }

    const heroProducts = await response.json();
    return heroProducts;
  } catch (error) {
    console.error('Error fetching hero products:', error);
    return [];
  }
}

export default async function HeroSectionWrapper() {
  const heroProducts = await getHeroProducts();
  
  return <HeroSection initialProducts={heroProducts} />;
}
