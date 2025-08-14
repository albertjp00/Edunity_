import axios from 'axios'
import React, { useState,useEffect, type FormEvent } from 'react'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import instructorApi from '../../../api/instructorApi'

const InstructorLogin = () => {

  const navigate = useNavigate()
  const [value, setValue] = useState({
    email: '',
    password: ''
  })

  const onSubmitHandler = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault() // prevent page reload
    console.log("Ui ",value)

    try {
      const response = await instructorApi.post('/instructor/login',
        value
    )

    

      if (response.status === 200) {
        localStorage.setItem('instructor',response.data.token)
        console.log("Login successful:", response.data)
        navigate('/instructor/home')
      } else {
        console.log("Login failed")
      }
    }  catch (error:any) {
        console.error("Error logging in:", error);
    
        const message = error.response?.data?.message || "Something went wrong";
    
        if (error.response?.status === 403) {
          toast.warning(message); // "Your account is blocked"
        } else {
          toast.error(message);
        }
      }

    
  }

  useEffect(()=>{
      console.log('useEffect');
      
      let token = localStorage.getItem('instructor')
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

            
          <input
            className='inputs'
            type='password'
            name='password'
            placeholder='Enter Password'
            value={value.password}
            onChange={(e) => setValue({ ...value, [e.target.name]: e.target.value })}

          />

          
          <div className="button-container">
            <button type='submit' className='btn'>Login</button>
          </div>
          
        </form>

        <div className="login-links">
        
        <p>
          Don’t have an account?{' '}
          <Link to="/user/register" className='link'>Register</Link>
        </p>
      </div>
      </div>
    </div>
  )
}

export default InstructorLogin

