import axios from 'axios'
import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import './instructorLogin.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import eye from '../../../assets/eye-icon.png'
import { useAppDispatch } from '../../../redux/hooks'
import { fetchInstructorProfile } from '../../../redux/slices/authSlice'
import { instructorLogin } from '../../services/instructorServices'

const InstructorLogin = () => {

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [value, setValue] = useState({
    email: '',
    password: ''
  })

  const dispatch = useAppDispatch()

  const validate = ()=>{
    console.log("Validate triggered", value)
    if(value.email.trim() =='' || value.password.trim() == ''){
      toast.error("Email and password Required")
      return false
    }

    return true
  }

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault() 

    if(!validate()) return

    try {
      const response = await instructorLogin(value)
      
      localStorage.setItem('instructor', response?.data.token);
      dispatch(fetchInstructorProfile())
      navigate('/instructor/home');
    } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || "Something went wrong";

    if (error.response?.status === 403) {
      toast.warning(message);
    } else {
      toast.error(message);
    }
  } else {
    toast.error("Unexpected error occurred");
  }
}


  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setValue({
        ...value,
        [e.target.name]: e.target.value,
      });
    };

  useEffect(()=>{
      console.log('useEffect');

      const token = localStorage.getItem('instructor')
      if(token){
        navigate('/instructor/home')
      }
    },[])

  return (
    <div className='login'>
      <div className="login-container">


        <h2>Instructor Login</h2>
        <form onSubmit={onSubmitHandler} className='login-form'>
          <input
            className='inputs'
            type='text'
            name='email'
            placeholder='Enter email'
            value={value.email}
            onChange={(e) => setValue({ ...value, [e.target.name]: e.target.value })}

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
            <button type='submit' className='btn'>Login</button>
          </div>

        </form>

        <div className="login-links">
          <p>
                      <Link to="/instructor/forgotPassword" className="link">
                        Forgot Password?
                      </Link>
                    </p>

          <p>
            Don’t have an account?{' '}
            <Link to="/instructor/register" className='link'>Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default InstructorLogin

