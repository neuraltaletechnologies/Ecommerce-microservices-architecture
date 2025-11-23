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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eshop.neuraltale.com';
  const products = await fetchAllProducts();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Category pages
  const categories = [
    'laptops',
    'smartphones',
    'audio',
    'wearables',
    'gaming',
    'accessories',
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/products?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Product pages
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
