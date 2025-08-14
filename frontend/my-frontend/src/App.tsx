import { useState } from 'react'

import './App.css'
import { Route,BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './user/pages/home/homePage'
import { ToastContainer } from 'react-toastify'
import Login from './user/components/login/login'
import Register from './user/components/register/register'
import VerifyOtp from './user/components/register/verifyOtp'
import ProtectedRoute from './user/components/protectedRoute'
import Profile from './user/components/profile/userProfile'
import UserProfile from './user/pages/profile/profile'
import EditProfile from './user/components/profile/editProfile'
import InstructorLogin from './instructor/pages/login/instructorLogin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <ToastContainer />

        <Router>
          <Routes>
            <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path='/user/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
            {/* <Route path='/user/home' element={<Home />} /> */}
            <Route path='/user/login' element={<Login />} />
            <Route path='/user/register' element={<Register />} />
            <Route path='/user/verifyOtp' element={<VerifyOtp />} />

            {/* <Route path='/user/forgotPassword' element={<ForgotPassword />} /> */}

            <Route path='/user/profile' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path='/user/editProfile' element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            {/* <Route path='/user/changePassword' element={<ChangePassword />} />
            <Route path='/user/verify-otp' element={<ForgotPassVerifyOtp />} />
            <Route path='/user/purchaseHistory' element={<PurchaseHistory />} />

            <Route path='/user/resetPassword' element={<ResetPassword />} />

            <Route path='/user/courseDetails/:id' element={<CourseDetailsUser />} />
            <Route path='/user/myCourses' element={<MyCourses />} />
            <Route path='/user/viewMyCourse/:id' element={<ViewMyCourse />} /> */}





            {/* Instructor */}
            <Route path='/instructor/login' element={<InstructorLogin />} />
            {/* <Route path='/instructor/register' element={<InstructorRegister />} />
            <Route path='/instructor/otpVerify' element={<OtpVerify />} />

            <Route path='/instructor/home' element={<InstructorHome />} />
            <Route path='/instructor/profile' element={<Profile />} />
            <Route path='/instructor/editProfile' element={<ProfileEdit />} />
            <Route path='/instrcutor/passwordChange' element={<PasswordChange />} />
            <Route path='/instructor/kyc' element={<KycVerification />} />

            <Route path='/instructor/addCourse' element={<AddCourse />} />
            <Route path='/instructor/courseDetails/:id' element={<CourseDetails />} />
            <Route path='/instructor/editCourse/:id' element={<EditCourse />} /> */}






              // {/* admin  */}
            {/* <Route path='/admin/login' element={<AdminLogin />} />
            <Route path='/admin/*' element={<AdminHome />} />
            <Route path='/admin/viewKyc/:id' element={<ViewKYC />} />


            <Route path="*" element={<NotFound />} /> */}



          </Routes>
        </Router>
      </div>

    </>
  )
}

export default App
