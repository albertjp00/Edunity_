import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import profilePic from './../../../assets/profilePic.png';
import logo from '../../../assets/logo.png';
import notificationImg from '../../../assets/notification.png'
import { useEffect, useState } from 'react';
import { fetchNotifications} from '../../services/profileServices';
import { toast } from 'react-toastify';
import { socket } from '../../../socket/socket';
import { useAuth } from '../../../context/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  // const [searchTerm, setSearchTerm] = useState('');
  const [hasUnread, setUnread] = useState<boolean>()

  const { user , userLogout } = useAuth();

  const handleLogout = async () => {
    try {
      await userLogout();
      // localStorage.removeItem("token");
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
      const res = await fetchNotifications()
      if (!res) return

      const notifications = res.data.notifications
      const unreadExists = notifications.some((n: { isRead: boolean }) => !n.isRead);
      setUnread(unreadExists);

    }
    getNotifications()
  }, [])

 

//   useEffect(() => {
//   const joinRoom = async () => {
//     const res = await getUserProfile();
//     if (!res) return;

//     const userId = res.data.data.id; 
//     // console.log('profile data',res , userId);

//     if (userId) {
//       socket.emit("joinPersonalRoom", { userId });
//     }
//   };

//   joinRoom();
// }, []);


  useEffect(() => {
    if (user?.id) {
      socket.emit("joinPersonalRoom", { userId: user.id });
    }
  }, [user?.id]);




  useEffect(() => {
    console.log('notification for message');
    
    const handleNotification =  () => {
      toast.info("📩 New message received");

      // turn on red dot / badge
      // setUnread(true);
    };

    socket.on("messageNotification", handleNotification);

    return () => {
      socket.off("messageNotification", handleNotification);
    };
  }, []);




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
