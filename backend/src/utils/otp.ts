
// Function to generate a 4-digit OTP as a string (leading zeros preserved)
export const generateOtp = (): string => {
    return Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
};


