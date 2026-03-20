import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const resolvePaymentServiceUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL ||
    "http://localhost:8002"
  );
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ session_id: string }> }
) {
  try {
    const paymentServiceUrl = resolvePaymentServiceUrl();
    const { session_id } = await context.params;

    const response = await fetch(`${paymentServiceUrl}/sessions/${session_id}`, {
      cache: "no-store",
    });

    const raw = await response.text();
    let data: unknown = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = { error: raw || "Unknown response from payment service" };
    }

    if (!response.ok) {
      return NextResponse.json(data || { error: "Failed to fetch session" }, {
        status: response.status,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Client API /api/payment/sessions/[session_id] error:", error);
    const reason = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: {
          message: "Payment service session lookup failed.",
          details: reason,
          target: resolvePaymentServiceUrl(),
        },
      },
      { status: 500 }
    );
  }
}
