import React, { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import "./adminLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
// import api from "../../../api/userApi";
import { adminLogin } from "../../services/adminServices";
import type { LoginFormData } from "../../adminInterfaces";



const LoginAdmin: React.FC = () => {
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
      const response = await adminLogin(value)
      if(!response) {
        return
      }
      // if (response.status === 200 && response.data.accessToken) {
      //   localStorage.setItem("token", response.data.accessToken);
      //   navigate("/user/home");
      // }
      if (response.data.success) {
        localStorage.setItem('admin',response.data.token)
        navigate('/admin/home')
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    }
  };
  

  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (token) {
      navigate("/admin/home");
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

          <input
            className="inputs"
            type="password"
            name="password"
            placeholder="Enter Password"
            value={value.password}
            onChange={handleChange}
          />

          <div className="button-container">
            <button type="submit" className="btn">
              Continue
            </button>
          </div>


        </form>

        <div className="login-links">
          <p>
            <Link to="/user/forgotPassword" className="link">
              Forgot Password?
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
