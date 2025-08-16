import { Link, useNavigate } from 'react-router-dom'
import profileImage from '../../../assets/profilePic.png'
import './navbar.css'
import logo from '../../../assets/logo.png'
import instructorApi from '../../../api/instructorApi'




const InstructorNavbar = () => {

  const navigate = useNavigate()

  const handleLogout = async () => {
      localStorage.removeItem('instructor')
      navigate('/instructor/login')
    
  }

  const addCourse = () => {
    navigate('/instructor/addCourse')
  }


  return (
    <div className='navbar'>
      <div className='logo'>
        <img src={logo} alt="" />
        <p>EDUNITY</p>
      </div>

      <div className='profile-section'>
        {/* <div className='hamburger' onClick={toggleSidebar}>
          ☰
        </div> */}


        <div className="nav-right">

          <p className='add-course' onClick={addCourse}>Create Course</p>


          <p className='logout' onClick={handleLogout}>Logout</p>
          <Link to='/instructor/profile'>
            <img src={profileImage} alt='Profile' className='profile-img' />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default InstructorNavbar
