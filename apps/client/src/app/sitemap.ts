import { MetadataRoute } from 'next';
import { ProductType } from '@repo/types';

async function fetchAllProducts(): Promise<ProductType[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`,
      { 
        next: { revalidate: 3600 }, // Revalidate every hour
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );
    
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

async function fetchAllCategories(): Promise<{ slug: string; name: string }[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`,
      { 
        next: { revalidate: 3600 }, // Revalidate every hour
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );
    
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://neurashop.neuraltale.com';
  const products = await fetchAllProducts();
  const categories = await fetchAllCategories();
  const currentDate = new Date();

  // Static pages - highest priority for main pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/landing`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Category pages - high priority for product discovery
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/products?category=${encodeURIComponent(category.slug)}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Product pages - medium-high priority
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${encodeURIComponent(product.id)}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Search intent pages for better SEO (buy X in Tanzania)
  const searchIntentPages: MetadataRoute.Sitemap = [
    'laptops',
    'smartphones', 
    'tablets',
    'gaming',
    'audio',
    'smartwatches',
    'accessories',
  ].map((term) => ({
    url: `${baseUrl}/products?search=${encodeURIComponent(term)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...searchIntentPages];
}
