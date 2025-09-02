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


export const kycRejectMail = async (email: string, reason: string) => {
  try {
    await transporter.sendMail({
      from: `"Edunity" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "KYC Rejected - Edunity",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: red;">KYC Verification Rejected</h2>
          <p>Dear Instructor,</p>
          <p>We regret to inform you that your KYC verification has been rejected after review.</p>
          
          <p><strong>Reason for rejection:</strong></p>
          <blockquote style="background:#f8d7da; color:#721c24; padding:10px; border-left:4px solid red;">
            ${reason}
          </blockquote>
          
          <p>Please ensure the following:</p> 
          <ul>
            <li>Upload clear and valid ID and address proof.</li>
            <li>Ensure details match your profile.</li>
          </ul>
          <p>You may try submitting again after correcting the above issues.</p>
          <br>
          <p>Regards,<br>Team Edunity</p>
        </div>
      `
    });
  } catch (error) {
    console.log("Email sending failed:", error);
  }
};

