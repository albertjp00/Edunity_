import React, { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";
import api from "../../../api/userApi";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  success?: boolean;
  message?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("UI sending:", value);

    try {
      const response = await api.post<LoginResponse>("/user/login", value);

      // console.log("Login API response:", response);

      if (response.status === 200 && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        console.log("Token saved, navigating...");
        navigate("/user/home");
        
      } else {
        console.warn("Unexpected response, not redirecting.");
      }
    } catch (error: any) {
      console.error("Error logging in:", error);

      const message = error.response?.data?.message || "Something went wrong";

      if (error.response?.status === 403) {
        toast.warning(message);
      } else {
        toast.error(message);
      }
    }
  };


  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      console.log(credentialResponse);

      if (!credentialResponse.credential) {
        throw new Error("No Google credential received");
      }

      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log("Google user:", decoded);

      const response = await api.post<LoginResponse>("/user/googleLogin", {
        token: credentialResponse.credential,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/user/home");
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  // useEffect(() => {
  //   console.log("useEffect");

  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/user/home");
  //   }
  // }, []);

  return (
    <>
      <div className="login">
        <div className="login-container">
          <h2>User Login</h2>

          <form onSubmit={onSubmitHandler} className="login-form">
            <input
              className="inputs"
              type="text"
              name="email"
              placeholder="Enter email"
              value={value.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, [e.target.name]: e.target.value })
              }
            />

            <input
              className="inputs"
              type="password"
              name="password"
              placeholder="Enter Password"
              value={value.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setValue({ ...value, [e.target.name]: e.target.value })
              }
            />

            <div className="button-container">
              <button type="submit" className="btn">
                Login
              </button>
            </div>

            {/* <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log("Google Login Failed")}
            />
          </div> */}
          </form>

          <div className="login-links">
            <p>
              <Link to="/user/forgotPassword" className="link">
                Forgot Password?
              </Link>
            </p>
            <p>
              Don’t have an account?{" "}
              <Link to="/user/register" className="link">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
