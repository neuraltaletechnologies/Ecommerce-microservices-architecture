// Email notification utility - uses direct HTTP to email-service
export const sendUserWelcomeEmail = async (email: string, username: string) => {
  const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || 'http://localhost:8004';
  
  try {
    await fetch(`${EMAIL_SERVICE_URL}/send-welcome-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username }),
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw - email failure shouldn't break user creation
  }
};
