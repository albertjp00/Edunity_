

import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
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

import Favourites from './user/components/favourites/favourites'






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
import ViewKyc from './admin/components/kyc/viewKyc'
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
import InstructorChat from './instructor/components/chat/instructorChat'
import AddQuiz from './instructor/components/quiz/addQuiz'
import DoQuiz from './user/components/myCourses/doQuiz'
import Quiz from './instructor/components/quiz/quiz'
import InstructorResetPassword from './instructor/components/authentication/resetPassword'
import InstructorForgotPassword from './instructor/components/authentication/forgotPassMail'
import OtpVerificationInstructor from './instructor/components/authentication/resetPasswordVerify'
import InstructorVerifyOtp from './instructor/components/authentication/InstVerifyOtp'
import InstructorEvent from './instructor/pages/events/joinEvent'
import UserEvent from './user/pages/event/joinEvent'
import CoursePurchaseDetails from './instructor/pages/course/purchaseDetails'
import Wallet from './user/components/profile/wallet'
import InstructorNotifications from './instructor/components/notification/notifications'
import AllPayments from './user/components/payments/payments'
import UserNotifications from './user/components/notifications/notifications'
import InstructorDashboard from './instructor/components/dashboard/instructorDashboard'
import UserWallet from './instructor/components/profile/wallet'
import InstructorAllCoursesPage from './instructor/pages/course/allCoursesPage'
import SubscriptionPage from './user/pages/subscription/subscriptionPage'
import { useEffect } from 'react'
import { fetchUserProfile } from './redux/slices/authSlice'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import PaymentSuccess from './user/components/showCourses/paymentSuccess'
import PaymentFailed from './user/components/showCourses/paymentFailed'
import EventDetailsPage from './instructor/pages/events/eventDetails'
import AllEventsPage from './instructor/pages/events/allEvents'
// import PurchasesAdmin from './admin/pages/purchases/purchasesAdmin'

function App() {

  const dispatch = useAppDispatch()
  const {user  , isAuthenticated} = useAppSelector((state)=>state.auth)

  useEffect(()=>{
    if (isAuthenticated && !user) {
    dispatch(fetchUserProfile());
  }
  },[])

  return (
    <>
      <div>
        <ToastContainer />

        <Router>
          <Routes>
            <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path='/user/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
            {/* <Route path='/user/home' element={<Home />} /> */}
            <Route path='/user/subscription' element={<ProtectedRoute><SubscriptionPage/></ProtectedRoute>} />
            <Route path='/user/login' element={<Login />} />
            <Route path='/user/register' element={<Register />} />
            <Route path='/user/verifyOtp' element={<VerifyOtp />} />

            <Route path='/user/forgotPassword' element={<ForgotPassword />} />
            <Route path='/user/otpVerification' element={<OtpVerification />} />

            <Route path='/user/profile' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path='/user/editProfile' element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path='/user/changePassword' element={<ProtectedRoute><UserPasswordChange /></ProtectedRoute>} />
            <Route path='/user/wallet' element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path='/user/allPayments' element={<ProtectedRoute><AllPayments /></ProtectedRoute>} />
            {/* <Route path='/user/purchaseHistory' element={<PurchaseHistory />} /> */}
            <Route path='/user/notifications' element={<ProtectedRoute><UserNotifications /></ProtectedRoute>} />

            <Route path='/user/resetPassword' element={<UserResetPassword />} />

            <Route path='/user/courseDetails/:id' element={<ProtectedRoute><UserCourseDetails /></ProtectedRoute>} />
            <Route path='/user/myCourses' element={<ProtectedRoute><ShowUserMyCourses /></ProtectedRoute>} />
            <Route path='/user/paymentSuccess' element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
            <Route path='/user/paymentFailed' element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />

            <Route path='/user/viewMyCourse/:id' element={<ProtectedRoute><UserViewMyCourse /></ProtectedRoute>} />
            <Route path='/user/allCourses' element={<ProtectedRoute><AllCoursesPage /></ProtectedRoute>} />



            <Route path='/user/eventDetails/:id' element={<ProtectedRoute><UserEventDetails /></ProtectedRoute>} />

            <Route path='/user/chat' element={<ProtectedRoute><UserChat /></ProtectedRoute>} />
            <Route path="/user/chat/:instructorId" element={<ProtectedRoute><UserChat /></ProtectedRoute>} />

            <Route path='/user/favourites' element={<ProtectedRoute><Favourites /></ProtectedRoute>} />

            <Route path='/user/quiz/:courseId' element={<ProtectedRoute><DoQuiz /></ProtectedRoute>} />

            <Route path='/user/joinEvent/:eventId' element={<ProtectedRoute><UserEvent /></ProtectedRoute>} />

            


            {/* Instructor */}
            <Route path='/instructor/login' element={<InstructorLogin />} />
            <Route path='/instructor/register' element={<InstructorRegister />} />
            <Route path='/instructor/verifyOtp' element={<InstVerifyOtp />} />

            <Route path='/instructor/forgotPassword' element={<InstructorForgotPassword />} />
            <Route path='/instructor/otpVerification' element={<OtpVerificationInstructor />} />
            <Route path='/instructor/otpVerify' element={<InstructorVerifyOtp />} />
            <Route path='/instructor/resetPassword' element={<InstructorResetPassword />} />

            <Route path='/instructor/dashboard' element={<InstProtectedRoute><InstructorDashboard /></InstProtectedRoute>} />
            <Route path='/instructor/wallet' element={<InstProtectedRoute><UserWallet /></InstProtectedRoute>} />

            <Route path='/instructor/home' element={<InstProtectedRoute><InstructorHome /></InstProtectedRoute>} />
            <Route path='/instructor/profile' element={<InstProtectedRoute><ProfilePage /></InstProtectedRoute>} />
            <Route path='/instructor/editProfile' element={<InstProtectedRoute><InstructoreditProfilePage /></InstProtectedRoute>} />
            <Route path='/instrcutor/passwordChange' element={<InstProtectedRoute><InstructorPasswordChange /></InstProtectedRoute>} />
            <Route path='/instructor/kyc' element={<KycVerification />} />

            <Route path='/instructor/addCourse' element={<InstProtectedRoute><AddCoursesInstructor /></InstProtectedRoute>} />
            <Route path='/instructor/courseDetails/:id' element={<InstProtectedRoute><InstructorCourseDetails /></InstProtectedRoute>} />
            <Route path='/instructor/editCourse/:id' element={<InstProtectedRoute><InstructorEditCourse /></InstProtectedRoute>} />
            <Route path='/instructor/allCourses' element={<InstProtectedRoute><InstructorAllCoursesPage /></InstProtectedRoute>} />

            <Route path='instructor/purchaseDetails/:id' element={<InstProtectedRoute><CoursePurchaseDetails /></InstProtectedRoute>}></Route>

            <Route path='/instructor/createEvent' element={<InstProtectedRoute><CreateEvents /></InstProtectedRoute>}></Route>
            <Route path='/instructor/editEvent/:id' element={<InstProtectedRoute><InstructorEditEvents /></InstProtectedRoute>}></Route>

            <Route path='/instructor/eventDetails/:eventId' element={<InstProtectedRoute><EventDetailsPage /></InstProtectedRoute>} />

            <Route path='/instructor/joinEvent/:eventId' element={<InstProtectedRoute><InstructorEvent /></InstProtectedRoute>} />

            <Route path='/instructor/allEvents' element={<InstProtectedRoute><AllEventsPage /></InstProtectedRoute>} />


            <Route path='/instructor/addQuiz/:id' element={<InstProtectedRoute><AddQuiz /></InstProtectedRoute>}></Route>
            <Route path='/instructor/quiz/:courseId' element={<InstProtectedRoute><Quiz /></InstProtectedRoute>}></Route>


            <Route path='/instructor/messages' element={<InstProtectedRoute><InstructorChat /></InstProtectedRoute>}></Route>

            <Route path='/instructor/notifications' element={<InstProtectedRoute><InstructorNotifications /></InstProtectedRoute>}></Route>




              // {/* admin  */}
            <Route path='/admin/login' element={<LoginAdmin />} />
            <Route path='/admin/*' element={<AdminProtectedRoute><AdminHome /></AdminProtectedRoute>} />
            <Route path='/admin/viewKyc/:id' element={<AdminProtectedRoute><ViewKyc /></AdminProtectedRoute>} />
            <Route path='/admin/instructors/:id' element={<AdminProtectedRoute><InstructorDetails /></AdminProtectedRoute>} />
            <Route path='/admin/user/:id' element={<AdminProtectedRoute><UserDetails /></AdminProtectedRoute>} />
            <Route path='/admin/courses' element={<AdminProtectedRoute><AdminCourses /></AdminProtectedRoute>} />
            <Route path='/admin/courseDetails/:id' element={<AdminProtectedRoute><AdminCourseDetails /></AdminProtectedRoute>} />
            {/* <Route path='/admin/reports' element={<AdminProtectedRoute><Reports /></AdminProtectedRoute>} /> */}
            {/* <Route path='/admin/purchases' element={<AdminProtectedRoute><PurchasesAdmin /></AdminProtectedRoute>} /> */}






            {/* <Route path="*" element={<NotFound />} /> */}



          </Routes>
        </Router>

      </div>

    </>
  )
}

export default App
