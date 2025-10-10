import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('API Route: Fetching categories from product service');
    const response = await fetch('http://localhost:8000/categories', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('API Route: Failed to fetch categories', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: response.status });
    }

    const categories = await response.json();
    console.log('API Route: Successfully fetched', categories.length, 'categories');
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Route: Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}