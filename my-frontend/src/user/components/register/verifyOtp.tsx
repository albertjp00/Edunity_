import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import './verifyOtp.css'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { otpVerified, resendOtpProfile } from "../../services/profileServices";

const VerifyOtp : React.FC = () => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60)
  const [isDisabled, setIsDisabled] = useState(false)

  const navigate = useNavigate()

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const email = localStorage.getItem('otpEmail')!
      const res = await otpVerified(email , otp)
      console.log('verify otp ',res);
      
      if(!res) return
      if (res.data.success) {
        toast.success('OTP verified')
        localStorage.removeItem('otpEmail')
        navigate('/user/login')
      }
      // You can redirect to login/home here
    } catch (err) {
      if(axios.isAxiosError(err)){
        console.log(err);

      toast.error(err.response?.data?.message || "OTP verification failed");
      }
    }
  };

  const resendotp = async () => {
    const email = localStorage.getItem('otpEmail')!
    const res = await resendOtpProfile(email)
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
    if (!localStorage.getItem('otpEmail')) {
      navigate('/user/login')
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

          <button onClick={resendotp} className="button-resend" disabled={!isDisabled}>
        Resend OTP
      </button>

        </form>
        
      </div>

      
    </div>
  );
};

export default VerifyOtp;
