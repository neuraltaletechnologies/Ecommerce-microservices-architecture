import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import StripePaymentsClient from "./StripePaymentsClient";

export const metadata: Metadata = {
  title: "Stripe Payments Dashboard",
  description: "View and manage Stripe payments, balances, and transactions",
};

async function getStripeData() {
  try {
    // Initialize Stripe inside function to avoid build-time errors
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });
    const [balance, charges, paymentIntents, checkoutSessions] = await Promise.all([
      // Get account balance
      stripe.balance.retrieve(),
      
      // Get recent charges (last 10)
      stripe.charges.list({ limit: 10 }),
      
      // Get recent payment intents (last 10)
      stripe.paymentIntents.list({ limit: 10 }),
      
      // Get recent checkout sessions (last 10)
      stripe.checkout.sessions.list({ limit: 10 }),
    ]);

    return {
      balance: {
        available: balance.available.map(b => ({
          amount: b.amount / 100,
          currency: b.currency.toUpperCase(),
        })),
        pending: balance.pending.map(b => ({
          amount: b.amount / 100,
          currency: b.currency.toUpperCase(),
        })),
      },
      charges: charges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount / 100,
        currency: charge.currency.toUpperCase(),
        status: charge.status,
        description: charge.description || "No description",
        customerEmail: charge.billing_details?.email || charge.receipt_email || "N/A",
        created: new Date(charge.created * 1000).toISOString(),
        paid: charge.paid,
        refunded: charge.refunded,
      })),
      paymentIntents: paymentIntents.data.map(pi => ({
        id: pi.id,
        amount: pi.amount / 100,
        currency: pi.currency.toUpperCase(),
        status: pi.status,
        description: pi.description || "No description",
        created: new Date(pi.created * 1000).toISOString(),
      })),
      checkoutSessions: checkoutSessions.data.map(session => ({
        id: session.id,
        amountTotal: (session.amount_total || 0) / 100,
        currency: session.currency?.toUpperCase() || "USD",
        status: session.status,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_details?.email || "N/A",
        created: new Date(session.created * 1000).toISOString(),
      })),
    };
  } catch (error) {
    console.error("Failed to fetch Stripe data:", error);
    return null;
  }
}

export default async function StripePaymentsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const stripeData = await getStripeData();

  return <StripePaymentsClient data={stripeData} />;
}
