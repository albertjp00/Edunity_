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
    <div className="navbar">
      <div className="logo" onClick={()=>navigate('/instructor/home')}>
        <img src={logo} alt="logo" />
        <p>EDUNITY</p>
      </div>
      <div className="profile-section">
        <div className="nav-right">
          {/* ✅ 2. Pass instructor._id to NotificationBell */}
          {/* {instructor && (
            <div className="flex items-center gap-4">
              <NotificationBell userId={instructor} />
            </div>
          )} */}


          <div className="notification-img" onClick={gotoNotifications}>
            <img src={notificationImg} alt="" className="noti-img" />
          </div>
          <p className="add-course" onClick={addCourse}>Create Course</p>
          <p className="add-course" onClick={addEvent}>Create Event</p>

          <div className="messages-icon" onClick={goToMessages} title="Messages">
            <p>Messages</p>
          </div>

          <p className="logout" onClick={()=>setShowLogoutModal(true)}>Logout</p>

          <Link to="/instructor/profile">
            <img src={`${import.meta.env.VITE_API_URL}/assets/${user?.profileImage}`} alt="Profile" className={"profile-img"} />
          </Link>
        </div>
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

export default InstructorNavbar;
