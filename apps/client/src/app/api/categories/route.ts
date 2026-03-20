import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('API Route: Fetching categories from product service');
    const productServiceUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:8000';
    const response = await fetch(`${productServiceUrl}/categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('API Route: Failed to fetch categories', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch categories', details: response.statusText }, 
        { status: response.status }
      );
    }

    const categories = await response.json();
    console.log('API Route: Successfully fetched', categories?.length || 0, 'categories');
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Route: Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}