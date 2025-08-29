import React, { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import api from "../../../api/userApi";
import type { AxiosError } from "axios";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  success?: boolean;
  message?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post("/user/login", value);

      if (response.status === 200 && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/user/home");
      }
    } catch (error: any) {
      console.log(error);

      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);


    }
  };

  // const handleSuccess = async (credentialResponse: CredentialResponse) => {
  //   try {
  //     if (!credentialResponse.credential) {
  //       throw new Error("No Google credential received");
  //     }

  //     const decoded: any = jwtDecode(credentialResponse.credential);
  //     console.log("Google user:", decoded);

  //     const response = await api.post<LoginResponse>("/user/googleLogin", {
  //       token: credentialResponse.credential,
  //     });

  //     if (response.data.success && response.data.accessToken) {
  //       localStorage.setItem("token", response.data.accessToken);
  //       if (response.data.refreshToken) {
  //         localStorage.setItem("refreshToken", response.data.refreshToken);
  //       }
  //       navigate("/user/home");
  //     }
  //   } catch (err) {
  //     console.error("Google login failed", err);
  //     toast.error("Google login failed. Please try again.");
  //   }
  // };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/user/home");
  //   }
  // }, [navigate]);

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
