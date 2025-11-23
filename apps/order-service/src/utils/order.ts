import { Order } from "@repo/order-db";
import { OrderType } from "@repo/types";
import { sendOrderEmail } from "./email";

export const createOrder = async (order: OrderType) => {
  const newOrder = new Order(order);

  try {
    const order = await newOrder.save();
    // Send email notification directly
    await sendOrderEmail(order.email, order.amount, order.status);
} catch (error) {
    console.log(error);
    throw error;
  }
};
