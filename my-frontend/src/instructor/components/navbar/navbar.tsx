import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import logo from "../../../assets/logo.png";
import notificationImg from '../../../assets/notification.png'
import { useEffect, useState } from "react";
import { socket } from "../../../socket/socket";
import { toast } from "react-toastify";
import { fetchProfile } from "../../services/instructorServices";
import { logoutSuccess } from "../../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../redux/hooks";
// import NotificationBell from "../notification/notificationBell";
// import { useEffect, useState } from "react";

const InstructorNavbar = () => {
  const navigate = useNavigate();
  // const [instructor , setInstructor] = useState<string>()

  // const storedInstructor = localStorage.getItem("instructor");
  // const instructor = storedInstructor

  const dispatch = useDispatch()

  const user = useAppSelector((state)=>state.auth.user)

    const [showLogoutModal, setShowLogoutModal] = useState(false);
  

  const gotoNotifications = () => {
    navigate('/instructor/notifications')
  }

  // useEffect(()=>{
  //   const instructorData = async  ()=>{
  //   try {
  //     const res = await instructorApi.get('/instructor/profile')
  //     // console.log(res);
  //     setInstructor(res.data.data._id)
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }
  // instructorData()
  // },[])

  const handleLogout = () => {
    localStorage.removeItem("instructor");
    dispatch(logoutSuccess())
    navigate("/instructor/login");
  };



  const addCourse = () => navigate("/instructor/addCourse");
  const addEvent = () => navigate("/instructor/createEvent");
  const goToMessages = () => navigate("/instructor/messages");

  
    useEffect(() => {
    const joinRoom = async () => {
      const res = await fetchProfile();
      if (!res) return;
  
      const userId = res.data.data._id; 
  
      if (userId) {
        socket.emit("joinPersonalRoom", { userId });
      }
    };
  
    joinRoom();
  }, []);
  
  
  
  
    useEffect(() => {
      console.log('notification for message');
      
      const handleNotification =  () => {

        if(location.pathname.startsWith('/instructor/messages')) return

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
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      
      {/* LEFT: Logo Section */}
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
        onClick={() => navigate('/instructor/home')}
      >
        <div className="w-10 h-10  rounded-xl flex items-center justify-center">
          <img src={logo} alt="logo" className="w-6 h-6" />
        </div>
        <p className="text-xl font-black tracking-tighter text-slate-900">EDUNITY</p>
      </div>

      {/* RIGHT: Navigation Items */}
      <div className="flex items-center gap-6">
        
        {/* Action Buttons Group */}
        <div className="hidden md:flex items-center gap-3 border-r border-slate-200 pr-6 mr-2">
          <button 
            onClick={addCourse}
            className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-100 transition-colors"
          >
            + Course
          </button>
          <button 
            onClick={addEvent}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors"
          >
            + Event
          </button>
        </div>

        {/* Icons Group */}
        <div className="flex items-center gap-5">
          {/* Messages */}
          <button 
  onClick={goToMessages} 
  className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 transition-all group"
  title="Messages"
>
  <span className="text-sm font-black uppercase tracking-widest ">
    Messages
  </span>
  
  
</button>

          {/* Notifications */}
          <button 
            onClick={gotoNotifications}
            className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <img src={notificationImg} alt="Notifications" className="w-6 h-6 grayscale hover:grayscale-0 transition-all" />
          </button>

          {/* Profile & Logout Group */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Logout
            </button>
            <Link to="/instructor/profile" className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
              <img 
                src={`${import.meta.env.VITE_API_URL}/assets/${user?.profileImage}`} 
                alt="Profile" 
                className="relative w-10 h-10 rounded-full object-cover border-2 border-white bg-slate-100 shadow-sm" 
              />
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* LOGOUT MODAL: Glassmorphism Overlay */}
    {showLogoutModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"></div>
        <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
            🚪
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Confirm Logout</h3>
            <p className="text-slate-500 mt-2 font-medium">Are you sure you want to end your current session?</p>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95" 
              onClick={() => { setShowLogoutModal(false); handleLogout(); }}
            >
              Log me out
            </button>
            <button 
              className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all" 
              onClick={() => setShowLogoutModal(false)}
            >
              Stay Logged In
            </button>
          </div>
        </div>
      </div>
    )}
  </nav>
);
};

export default InstructorNavbar;
