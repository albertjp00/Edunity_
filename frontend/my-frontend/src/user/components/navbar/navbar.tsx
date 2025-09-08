import React, { useState } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import profilePic from './../../../assets/profilePic.png';
import logo from '../../../assets/logo.png';
import api from '../../../api/userApi';
import { logout } from '../../services/authServices';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

const handleLogout = async () => {
  try {
    await logout(); 
    localStorage.removeItem("token"); 
    navigate("/user/login");
  } catch (err) {
    console.error("Logout failed", err);
  }
};

//   const handleSearch = (e) => {
//     if (e.key === 'Enter' && searchTerm.trim()) {
//       navigate(`/user/home?search=${encodeURIComponent(searchTerm)}`);
//     }
//   };

  return (
    <div className="navbar">
      <div className="logo">
        <img  alt="Logo" src={logo}/>
        <p>EDUNITY</p>
      </div>

      

      <div className="profile-section">
      <Link to="/user/favourites" >
      <p className='fav-course'>Favourites</p>
      </Link>
        <Link to="/user/myCourses">
          <p className="add-course">My Courses</p>
        </Link>
        {/* <div className="hamburger" onClick={toggleSidebar}>
          ☰
        </div> */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <Link to="/user/profile">
          <img src={profilePic} alt="Profile" className="profile-img" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
