import Link from "next/link";

const ReturnPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }> | undefined;
}) => {
  const session_id = (await searchParams)?.session_id;

  if (!session_id) {
    return <div>No session id found!</div>;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"}/api/payment/sessions/${session_id}`
  );
  const data = await res.json();

  return (
    <div className="">
      <h1>Payment {data.status}</h1>
      <p>Payment status: {data.paymentStatus}</p>
      <Link href="/orders">See your orders</Link>
    </div>
  );
};

export default ReturnPage;
