/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
    const navigate = useNavigate()
  const handleSuccess = async (credentialResponse: any) => {
  try {
    const res = await axios.post("http://localhost:5000/user/auth/googleLogin", {
      token: credentialResponse.credential,
    }, { withCredentials: true });

    const {token , user } = res.data;

    console.log("Login Success:", user);

    localStorage.setItem("token", token);
    navigate('/user/home')
  } catch (err) {
    console.error("Google login failed:", err);
  }
};


  return (
    
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Google Sign-In Failed")}
    />
  );
};

export default GoogleLoginButton;
