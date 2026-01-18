import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import './instVerifyotp.css'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { resendOtpRequest, verifyOtp } from "../../services/instructorServices";

const InstructorVerifyOtp : React.FC = () => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60)
  const [isDisabled, setIsDisabled] = useState(false)

  const navigate = useNavigate()

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const email = localStorage.getItem('instOtpEmail')
      if(!email) return
      const res = await verifyOtp(email , otp)
      // console.log(res);
      if(!res) return

      if (res.data.success) {
        //     localStorage.setItem('token',res.data.result.token)
        //   alert("Verified and Registered!");
        //   console.log("Token/User:", res.data.result.token);
        toast.success('OTP verified')
        localStorage.removeItem('instOtpEmail')
        navigate('/instructor/login')
      }
      // You can redirect to login/home here
    } catch (err) {
  console.log(err);

  if (axios.isAxiosError(err)) {
    toast.error(err.response?.data?.message || "OTP verification failed");
  } else {
    toast.error("Something went wrong");
  }
}

  };

  const resendOtp = async () => {
    const email = localStorage.getItem('instOtpEmail')
    if(!email) return
    const res = await resendOtpRequest(email)
    if(!res) return

    if (res.data.success) {
      toast.success('Otp resend to your mail')
        setTimeLeft(60)
        setIsDisabled(false)
        
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    if (!localStorage.getItem('instOtpEmail')) {
      navigate('/instructor/login')
    }
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsDisabled(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="verify">
      <div className="form-container">
        <form onSubmit={handleOtpSubmit} className="formOtp">
          <h3>Enter OTP</h3>
          <div className="otp-container">
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
              required
            /><br />
          </div>

          <p>
            Time left: {formatTime(timeLeft)}
          </p>

          <button type="submit" className="button" disabled={isDisabled}>
            {isDisabled ? "OTP Expired" : "Verify OTP"}
          </button>

        </form>
        <button onClick={resendOtp} className="button-resend" disabled={!isDisabled}>
        Resend OTP
      </button>
      </div>

      
    </div>
  );
};

export default InstructorVerifyOtp;
