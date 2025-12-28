import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import "./instructorRegister.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import registerImage from '../../../assets/authImage.png'
import { instructorRegister } from "../../services/Instructor/instructorServices";
import type { IRegisterForm } from "../../interterfaces/instructorInterfaces";



const RegisterInstructor = () => {
  const [formData, setFormData] = useState<IRegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState("");

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const error = validate(name, value);
    setMessage(error);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!validate()) return;

    try {
      localStorage.setItem("instOtpEmail", formData.email);

      const res = await instructorRegister(formData)
      if (!res) return
      console.log(res);

      if (res?.data.success) {
        navigate("/instructor/verifyOtp");
      } else {
        toast.error(res?.data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);

      const errMsg =
        error.response?.data?.message || error.message || "Registration failed";

      toast.error(errMsg, { autoClose: 1500 });
      setMessage(errMsg);
    }
  };

  useEffect(() => {
    console.log('useEffect');

    const token = localStorage.getItem('instructor')
    if (token) {
      navigate('/instructor/home')
    }
  }, [])

  return (
    <div className="register-wrapper">
      {/* Left side: form */}
      <div className="register-left">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Instructor Register</h2>

          <input
            className="input"
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
          />

          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email Address"
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

          <button type="submit" className="register-button">
            Sign Up
          </button>

          {message && <p className="message">{message}</p>}

          <p className="login-link">
            Already have an account? <a href="/instructor/login">Login</a>
          </p>
        </form>
      </div>

      {/* Right side: image */}
      <div className="register-right">
        <img
          src={registerImage}
          alt="Instructor Illustration"
          className="side-image"
        />
      </div>
    </div>
  );
};

export default RegisterInstructor;
