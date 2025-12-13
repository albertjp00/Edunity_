import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import profilePic from './../../../assets/profilePic.png';
import logo from '../../../assets/logo.png';
import { logout } from '../../services/authServices';
import notificationImg from '../../../assets/notification.png'
import api from '../../../api/userApi';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  // const [searchTerm, setSearchTerm] = useState('');
  const [hasUnread, setUnread] = useState<boolean>()

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      navigate("/user/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const gotoNotifications = () => {
    navigate('/user/notifications')
  }

  useEffect(() => {
    
    const getNotifications = async () => {
      const res = await api.get('/user/notifications')
      console.log(res);
      
      const notifications = res.data.notifications
      const unreadExists = notifications.some((n: { isRead: boolean }) => !n.isRead);
      setUnread(unreadExists);

    }
    getNotifications()
  }, [])

  //   const handleSearch = (e) => {
  //     if (e.key === 'Enter' && searchTerm.trim()) {
  //       navigate(`/user/home?search=${encodeURIComponent(searchTerm)}`);
  //     }
  //   };

  return (
    <div className="navbar">
      <div className="logo">
        <img alt="Logo" src={logo} />
        <p>EDUNITY</p>
      </div>



      <div className="profile-section">
        <div className="notification-img" onClick={gotoNotifications}>
          <img src={notificationImg} alt="Notifications" className="noti-img" />
          {hasUnread && <span className="notification-dot"></span>}
        </div>

        <Link to='/user/subscription'>
          <p className='fav-course'>Subscription</p>
        </Link>
        <Link to="/user/favourites" >
          <p className='fav-course'>Favourites</p>
        </Link>
        <Link to="/user/myCourses">
          <p className="add-course">My Courses</p>
        </Link>
        <Link to='/user/chat'>
          <p className='add-course'>Messages</p>
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
