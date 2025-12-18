import React, { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import api from "../../../api/userApi";
import GoogleLoginButton from "../googleLogin/googleLogin";
import eye from '../../../assets/eye-icon.png'

interface LoginFormData {
  email: string;
  password: string;
}

const LoginUser: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);


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
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/user/home");
    }
  }, [navigate]);

  return (
    <div className="login">
      <div className="login-container">
        <h2>Login to Your Account</h2>

        <form onSubmit={onSubmitHandler} className="login-form">
          <input
            className="inputs"
            type="text"
            name="email"
            placeholder="Enter email"
            value={value.email}
            onChange={handleChange}
          />

          <div className="password-wrapper">
            <input
              className="inputs"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={value.password}
              onChange={handleChange}
            />

            <img
              className="eye-icon"
              src={eye}
              
              onClick={() => setShowPassword((prev) => !prev)}
              role="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              
            </img>
          </div>


          <div className="button-container">
            <button type="submit" className="btn">
              Continue
            </button>
          </div>

          {/* Google Sign-In inside login box */}
          <div className="google-login-container">
            <p className="or-text">Or login with</p>
            <GoogleLoginButton />
          </div>
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
  );
};

export default LoginUser;
