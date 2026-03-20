// Email notification utility - uses direct HTTP to email-service
export const sendOrderEmail = async (email: string, amount: number, status: string) => {
  const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || 'http://localhost:8004';
  
  try {
    const response = await fetch(`${EMAIL_SERVICE_URL}/send-order-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount, status }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error(
        `Failed to send order email: ${response.status} ${response.statusText}${body ? ` | ${body}` : ''}`
      );
      return;
    }

    console.log(`Order email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send order email:', error);
    // Don't throw - email failure shouldn't break order creation
  }
};
