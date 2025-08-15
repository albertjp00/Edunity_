import axios from 'axios'
import React, { useState, useEffect, type FormEvent } from 'react'
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

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault() 
    console.log("Ui ", value)

    try {
      const response = await instructorApi.post('/instructor/login', value);

      localStorage.setItem('instructor', response.data.token);
      // localStorage.setItem('instructorId', response.data.instructor._id);
      navigate('/instructor/home');
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";

      if (error.response?.status === 403) {
        toast.warning(message); 
      } else {
        toast.error(message);
      }
    }


  }

  // useEffect(()=>{
  //     console.log('useEffect');

  //     let token = localStorage.getItem('instructor')
  //     if(token){
  //       navigate('/instructor/home')
  //     }
  //   },[])

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

