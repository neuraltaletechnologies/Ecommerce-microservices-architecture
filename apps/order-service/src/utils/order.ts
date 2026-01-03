import { Order } from "@repo/order-db";
import { OrderType } from "@repo/types";
import { sendOrderEmail } from "./email";

export const createOrder = async (order: OrderType) => {
  const newOrder = new Order(order);

  try {
    const savedOrder = await newOrder.save();
    // Send email notification directly
    await sendOrderEmail(savedOrder.email, savedOrder.amount, savedOrder.status);
    return savedOrder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
