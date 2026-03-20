import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const resolvePaymentServiceUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL ||
    "http://localhost:8002"
  );
};

export async function POST(request: NextRequest) {
  try {
    const paymentServiceUrl = resolvePaymentServiceUrl();

    const authorization = request.headers.get("authorization");
    const body = await request.json();

    const targetUrl = `${paymentServiceUrl}/sessions/create-checkout-session`;

    const response = await fetch(
      targetUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authorization ? { Authorization: authorization } : {}),
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const raw = await response.text();
    let data: unknown = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = { error: raw || "Unknown response from payment service" };
    }

    if (!response.ok) {
      return NextResponse.json(
        data || { error: { message: "Failed to create checkout session" } },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Client API /api/payment/create-checkout-session error:", error);
    const reason = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: {
          message: "Payment service unreachable from client API route.",
          details: reason,
          target: resolvePaymentServiceUrl(),
        },
      },
      { status: 500 }
    );
  }
}
