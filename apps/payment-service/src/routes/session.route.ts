import { Hono } from "hono";
import stripe from "../utils/stripe";
import { shouldBeUser } from "../middleware/authMiddleware";
import { CartItemsType } from "@repo/types";

const sessionRoute = new Hono();

const getFallbackUnitAmount = (price: unknown): number | null => {
  const tzs = Number(price);
  if (!Number.isFinite(tzs) || tzs <= 0) return null;

  // Database/cart prices are stored as whole TZS. Stripe expects smallest unit.
  return Math.round(tzs * 100);
};

sessionRoute.post("/create-checkout-session", shouldBeUser, async (c) => {
  try {
    const body = await c.req.json();
    const { cart } = body as { cart: CartItemsType };
    const userId = c.get("userId");

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return c.json({ error: "Cart is empty or invalid" }, 400);
    }

    const lineItems = cart.map((item) => {
      const unitAmount = getFallbackUnitAmount(item.price);

      if (!unitAmount) {
        throw new Error(
          `Invalid product price for "${item.name}" (ID: ${item.id}).`
        );
      }

      return {
        price_data: {
          currency: "tzs", // Tanzanian Shilling
          product_data: {
            name: item.name,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3002";

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: userId,
      mode: "payment",
      ui_mode: "custom",
      return_url: `${frontendUrl}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return c.json({ checkoutSessionClientSecret: session.client_secret });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
    return c.json({ error: { message: errorMessage } }, 500);
  }
});

sessionRoute.get("/:session_id", async (c) => {
  const { session_id } = c.req.param();
  const session = await stripe.checkout.sessions.retrieve(
    session_id as string,
    {
      expand: ["line_items"],
    }
  );

  // console.log(session);

  return c.json({
    status: session.status,
    paymentStatus: session.payment_status,
  });
});

export default sessionRoute;
