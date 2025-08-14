import nodemailer from "nodemailer";
import dotenv from "dotenv";



dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string
  }
});

export const sendOtp = async (to: string, otp: string): Promise<void> => {
  await transporter.sendMail({
    from: `"Edunity" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP",
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`
  });
};
