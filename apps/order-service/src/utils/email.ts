// Simple email notification utility (no Kafka needed)
export const sendOrderEmail = async (email: string, amount: number, status: string) => {
  const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || 'http://localhost:8004';
  
  try {
    await fetch(`${EMAIL_SERVICE_URL}/send-order-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount, status }),
    });
    console.log(`Order email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send order email:', error);
    // Don't throw - email failure shouldn't break order creation
  }
};
