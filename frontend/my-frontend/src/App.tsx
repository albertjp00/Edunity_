import { useState } from 'react'

import './App.css'
import { Route,BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './user/pages/home/homePage'
import { ToastContainer } from 'react-toastify'
import Login from './user/components/login/login'
import Register from './user/components/register/register'
import VerifyOtp from './user/components/register/verifyOtp'
import ProtectedRoute from './user/components/protectedRoutes/protectedRoute'
import UserProfile from './user/pages/profile/profile'
import EditProfile from './user/components/profile/editProfile'



import InstructorLogin from './instructor/pages/login/instructorLogin'
import InstructorHome from './instructor/pages/home/home'
import ProfilePage from './instructor/pages/profile/profilePage'
import InstructoreditProfilePage from './instructor/pages/profile/editProfilePage'
import InstructorPasswordChange from './instructor/pages/profile/passwordChange'
import InstructorCourseDetails from './instructor/components/myCourses/courseDetails'
import InstructorEditCourse from './instructor/pages/profile/editCourse'
import AddCourse from './instructor/components/addCourse/addCourse'
import UserPasswordChange from './user/components/profile/changePassword'
import UserCourseDetails from './user/pages/courseDetail/courseDetails'
import ShowUserMyCourses from './user/pages/myCourses/myCourses'
import UserViewMyCourse from './user/pages/myCourses/viewMyCourse'
import AdminHome from './admin/pages/home'
import InstProtectedRoute from './instructor/components/InsProtected'
import KycVerification from './instructor/pages/profile/kyc'
import ViewKyc from './instructor/components/kyc/viewKyc'
import CreateEvents from './instructor/pages/events/createEvents'
import InstructorDetails from './admin/pages/adminInstructors/instructorDetails'
import UserDetails from './admin/pages/adminUsers/adminUserDetails'
import AdminCourses from './admin/pages/courses/adminCourses'
import AdminCourseDetails from './admin/pages/courses/adminCourseDetails'
import InstructorEditEvents from './instructor/pages/events/editEvents'
import UserEventDetails from './user/pages/event/eventDetails'

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
            <Route path='/user/changePassword' element={<ProtectedRoute><UserPasswordChange /></ProtectedRoute>} />
            {/* <Route path='/user/verify-otp' element={<ForgotPassVerifyOtp />} />
            <Route path='/user/purchaseHistory' element={<PurchaseHistory />} />

            <Route path='/user/resetPassword' element={<ResetPassword />} /> */}

            <Route path='/user/courseDetails/:id' element={<ProtectedRoute><UserCourseDetails /></ProtectedRoute>} />
            <Route path='/user/myCourses' element={<ProtectedRoute><ShowUserMyCourses /></ProtectedRoute>} />
            <Route path='/user/viewMyCourse/:id' element={<ProtectedRoute><UserViewMyCourse /></ProtectedRoute>} />

            <Route path='/user/eventDetails/:id' element={<ProtectedRoute><UserEventDetails /></ProtectedRoute>} />






            {/* Instructor */}
            <Route path='/instructor/login' element={<InstructorLogin />} />
            {/* <Route path='/instructor/register' element={<InstructorRegister />} />
            <Route path='/instructor/otpVerify' element={<OtpVerify />} /> */}

            <Route path='/instructor/home' element={<InstProtectedRoute><InstructorHome /></InstProtectedRoute>} />
            <Route path='/instructor/profile' element={<InstProtectedRoute><ProfilePage /></InstProtectedRoute>} />
            <Route path='/instructor/editProfile' element={<InstProtectedRoute><InstructoreditProfilePage /></InstProtectedRoute>} />
            <Route path='/instrcutor/passwordChange' element={<InstProtectedRoute><InstructorPasswordChange /></InstProtectedRoute>} />
            <Route path='/instructor/kyc' element={<KycVerification />} />

            <Route path='/instructor/addCourse' element={<InstProtectedRoute><AddCourse /></InstProtectedRoute>} />
            <Route path='/instructor/courseDetails/:id' element={<InstProtectedRoute><InstructorCourseDetails /></InstProtectedRoute>} />
            <Route path='/instructor/editCourse/:id' element={<InstProtectedRoute><InstructorEditCourse /></InstProtectedRoute>} />

            <Route path='/instructor/createEvent' element={<InstProtectedRoute><CreateEvents /></InstProtectedRoute>}></Route>
            <Route path='/instructor/editEvent/:id' element={<InstProtectedRoute><InstructorEditEvents /></InstProtectedRoute>}></Route>
            



              // {/* admin  */}
            {/* <Route path='/admin/login' element={<AdminLogin />} /> */}
            <Route path='/admin/*' element={<AdminHome />} />
            <Route path='/admin/viewKyc/:id' element={<ViewKyc />} />
            <Route path='/admin/instructors/:id' element={<InstructorDetails />} />
            <Route path='/admin/user/:id' element={<UserDetails />} />
            <Route path='/admin/courses' element={<AdminCourses />} />
            <Route path='/admin/courseDetails/:id' element={<AdminCourseDetails />} />



            


            {/* <Route path="*" element={<NotFound />} /> */}



          </Routes>
        </Router>
      </div>

    </>
  )
}

export default App
