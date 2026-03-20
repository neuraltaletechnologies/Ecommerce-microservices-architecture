import { StripeProductType } from "@repo/types";
import stripe from "./stripe";

/**
 * Creates a product in Stripe with pricing in TZS
 * 
 * IMPORTANT: The database stores prices as whole TZS (not cents)
 * Example: 1500000 in database = TZS 1,500,000
 * Stripe expects amounts in the smallest currency unit (cents)
 * So we multiply by 100 to convert TZS to TZS cents
 */
export const createStripeProduct = async (item: StripeProductType) => {
  try {
    const res = await stripe.products.create({
      id: item.id,
      name: item.name,
      default_price_data: {
        currency: "tzs", // Tanzanian Shilling
        unit_amount: item.price * 100, // Convert whole TZS to cents (smallest unit)
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getStripeProductPrice = async (productId: number) => {
  try {
    const res = await stripe.prices.list({
      product: productId.toString(),
    });
    const unitAmount = res.data[0]?.unit_amount;
    
    if (!unitAmount) {
      throw new Error(`No price found for product ${productId} in Stripe. Make sure the product exists in Stripe.`);
    }
    
    return unitAmount;
  } catch (error) {
    console.error(`Error getting price for product ${productId}:`, error);
    throw error;
  }
};

export const deleteStripeProduct = async (productId: number) => {
  try {
    const res = await stripe.products.del(productId.toString());
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
