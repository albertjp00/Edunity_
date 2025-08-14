interface OtpData {
  name: string;
  email: string;
  password: string;
  otp: string;
  expiresAt: number;
}

export const otpStore: Map<string, OtpData> = new Map();
