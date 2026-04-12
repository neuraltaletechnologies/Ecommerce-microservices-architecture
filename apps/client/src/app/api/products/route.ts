import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const productServiceUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:8000';
    const targetUrl = new URL(`${productServiceUrl}/products`);

    const category = url.searchParams.get('category');
    const limit = url.searchParams.get('limit');
    const sort = url.searchParams.get('sort');

    if (category) {
      targetUrl.searchParams.set('category', category);
    }

    if (limit) {
      targetUrl.searchParams.set('limit', limit);
    }

    if (sort) {
      targetUrl.searchParams.set('sort', sort);
    }

    console.log('API Route: Fetching products from product service', targetUrl.toString());

    const response = await fetch(targetUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('API Route: Failed to fetch products', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: response.status });
    }

    const products = await response.json();
    console.log('API Route: Successfully fetched products');
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Route: Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}