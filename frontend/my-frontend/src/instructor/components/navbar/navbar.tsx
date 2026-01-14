import { Link, useNavigate } from "react-router-dom";
import profileImage from "../../../assets/profilePic.png";
import "./navbar.css";
import logo from "../../../assets/logo.png";
import notificationImg from '../../../assets/notification.png'
import { useEffect } from "react";
import { socket } from "../../../socket/socket";
import { toast } from "react-toastify";
import { fetchProfile } from "../../services/Instructor/instructorServices";
// import NotificationBell from "../notification/notificationBell";
// import { useEffect, useState } from "react";

const InstructorNavbar = () => {
  const navigate = useNavigate();
  // const [instructor , setInstructor] = useState<string>()

  // const storedInstructor = localStorage.getItem("instructor");
  // const instructor = storedInstructor

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
      <div className="logo">
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

          <p className="logout" onClick={handleLogout}>Logout</p>

          <Link to="/instructor/profile">
            <img src={profileImage} alt="Profile" className="profile-img" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorNavbar;
