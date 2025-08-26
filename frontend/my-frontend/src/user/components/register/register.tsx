import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import './register.css'
import { useNavigate } from 'react-router-dom'
import api from "../../../api/userApi";
import { userRegister } from "../../services/authServices";
import { toast } from "react-toastify";


interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });


  const navigate = useNavigate()

  const [message, setMessage] = useState("");

  const validate = (): boolean => {

    const { name, email, password, confirmPassword } = formData

    if (!name.trim()) {
      setMessage('Please fill all the fileds')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setMessage("Please enter a valid email");
      return false;
    }

    if (!password.trim() || password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return false;
    }

    if (!confirmPassword.trim() || password != confirmPassword) {
      setMessage("Passwords do not match")
      return false;
    }

    return true

  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    localStorage.setItem("otpEmail", formData.email);

    const res = await userRegister(formData);
    console.log(res);
    
    if (res?.data.success) {
      navigate("/user/verifyOtp");
    }else{
      console.log(res);
      
      toast.error(res?.data.message)
    }
  } catch (error: any) {
    console.error(error);

    const errMsg =
      error.response?.data?.message || error.message || "Registration failed";

    toast.error(errMsg, { autoClose: 1500 });
    setMessage(errMsg);
  }
};


  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>User Register</h2>

        <input
          className="input"
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={formData.name}
        />

        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
        />

        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
        />

        <input
          className="input"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}

        />

        <button type="submit" className="register-button">Register</button>
        {message && <p className="message">{message}</p>}

      </form>
    </div>
  );

};

export default Register;
