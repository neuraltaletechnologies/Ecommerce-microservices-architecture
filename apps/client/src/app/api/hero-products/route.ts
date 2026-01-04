import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:8000';
    
    const response = await fetch(`${PRODUCT_SERVICE_URL}/products/hero`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 1 minute like products
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch hero products' }, { status: response.status });
    }

    const heroProducts = await response.json();
    
    return NextResponse.json(heroProducts);
  } catch (error) {
    console.error('Error fetching hero products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
