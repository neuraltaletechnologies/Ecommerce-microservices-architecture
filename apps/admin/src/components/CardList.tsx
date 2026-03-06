import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { OrderType, ProductsType } from "@repo/types";
import { formatTZSCompact } from "@/lib/utils/currency";
import { auth } from "@clerk/nextjs/server";



const CardList = async ({ title }: { title: string }) => {

  let products: ProductsType = [];
  let orders: OrderType[] = [];

  const { getToken } = await auth();
  const token = await getToken();

  if (title === "Popular Products") {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?limit=5&popular=true`
      );
      if (res.ok) {
        const data = await res.json();
        products = Array.isArray(data) ? JSON.parse(JSON.stringify(data)) : [];
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      products = [];
    }
  } else {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders?limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const data = await res.json();
        orders = Array.isArray(data) ? JSON.parse(JSON.stringify(data)) : [];
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      orders = [];
    }
  }

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {title === "Popular Products"
          ? products.map((item) => {
              // Images structure: { "Color Name": ["url1", "url2"] } or { "Color Name": "url" }
              let imageUrl: string | null = null;
              if (item.images && typeof item.images === 'object') {
                const firstColorImages = Object.values(item.images as Record<string, unknown>)[0];
                if (Array.isArray(firstColorImages) && typeof firstColorImages[0] === 'string') {
                  imageUrl = firstColorImages[0];
                } else if (typeof firstColorImages === 'string') {
                  imageUrl = firstColorImages;
                }
              }
              
              return (
                <Card
                  key={item.id}
                  className="flex-row items-center justify-between gap-4 p-4"
                >
                  <div className="w-12 h-12 rounded-sm relative overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <CardContent className="flex-1 p-0">
                    <CardTitle className="text-sm font-medium">
                      {item.name}
                    </CardTitle>
                  </CardContent>
                  <CardFooter className="p-0">{formatTZSCompact(item.price)}</CardFooter>
                </Card>
              );
            })
          : orders.map((item) => (
              <Card
                key={item._id}
                className="flex-row items-center justify-between gap-4 p-4"
              >
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    {item.email}
                  </CardTitle>
                  <Badge variant="secondary">{item.status}</Badge>
                </CardContent>
                <CardFooter className="p-0">
                  {new Intl.NumberFormat('en-TZ', {
                    style: 'currency',
                    currency: 'TZS',
                    minimumFractionDigits: 0,
                  }).format(item.amount / 100)}
                </CardFooter>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default CardList;
