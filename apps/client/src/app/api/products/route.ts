import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('API Route: Fetching products from product service');
    const response = await fetch('http://localhost:8000/products', {
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