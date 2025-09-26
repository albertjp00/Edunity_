import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import "./instructorRegister.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import instructorApi from "../../../api/instructorApi";
import registerImage from '../../../assets/authImage.png'

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterInstructor = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const validate = (): boolean => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      setMessage("Please fill all the fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setMessage("Please enter a valid email");
      return false;
    }

    if (!password.trim()) {
      setMessage("Password is required");
      return false;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    if (!passwordRegex.test(password)) {
      setMessage("Password must be at least 6 characters, include 1 number and 1 special character");
      return false;
    }


    if (!confirmPassword.trim() || password !== confirmPassword) {
      setMessage("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      localStorage.setItem("instOtpEmail", formData.email);

      const res = await instructorApi.post("/instructor/register", formData);
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
