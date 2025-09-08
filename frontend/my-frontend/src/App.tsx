import { useState } from 'react'

import './App.css'
import { Route,BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './user/pages/home/homePage'
import { ToastContainer } from 'react-toastify'
import Login from './user/pages/authentication/Userlogin'
import Register from './user/components/register/register'
import VerifyOtp from './user/components/register/verifyOtp'
import ProtectedRoute from './user/components/protectedRoutes/protectedRoute'
import UserProfile from './user/pages/profile/profile'
import EditProfile from './user/components/profile/editProfile'
import UserPasswordChange from './user/components/profile/changePassword'
import UserCourseDetails from './user/pages/courseDetail/courseDetails'
import ShowUserMyCourses from './user/pages/myCourses/myCourses'
import UserViewMyCourse from './user/pages/myCourses/viewMyCourse'
import UserEventDetails from './user/pages/event/eventDetails'
import AllCoursesPage from './user/pages/courses/allCourses'

import UserChat from './user/components/chat/userChat'





import InstructorLogin from './instructor/pages/authentication/instructorLogin'
import InstructorRegister from './instructor/pages/authentication/register'
import InstVerifyOtp from './instructor/pages/authentication/instVerifyOtp'


import InstructorHome from './instructor/pages/home/home'
import ProfilePage from './instructor/pages/profile/profilePage'
import InstructoreditProfilePage from './instructor/pages/profile/editProfilePage'
import InstructorPasswordChange from './instructor/pages/profile/passwordChange'
import InstructorCourseDetails from './instructor/components/myCourses/courseDetails'
import InstructorEditCourse from './instructor/pages/profile/editCourse'
import InstProtectedRoute from './instructor/components/InsProtected'
import KycVerification from './instructor/pages/profile/kyc'
import ViewKyc from './instructor/components/kyc/viewKyc'
import CreateEvents from './instructor/pages/events/createEvents'
import InstructorEditEvents from './instructor/pages/events/editEvents'
import AddCoursesInstructor from './instructor/pages/course/addCourses'





import InstructorDetails from './admin/pages/adminInstructors/instructorDetails'
import UserDetails from './admin/pages/adminUsers/adminUserDetails'
import AdminCourses from './admin/pages/courses/adminCourses'
import AdminCourseDetails from './admin/pages/courses/adminCourseDetails'


import AdminHome from './admin/pages/home'
import LoginAdmin from './admin/pages/login/adminLogin'
import AdminProtectedRoute from './admin/components/adminProtectedRoute'
import ForgotPassword from './user/components/login/forgotPassMail'
import OtpVerification from './user/components/login/resetPassVerify'
import UserResetPassword from './user/components/login/resetPasssword'

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

            <Route path='/user/forgotPassword' element={<ForgotPassword />} />

            <Route path='/user/profile' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path='/user/editProfile' element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path='/user/changePassword' element={<ProtectedRoute><UserPasswordChange /></ProtectedRoute>} />
            
            <Route path='/user/otpVerification' element={<OtpVerification />} />
            {/* <Route path='/user/purchaseHistory' element={<PurchaseHistory />} /> */}

            <Route path='/user/resetPassword' element={<UserResetPassword />} />

            <Route path='/user/courseDetails/:id' element={<ProtectedRoute><UserCourseDetails /></ProtectedRoute>} />
            <Route path='/user/myCourses' element={<ProtectedRoute><ShowUserMyCourses /></ProtectedRoute>} />
            <Route path='/user/viewMyCourse/:id' element={<ProtectedRoute><UserViewMyCourse /></ProtectedRoute>} />
            <Route path='/user/allCourses' element={<ProtectedRoute><AllCoursesPage /></ProtectedRoute>} />


              
            <Route path='/user/eventDetails/:id' element={<ProtectedRoute><UserEventDetails /></ProtectedRoute>} />

            <Route path="/user/chat" element={<ProtectedRoute><UserChat /></ProtectedRoute>} />





            {/* Instructor */}
            <Route path='/instructor/login' element={<InstructorLogin />} />
            <Route path='/instructor/register' element={<InstructorRegister />} />
            <Route path='/instructor/verifyOtp' element={<InstVerifyOtp />} />

            <Route path='/instructor/home' element={<InstProtectedRoute><InstructorHome /></InstProtectedRoute>} />
            <Route path='/instructor/profile' element={<InstProtectedRoute><ProfilePage /></InstProtectedRoute>} />
            <Route path='/instructor/editProfile' element={<InstProtectedRoute><InstructoreditProfilePage /></InstProtectedRoute>} />
            <Route path='/instrcutor/passwordChange' element={<InstProtectedRoute><InstructorPasswordChange /></InstProtectedRoute>} />
            <Route path='/instructor/kyc' element={<KycVerification />} />

            <Route path='/instructor/addCourse' element={<InstProtectedRoute><AddCoursesInstructor /></InstProtectedRoute>} />
            <Route path='/instructor/courseDetails/:id' element={<InstProtectedRoute><InstructorCourseDetails /></InstProtectedRoute>} />
            <Route path='/instructor/editCourse/:id' element={<InstProtectedRoute><InstructorEditCourse /></InstProtectedRoute>} />

            <Route path='/instructor/createEvent' element={<InstProtectedRoute><CreateEvents /></InstProtectedRoute>}></Route>
            <Route path='/instructor/editEvent/:id' element={<InstProtectedRoute><InstructorEditEvents /></InstProtectedRoute>}></Route>
            



              // {/* admin  */}
            <Route path='/admin/login' element={<LoginAdmin />} />
            <Route path='/admin/*' element={<AdminProtectedRoute><AdminHome /></AdminProtectedRoute>} />
            <Route path='/admin/viewKyc/:id' element={<AdminProtectedRoute><ViewKyc /></AdminProtectedRoute>} />
            <Route path='/admin/instructors/:id' element={<AdminProtectedRoute><InstructorDetails /></AdminProtectedRoute>} />
            <Route path='/admin/user/:id' element={<AdminProtectedRoute><UserDetails /></AdminProtectedRoute>} />
            <Route path='/admin/courses' element={<AdminProtectedRoute><AdminCourses /></AdminProtectedRoute>} />
            <Route path='/admin/courseDetails/:id' element={<AdminProtectedRoute><AdminCourseDetails /></AdminProtectedRoute>} />



            


            {/* <Route path="*" element={<NotFound />} /> */}



          </Routes>
        </Router>
      </div>

    </>
  )
}

export default App
