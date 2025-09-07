import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/userApi";
import './forgotPassMail.css'
import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/user/forgotPassword", { email });
      console.log(response.data);
      
      if (response.data.success) {
        navigate("/user/otpVerification", {
          state: { email, type: "forgot" },
        });
      }else{
        toast.error(response.data.message)
      }
    } catch (error:any) {
      console.error(error);
      if (error.response) {
      toast.error(error.response.data.message || "Something went wrong");
    } else {
      toast.error("Network error, please try again later");
    }
  
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="auth-input"
          value={email}
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
