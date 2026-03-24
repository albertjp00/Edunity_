import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import notification from '../../../assets/notification.png'
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
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 transition-transform hover:scale-105">
          <Link to='/user/home' className="flex items-center gap-2">
            <img alt="Logo" src={logo} className="h-9 w-auto" />
            <p className="text-xl font-black tracking-tighter text-slate-900 uppercase">EDUNITY</p>
          </Link>
        </div>

        {/* PROFILE SECTION & NAV LINKS */}
        <div className={`flex items-center gap-8 ${menuOpen ? "flex-col absolute top-full left-0 w-full bg-white p-6 shadow-xl border-t border-slate-100" : "hidden md:flex"}`}>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Link to="/user/subscription" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Subscription</Link>
            <Link to="/user/favourites" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Favourites</Link>
            <Link to="/user/myCourses" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">My Courses</Link>
            <Link to="/user/chat" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Messages</Link>
          </div>

          <div className="flex items-center gap-5 border-l border-slate-200 pl-6">
            {/* NOTIFICATION */}
            <div className="relative cursor-pointer group" onClick={gotoNotifications}>
              <img src={notification} alt="Notifications" className="h-6 w-6 bg-black  opacity-60 group-hover:opacity-100 transition-opacity" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                </span>
              )}
            </div>

            {/* LOGOUT BUTTON */}
            <button 
              className="text-xs font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors" 
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </button>

            {/* PROFILE IMAGE */}
            <Link to="/user/profile" className="shrink-0">
              <img 
                src={`${import.meta.env.VITE_API_URL}/assets/${user?.profileImage}`} 
                alt="Profile" 
                className="h-10 w-10 rounded-full object-cover ring-2 ring-transparent hover:ring-indigo-500 transition-all shadow-sm" 
              />
            </Link>
          </div>
        </div>

        {/* MOBILE HAMBURGER */}
        <div className="md:hidden text-2xl cursor-pointer p-2 text-slate-600" onClick={toggleMenu}>
          {menuOpen ? "✕" : "☰"}
        </div>

        {/* LOGOUT MODAL */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" 
              onClick={() => setShowLogoutModal(false)}
            />
            <div className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  👋
                </div>
                <h3 className="text-xl font-black text-slate-900">Confirm Logout</h3>
                <p className="text-slate-500 mt-2">Are you sure you want to logout? We'll miss you!</p>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all" 
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-slate-200" 
                  onClick={() => {
                    setShowLogoutModal(false); 
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
