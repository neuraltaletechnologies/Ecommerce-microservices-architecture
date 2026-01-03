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
          ? products.map((item) => (
              <Card
                key={item.id}
                className="flex-row items-center justify-between gap-4 p-4"
              >
                <div className="w-12 h-12 rounded-sm relative overflow-hidden">
                  <Image
                    src={
                      Object.values(item.images as Record<string, string>)[0] ||
                      ""
                    }
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    {item.name}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-0">{formatTZSCompact(item.price)}</CardFooter>
              </Card>
            ))
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
