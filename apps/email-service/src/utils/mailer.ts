import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendMail = async ({
  email,
  subject,
  text,
}: {
  email: string;
  subject: string;
  text: string;
}) => {
  const res = await transporter.sendMail({
    from: `"NeuralTale Shop" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    text,
  });

  console.log("MESSAGE SENT:", res);
};

export default sendMail;
