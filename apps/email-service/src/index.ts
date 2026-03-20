import express from 'express';
import dotenv from 'dotenv';
import sendMail from "./utils/mailer";

dotenv.config();

const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'email-service' });
});

// Send welcome email endpoint
app.post('/send-welcome-email', async (req, res) => {
  try {
    const { email, username } = req.body;

    if (email) {
      await sendMail({
        email,
        subject: "Welcome to E-commerce App",
        text: `Welcome ${username}. Your account has been created!`,
      });
      res.json({ success: true, message: 'Welcome email sent' });
    } else {
      res.status(400).json({ success: false, message: 'Email is required' });
    }
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// Send order confirmation email endpoint
app.post('/send-order-email', async (req, res) => {
  try {
    const { email, amount, status } = req.body;

    if (email) {
      // Format amount from Stripe cents to TZS
      const formattedAmount = new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0,
      }).format(amount / 100);
      
      await sendMail({
        email,
        subject: "Order Confirmation",
        text: `Hello! Your order has been ${status}. Amount: ${formattedAmount}`,
      });
      res.json({ success: true, message: 'Order email sent' });
    } else {
      res.status(400).json({ success: false, message: 'Email is required' });
    }
  } catch (error) {
    console.error('Failed to send order email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 8004;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Email service running on port ${PORT}`);
});
