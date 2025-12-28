import { useState, type ChangeEvent, type FormEvent } from "react";
// import axios from "axios";
import './register.css'
import { useNavigate } from 'react-router-dom'
// import api from "../../../api/userApi";
import { userRegister } from "../../services/authServices";
import { toast } from "react-toastify";
import authImage from '../../../assets/authImage.png'
import { AxiosError } from "axios";
import type { UserRegisterForm } from "../../interfaces";




const Register = () => {
  const [formData, setFormData] = useState<UserRegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });


  const navigate = useNavigate()

  const [message, setMessage] = useState("");
  const [error , setError] = useState<Record<string , string>>({})

  const validate = (name: string, value: string) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        break;

      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value)) return "Invalid email format";

        const [localPart] = value.split("@");
        if (localPart.length < 3)
          return "Email must contain at least 3 characters before @";
        break;
      }

      case "password": {
        const passwordRegex =
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

        if (!value.trim()) return "Password is required";
        if (!passwordRegex.test(value))
          return "Password must be 6+ chars, include number & special char";
        break;
      }

      case "confirmPassword":
        if (value !== formData.password)
          return "Passwords do not match";
        break;
    }

    return "";
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name , value } = e.target
    setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

    const error = validate(name , value)
    setError((prev) => ({
    ...prev,
    [name]: error,
  }));
  };

  const validateOnSubmit = () => {
  const newErrors: Record<string, string> = {};

  (Object.keys(formData) as Array<keyof UserRegisterForm>).forEach((key) => {
    const error = validate(key, formData[key]);
    if (error) newErrors[key] = error;
  });

  setError(newErrors);
  return Object.keys(newErrors).length === 0;
};




  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!validate()) return;
    if(!validateOnSubmit) return

    try {
      localStorage.setItem("otpEmail", formData.email);

      const res = await userRegister(formData);
      console.log(res);

      if (res?.data.success) {
        navigate("/user/verifyOtp");
      } else {
        console.log(res);

        toast.error(res?.data.message)
      }
    } catch (error: unknown) {
  console.error(error);

  let errMsg = "Registration failed";

  if (error instanceof AxiosError) {
    errMsg = error.response?.data?.message || error.message || errMsg;
  } else if (error instanceof Error) {
    errMsg = error.message;
  }

  toast.error(errMsg, { autoClose: 1500 });
  setMessage(errMsg);
}
  };


  return (
    <div className="register-container">
      {/* Left side - Form */}
      <div className="register-left">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Let’s get you started</h2>

          <input
            className="input"
            type="text"
            name="name"
            placeholder="Full name"
            onChange={handleChange}
            value={formData.name}
          />
          {error.name && <p className="error">{error.name}</p>}

          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            value={formData.email}
          />
          {error.email && <p className="error">{error.email}</p>}

          <input
            className="input"
            type="password"
            name="password"
            placeholder="Create password"
            onChange={handleChange}
            value={formData.password}
          />
          {error.password && <p className="error">{error.password}</p>}


          <input
            className="input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            onChange={handleChange}
          />
          {error.confirmPassword && (
  <p className="error">{error.confirmPassword}</p>
)}

        
          
          <button type="submit" className="register-button" disabled={Object.values(error).some(Boolean)}>
            Sign Up
          </button>
          
          

          {message && <p className="message">{message}</p>}

          <div className="form-links">
            Already a user? <a href="/user/login">Login</a>
          </div>
        </form>
      </div>

      {/* Right side - Quote */}
      <div className="register-right">
        <img
          src={authImage}
          alt="Register Illustration"
          className="side-image"
        />
      </div>

    </div>
  );

};

export default Register;
