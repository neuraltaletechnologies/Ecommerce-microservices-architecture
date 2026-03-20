import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const productServiceUrl =
      process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";

    const response = await fetch(`${productServiceUrl}/categories`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch categories", details: response.statusText },
        { status: response.status }
      );
    }

    const categories = await response.json();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Admin API /api/categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
