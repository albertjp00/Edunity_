import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import notificationImg from '../../../assets/notification.png'
import { useEffect, useState } from 'react';
import { fetchNotifications } from '../../services/profileServices';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../redux/hooks';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../../../redux/slices/authSlice';
import { logout } from '../../services/authServices';
import { socket } from '../../../socket/socket';
// import { getSubscriptionPlan } from '../../services/courseServices';
// import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
// import { logoutSuccess } from '../../../redux/slices/authSlice';

const Navbar = () => {

  // const userData = useAppSelector((state)=>state.auth.user)
  // const dispatch = useAppDispatch()

  const navigate = useNavigate();

  const [hasUnread, setUnread] = useState<boolean>()

  const user = useAppSelector((state) => state.auth.user);
  
  const dispatch = useDispatch()

  const [menuOpen, setMenuOpen] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // const [subscription , setSubscription] = useState(false)

  const toggleMenu = () => setMenuOpen(prev => !prev);
  



  const handleLogout = async () => {
    try {
      await logout();
      // localStorage.removeItem("token");
      dispatch(logoutSuccess())
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
      const res = await fetchNotifications(1)
      if (!res) return

      const notifications = res.data.notifications
      const unreadExists = notifications.some((n: { isRead: boolean }) => !n.isRead);
      setUnread(unreadExists);

    }
    getNotifications()
  }, [])

  // useEffect(()=>{
  //   const checkSubscription = async ()=>{
  //     const subscription = await getSubscriptionPlan()
  //     if(!subscription) return
  //   if(subscription.data.subscription){
  //     setSubscription(true)
  //   }
  //   }

  //   checkSubscription()
  // },[])




  useEffect(() => {
    if (user?.id) {
      socket.emit("joinPersonalRoom", { userId: user?.id });
    }
  }, [user?.id]);




  useEffect(() => {
    console.log('notification for message', user);

    const handleNotification = () => {

      if(location.pathname.startsWith('/user/chat')) return

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

      <div className={`profile-section ${menuOpen ? "open" : ""}`}>
        <div className="notification-img" onClick={gotoNotifications}>
          <img src={notificationImg} alt="Notifications" className="noti-img" />
          {hasUnread && <span className="notification-dot"></span>}
        </div>


        <Link to="/user/subscription"><p>Subscription</p></Link>
        <Link to="/user/favourites"><p>Favourites</p></Link>
        <Link to="/user/myCourses"><p>My Courses</p></Link>
        <Link to="/user/chat"><p>Messages</p></Link>

        <button className="logout-btn" onClick={()=>setShowLogoutModal(true)}>Logout</button>

        <Link to="/user/profile">
          <img src={`${import.meta.env.VITE_API_URL}/assets/${user?.profileImage}`} alt="Profile" className="profile-img" />
        </Link>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      {showLogoutModal &&
      <div className="logout-modal-overlay">
        <div className="logout-modal">
          <h3>Confirm Logout</h3>
          <p>Are you sure you want to logout?</p>

          <div className="logout-actions">
            <div className="cancel-btn" onClick={()=>setShowLogoutModal(false)}>
              Cancel
            </div>

            <button className='confirm-btn' onClick={()=> {
              setShowLogoutModal(false); 
              handleLogout();
              }}>
              
              logout
            </button>

          </div>
        </div>
      </div>
      }
      
          

    </div>
            

  );
};

export default Navbar;
