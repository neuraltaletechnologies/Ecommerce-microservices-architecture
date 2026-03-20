import { MetadataRoute } from 'next';
import { ProductType } from '@repo/types';

function getProductServiceUrl(): string {
  return (process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || '').trim();
}

function normalizeBaseUrl(): string {
  const fallback = 'https://neurashop.neuraltale.com';
  const raw = (process.env.NEXT_PUBLIC_BASE_URL || fallback).trim();

  try {
    return new URL(raw).toString().replace(/\/$/, '');
  } catch {
    return fallback;
  }
}

function safeDate(input: unknown): Date {
  const parsed = new Date(String(input || ''));
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

async function fetchAllProducts(): Promise<ProductType[]> {
  try {
    const serviceUrl = getProductServiceUrl();
    if (!serviceUrl) return [];

    const res = await fetch(
      `${serviceUrl}/products`,
      { 
        next: { revalidate: 3600 }, // Revalidate every hour
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );
    
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

async function fetchAllCategories(): Promise<{ slug: string; name: string }[]> {
  try {
    const serviceUrl = getProductServiceUrl();
    if (!serviceUrl) return [];

    const res = await fetch(
      `${serviceUrl}/categories`,
      { 
        next: { revalidate: 3600 }, // Revalidate every hour
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );
    
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = normalizeBaseUrl();
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
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((category) => Boolean(category?.slug))
    .map((category) => ({
    url: `${baseUrl}/products?category=${encodeURIComponent(String(category.slug))}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Product pages - medium-high priority
  const productPages: MetadataRoute.Sitemap = products
    .filter((product) => product && product.id !== undefined && product.id !== null)
    .map((product) => ({
    url: `${baseUrl}/products/${encodeURIComponent(String(product.id))}`,
    lastModified: safeDate((product as ProductType & { updatedAt?: string | Date }).updatedAt),
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
