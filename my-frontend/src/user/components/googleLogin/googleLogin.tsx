/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../services/authServices";
import { fetchUserProfile } from "../../../redux/slices/authSlice";
import { useAppDispatch } from "../../../redux/hooks";

const GoogleLoginButton = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
  const handleSuccess = async (credentialResponse: any) => {
  try {
    const res = await googleLogin(credentialResponse)
    console.log(res);
    
    if(!res) return

    const {token , user } = res.data;

    console.log("Login Success:", user);

    dispatch(fetchUserProfile())
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
