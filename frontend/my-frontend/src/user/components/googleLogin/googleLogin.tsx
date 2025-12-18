/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../services/authServices";

const GoogleLoginButton = () => {
    const navigate = useNavigate()
  const handleSuccess = async (credentialResponse: any) => {
  try {
    const res = await googleLogin(credentialResponse)
    if(!res) return

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
