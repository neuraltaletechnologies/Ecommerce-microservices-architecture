import { auth } from "@clerk/nextjs/server";
import { OrderType } from "@repo/types";

export const dynamic = 'force-dynamic';

/**
 * Format TZS amount from Stripe (which stores in cents)
 * Stripe amounts are in smallest currency unit, so we divide by 100
 */
function formatOrderAmount(amountInCents: number): string {
  const amountInTzs = amountInCents / 100;
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInTzs);
}

const fetchOrders = async () => {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/user-orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      console.error('Failed to fetch orders:', res.status, res.statusText);
      return null;
    }

    const data: OrderType[] = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return null;
  }
};

const OrdersPage = async () => {
  const orders = await fetchOrders();

  if (!orders) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl my-4 font-medium text-[#001E3C]">Your Orders</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Failed to load orders. Please try again later.
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl my-4 font-medium text-[#001E3C]">Your Orders</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-2">You haven't placed any orders yet.</p>
          <a href="/products" className="text-[#0A7EA4] hover:text-[#001E3C] hover:underline font-medium">
            Start shopping
          </a>
        </div>
      </div>
    );
  }

  console.log('Orders:', orders);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl my-4 font-medium">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-[#FDB913]/30 transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <span className="font-medium text-sm text-gray-500 block mb-1">
                  Order ID
                </span>
                <p className="text-sm font-mono">{order._id}</p>
              </div>
              <div>
                <span className="font-medium text-sm text-gray-500 block mb-1">Total</span>
                <p className="font-semibold text-lg">{formatOrderAmount(order.amount)}</p>
              </div>
              <div>
                <span className="font-medium text-sm text-gray-500 block mb-1">Status</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div>
                <span className="font-medium text-sm text-gray-500 block mb-1">Date</span>
                <p className="text-sm">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : "-"}
                </p>
              </div>
              <div>
                <span className="font-medium text-sm text-gray-500 block mb-1">
                  Products
                </span>
                <p className="text-sm">{order.products?.map(product=> product.name).join(", ") || "-"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
