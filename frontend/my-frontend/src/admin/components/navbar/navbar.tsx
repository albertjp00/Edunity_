import React  from 'react'
import './navbar.css'
import { useNavigate } from 'react-router-dom'

interface AdminNavbarProps {
  toggleSidebar: () => void
}

const AdminNavbar = ({ }) => {
  const navigate = useNavigate()
  const profileImage: string = ''

  const handleLogout = () => {
    localStorage.removeItem('admin')
    navigate('/admin/login')
  }

  return (
    <div className="navbar">
      <div className="logo">
        <p>ADMIN</p>
      </div>

      <div className="profile-section">
        {/* <div className="hamburger" onClick={toggleSidebar}>
          ☰
        </div> */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        {/* <img src={profileImage} alt="Profile" className="profile-img" /> */}
      </div>
    </div>
  )
}

export default AdminNavbar
