/**
 * External Product API Integration
 * 
 * Fetches product details from TechSpecs API with fallback to multiple free APIs.
 * Includes caching, rate limiting, and error handling.
 * 
 * API Priority:
 * 1. TechSpecs API - Primary for tech products (requires TECHSPECS_API_KEY)
 * 2. DummyJSON - Good fallback with product dimensions
 * 3. Platzi Fake Store API - Additional electronics/tech products
 * 4. FakeStore API - Basic product info as last resort
 */

interface TechSpecsProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  images: string[];
  specifications: Record<string, Record<string, string>>;
  releaseDate?: string;
  description?: string;
}

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

interface PlatziProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: { id: number; name: string; image: string };
  images: string[];
}

export interface ExternalProductResult {
  source: 'techspecs' | 'fakestore' | 'dummyjson' | 'platzi';
  id: string;
  name: string;
  brand: string;
  description: string;
  shortDescription: string;
  category: string;
  images: string[];
  technicalSpecs: Record<string, Array<{ label: string; value: string }>>;
  suggestedPrice?: number;
}

// Simple in-memory cache with TTL
const cache = new Map<string, { data: ExternalProductResult[]; expiry: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per minute

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(key);
  
  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (limit.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  limit.count++;
  return true;
}

function getCached(query: string): ExternalProductResult[] | null {
  const cached = cache.get(query.toLowerCase());
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }
  cache.delete(query.toLowerCase());
  return null;
}

function setCache(query: string, data: ExternalProductResult[]): void {
  cache.set(query.toLowerCase(), { data, expiry: Date.now() + CACHE_TTL });
}

/**
 * Normalize external image payloads into valid https URLs.
 * Handles arrays, JSON-string arrays, relative paths, and protocol-relative URLs.
 */
function normalizeExternalImages(rawImages: unknown, fallbackImage?: unknown): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  const pushUrl = (input: unknown) => {
    if (typeof input !== 'string') return;

    let value = input.trim();
    if (!value) return;

    value = value.replace(/^['\"]+|['\"]+$/g, '');

    if (value.startsWith('//')) {
      value = `https:${value}`;
    }

    // Avoid mixed-content blocking in browser previews.
    if (value.startsWith('http://')) {
      value = `https://${value.slice('http://'.length)}`;
    }

    // Platzi can return relative file paths for images.
    if (value.startsWith('/')) {
      value = `https://api.escuelajs.co${value}`;
    }

    if (!/^https?:\/\//i.test(value)) return;

    try {
      const parsed = new URL(value);
      const normalized = parsed.toString();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        result.push(normalized);
      }
    } catch {
      // Ignore invalid URL entries.
    }
  };

  const processValue = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(pushUrl);
      return;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();

      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
        try {
          processValue(JSON.parse(trimmed));
          return;
        } catch {
          // Fall through and treat as single candidate.
        }
      }

      pushUrl(trimmed);
      return;
    }

    if (value && typeof value === 'object') {
      pushUrl((value as Record<string, unknown>).url);
    }
  };

  processValue(rawImages);
  processValue(fallbackImage);

  return result.slice(0, 5);
}

/**
 * Search TechSpecs API for product details
 */
async function searchTechSpecs(query: string): Promise<ExternalProductResult[]> {
  const apiToken = (
    process.env.TECHSPECS_BEARER_TOKEN ||
    process.env.TECHSPECS_API_TOKEN ||
    process.env.TECHSPECS_API_KEY ||
    ""
  ).trim();
  
  if (!apiToken) {
    console.warn('TechSpecs token not configured (set TECHSPECS_BEARER_TOKEN or TECHSPECS_API_KEY), skipping TechSpecs search');
    return [];
  }

  try {
    // TechSpecs API search endpoint
    const response = await fetch(
      `https://api.techspecs.io/v4/product/search?query=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      let apiErrorText = '';
      try {
        apiErrorText = await response.text();
      } catch {
        apiErrorText = '';
      }

      if (response.status === 401) {
        console.error('TechSpecs API auth failed (401). Check TECHSPECS_BEARER_TOKEN/TECHSPECS_API_KEY value.');
      }

      console.error(`TechSpecs API error: ${response.status} ${response.statusText}${apiErrorText ? ` | ${apiErrorText.slice(0, 200)}` : ''}`);
      return [];
    }

    const data = await response.json();
    
    if (!data.data?.items || !Array.isArray(data.data.items)) {
      return [];
    }

    return data.data.items.slice(0, 10).map((item: any): ExternalProductResult => {
      // Transform TechSpecs response to our format
      const specs: Record<string, Array<{ label: string; value: string }>> = {};
      
      if (item.specifications) {
        for (const [category, categorySpecs] of Object.entries(item.specifications)) {
          if (typeof categorySpecs === 'object' && categorySpecs !== null) {
            specs[category] = Object.entries(categorySpecs as Record<string, string>).map(
              ([label, value]) => ({ label, value: String(value) })
            );
          }
        }
      }

      return {
        source: 'techspecs',
        id: item.id || item.product_id || String(Date.now()),
        name: item.name || item.product_name || query,
        brand: item.brand || item.manufacturer || 'Unknown',
        description: item.description || `${item.brand || ''} ${item.name || ''}`.trim(),
        shortDescription: item.tagline || item.subtitle || '',
        category: item.category || 'electronics',
        images: item.images || (item.image ? [item.image] : []),
        technicalSpecs: specs,
        suggestedPrice: item.price?.value,
      };
    });
  } catch (error) {
    console.error('TechSpecs API error:', error);
    return [];
  }
}

/**
 * Fallback: Search DummyJSON API for products
 */
async function searchDummyJson(query: string): Promise<ExternalProductResult[]> {
  try {
    const response = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=10`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!data.products || !Array.isArray(data.products)) {
      return [];
    }

    return data.products.map((item: any): ExternalProductResult => {
      // Build specs from available data
      const specs: Record<string, Array<{ label: string; value: string }>> = {};
      
      if (item.dimensions) {
        specs['Physical Specifications'] = [
          { label: 'Width', value: `${item.dimensions.width} cm` },
          { label: 'Height', value: `${item.dimensions.height} cm` },
          { label: 'Depth', value: `${item.dimensions.depth} cm` },
        ];
      }
      
      if (item.weight) {
        specs['Physical Specifications'] = specs['Physical Specifications'] || [];
        specs['Physical Specifications'].push({ label: 'Weight', value: `${item.weight} g` });
      }

      specs['Product Information'] = [
        { label: 'SKU', value: item.sku || 'N/A' },
        { label: 'Warranty', value: item.warrantyInformation || 'Standard warranty' },
        { label: 'Shipping', value: item.shippingInformation || 'Standard shipping' },
        { label: 'Return Policy', value: item.returnPolicy || 'Standard returns' },
        { label: 'Availability', value: item.availabilityStatus || 'In stock' },
      ];

      if (item.tags && item.tags.length > 0) {
        specs['Tags'] = item.tags.map((tag: string) => ({ label: 'Tag', value: tag }));
      }

      return {
        source: 'dummyjson',
        id: String(item.id),
        name: item.title,
        brand: item.brand || 'Generic',
        description: item.description,
        shortDescription: item.title,
        category: item.category || 'electronics',
        images: item.images || (item.thumbnail ? [item.thumbnail] : []),
        technicalSpecs: specs,
        suggestedPrice: item.price ? Math.round(item.price * 2500) : undefined, // Convert USD to TZS roughly
      };
    });
  } catch (error) {
    console.error('DummyJSON API error:', error);
    return [];
  }
}

/**
 * Fallback: Search FakeStore API for products
 */
async function searchFakeStore(query: string): Promise<ExternalProductResult[]> {
  try {
    // FakeStore doesn't have search, so we get all and filter
    const response = await fetch('https://fakestoreapi.com/products');

    if (!response.ok) {
      return [];
    }

    const products: FakeStoreProduct[] = await response.json();
    
    // Filter by query
    const filtered = products
      .filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);

    return filtered.map((item): ExternalProductResult => ({
      source: 'fakestore',
      id: String(item.id),
      name: item.title,
      brand: 'Generic',
      description: item.description,
      shortDescription: item.title.slice(0, 100),
      category: item.category,
      images: [item.image],
      technicalSpecs: {
        'Product Information': [
          { label: 'Rating', value: `${item.rating.rate}/5 (${item.rating.count} reviews)` },
          { label: 'Category', value: item.category },
        ],
      },
      suggestedPrice: item.price ? Math.round(item.price * 2500) : undefined, // Convert USD to TZS roughly
    }));
  } catch (error) {
    console.error('FakeStore API error:', error);
    return [];
  }
}

/**
 * Fallback: Search Platzi Fake Store API for products
 * Good for electronics and tech products
 */
async function searchPlatzi(query: string): Promise<ExternalProductResult[]> {
  try {
    // Platzi API has search via title parameter
    const response = await fetch(
      `https://api.escuelajs.co/api/v1/products?title=${encodeURIComponent(query)}&limit=10`
    );

    if (!response.ok) {
      return [];
    }

    const responseData = await response.json();
    // Platzi returns { value: [...], Count: number } format
    const products = Array.isArray(responseData) ? responseData : (responseData.value || []);

    if (!Array.isArray(products)) {
      return [];
    }

    return products.map((item: any): ExternalProductResult => {
      const cleanImages = normalizeExternalImages(item.images, item.image);

      return {
        source: 'platzi',
        id: String(item.id),
        name: item.title,
        brand: extractBrandFromTitle(item.title),
        description: item.description || `${item.title} - High quality product`,
        shortDescription: item.title.slice(0, 100),
        category: item.category?.name || 'electronics',
        images: cleanImages.length > 0 ? cleanImages : ['https://placehold.co/400x400?text=No+Image'],
        technicalSpecs: {
          'Product Information': [
            { label: 'Category', value: item.category?.name || 'Unknown' },
            { label: 'Product ID', value: String(item.id) },
          ],
        },
        suggestedPrice: item.price ? Math.round(item.price * 2500) : undefined,
      };
    });
  } catch (error) {
    console.error('Platzi API error:', error);
    return [];
  }
}

/**
 * Extract brand name from product title
 */
function extractBrandFromTitle(title: string): string {
  const knownBrands = [
    'Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer',
    'Microsoft', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 'Oppo', 'Vivo',
    'JBL', 'Bose', 'Sennheiser', 'Audio-Technica', 'Beats', 'Anker',
    'Logitech', 'Razer', 'SteelSeries', 'Corsair', 'HyperX',
    'Nintendo', 'PlayStation', 'Xbox', 'Canon', 'Nikon', 'GoPro',
    'Fitbit', 'Garmin', 'Amazfit', 'Polar', 'Suunto',
    'Nike', 'Adidas', 'Puma', 'Under Armour', 'New Balance',
  ];
  
  for (const brand of knownBrands) {
    if (title.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  
  // Try to extract first word as brand
  const firstWord = title.split(' ')[0];
  if (firstWord && firstWord.length > 2 && firstWord[0] && firstWord[0] === firstWord[0].toUpperCase()) {
    return firstWord;
  }
  
  return 'Generic';
}

/**
 * Main search function with caching, rate limiting, and multi-source aggregation
 */
export async function searchExternalProducts(
  query: string,
  clientId: string = 'default'
): Promise<{ results: ExternalProductResult[]; fromCache: boolean; rateLimited: boolean }> {
  // Check rate limit
  if (!checkRateLimit(clientId)) {
    return { results: [], fromCache: false, rateLimited: true };
  }

  // Check cache
  const cached = getCached(query);
  if (cached) {
    return { results: cached, fromCache: true, rateLimited: false };
  }

  // Fetch all sources so admin can choose across APIs, not just first non-empty fallback.
  const [techspecsResults, dummyJsonResults, platziResults, fakeStoreResults] = await Promise.all([
    searchTechSpecs(query),
    searchDummyJson(query),
    searchPlatzi(query),
    searchFakeStore(query),
  ]);

  // Preserve source priority while including all available results.
  const mergedResults = [
    ...techspecsResults,
    ...dummyJsonResults,
    ...platziResults,
    ...fakeStoreResults,
  ];

  // Deduplicate exact duplicates per source + id.
  const seen = new Set<string>();
  const results = mergedResults.filter((item) => {
    const key = `${item.source}:${item.id}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  // Cache results
  if (results.length > 0) {
    setCache(query, results);
  }

  return { results, fromCache: false, rateLimited: false };
}

/**
 * Get detailed product by ID from external API
 */
export async function getExternalProductDetails(
  source: 'techspecs' | 'fakestore' | 'dummyjson' | 'platzi',
  productId: string
): Promise<ExternalProductResult | null> {
  try {
    if (source === 'techspecs') {
      const apiKey = process.env.TECHSPECS_API_KEY;
      if (!apiKey) return null;

      const response = await fetch(
        `https://api.techspecs.io/v4/product/detail?productId=${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      const item = data.data?.product;
      if (!item) return null;

      const specs: Record<string, Array<{ label: string; value: string }>> = {};
      if (item.specifications) {
        for (const [category, categorySpecs] of Object.entries(item.specifications)) {
          if (typeof categorySpecs === 'object' && categorySpecs !== null) {
            specs[category] = Object.entries(categorySpecs as Record<string, string>).map(
              ([label, value]) => ({ label, value: String(value) })
            );
          }
        }
      }

      return {
        source: 'techspecs',
        id: item.id,
        name: item.name,
        brand: item.brand || 'Unknown',
        description: item.description || '',
        shortDescription: item.tagline || '',
        category: item.category || 'electronics',
        images: item.images || [],
        technicalSpecs: specs,
        suggestedPrice: item.price?.value,
      };
    }

    if (source === 'dummyjson') {
      const response = await fetch(`https://dummyjson.com/products/${productId}`);
      if (!response.ok) return null;

      const item = await response.json();
      
      const specs: Record<string, Array<{ label: string; value: string }>> = {};
      if (item.dimensions) {
        specs['Physical Specifications'] = [
          { label: 'Width', value: `${item.dimensions.width} cm` },
          { label: 'Height', value: `${item.dimensions.height} cm` },
          { label: 'Depth', value: `${item.dimensions.depth} cm` },
        ];
      }
      if (item.weight) {
        specs['Physical Specifications'] = specs['Physical Specifications'] || [];
        specs['Physical Specifications'].push({ label: 'Weight', value: `${item.weight} g` });
      }
      specs['Product Information'] = [
        { label: 'SKU', value: item.sku || 'N/A' },
        { label: 'Warranty', value: item.warrantyInformation || 'Standard' },
      ];

      return {
        source: 'dummyjson',
        id: String(item.id),
        name: item.title,
        brand: item.brand || 'Generic',
        description: item.description,
        shortDescription: item.title,
        category: item.category,
        images: item.images || [],
        technicalSpecs: specs,
        suggestedPrice: item.price ? Math.round(item.price * 2500) : undefined,
      };
    }

    if (source === 'fakestore') {
      const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
      if (!response.ok) return null;

      const item: FakeStoreProduct = await response.json();

      return {
        source: 'fakestore',
        id: String(item.id),
        name: item.title,
        brand: 'Generic',
        description: item.description,
        shortDescription: item.title.slice(0, 100),
        category: item.category,
        images: [item.image],
        technicalSpecs: {
          'Product Information': [
            { label: 'Rating', value: `${item.rating.rate}/5` },
          ],
        },
        suggestedPrice: item.price ? Math.round(item.price * 2500) : undefined,
      };
    }

    if (source === 'platzi') {
      const response = await fetch(`https://api.escuelajs.co/api/v1/products/${productId}`);
      if (!response.ok) return null;

      const item: any = await response.json();
      const brand = extractBrandFromTitle(item.title);

      const cleanImages = normalizeExternalImages(item.images, item.image);

      return {
        source: 'platzi',
        id: String(item.id),
        name: item.title,
        brand,
        description: item.description || `${item.title} - High quality product`,
        shortDescription: item.title.slice(0, 100),
        category: item.category?.name || 'General',
        images: cleanImages.length > 0 ? cleanImages : ['https://placehold.co/400x400?text=No+Image'],
        technicalSpecs: {
          'Product Information': [
            { label: 'Category', value: item.category?.name || 'General' },
            { label: 'Product ID', value: String(item.id) },
          ],
        },
        suggestedPrice: item.price ? Math.round(item.price * 2500) : undefined,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching external product details:', error);
    return null;
  }
}
