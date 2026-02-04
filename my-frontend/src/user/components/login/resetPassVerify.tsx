// src/pages/OtpVerification.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./forgotPassMail.css";
import { toast } from "react-toastify";
import { resendOtp, verifyOtp } from "../../services/authServices";
import axios from "axios";

interface LocationState {
  email: string;
  type: "login" | "forgot";
}

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60); // ⏱️ 60 seconds countdown
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { email, type } = location.state as LocationState;

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await verifyOtp(email,otp)
      if(!response) return
      if (response.data.success) {
        if (type === "forgot") {
          navigate("/user/resetPassword", { state: { email } });
        } else {
          navigate("/user/login");
        }
      }
    } catch (error:unknown) {
      console.error(error);
      if (axios.isAxiosError(error)) {
      toast.error(error.response?.data.message || "Invalid OTP. Try again.");
    } else {
      toast.error("Network error, please try again later");
    }
    }
  };

  const handleResend = async () => {
    try {
      const response = await resendOtp(email)
      if(!response) return
      if (response.data.success) {
        setIsResendDisabled(true);
        setTimer(60); // reset countdown
      }
    } catch (error) {
      console.error(error);
      alert("Failed to resend OTP.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleVerify} className="auth-form">
        <h2>Enter OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          className="auth-input"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit" className="auth-button">
          Verify OTP
        </button>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button
            type="button"
            onClick={handleResend}
            className="auth-button"
            style={{
              background: isResendDisabled ? "#9ca3af" : "#3b82f6",
              cursor: isResendDisabled ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
            }}
            disabled={isResendDisabled}
          >
            Resend OTP {isResendDisabled && `(${timer}s)`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtpVerification;
