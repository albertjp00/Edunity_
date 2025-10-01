import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import profilePic from "../../../assets/profilePic.png";
import thumbnail from '../../../assets/webinar_thumnail.png';
import './userEventDetails.css';
import { eventEnroll, getDetailsEvent } from "../../services/eventServices";
import { toast } from "react-toastify";
import type { Ievent } from "../../../instructor/interterfaces/events";
import api from "../../../api/userApi";

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Ievent | null>(null);
  // const [instructor, setInstructor] = useState<string>();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [user , setUser] = useState <string>()

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      const res = await getDetailsEvent(id);
      if (!res) return;

      if (res.data.success) {
        setEvent(res.data.event);
        // setInstructor(res.data.instructor);
        setIsEnrolled(res.data.enrolled);
        console.log(res);
        
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(()=>{
    const getUser = async ()=>{
      const res = await api.get('/user/profile')
      setUser(res.data.data.name)
      
      
    }
    getUser()
  },[])

  // ✅ Check if user can join based on current time
  const canJoin = useMemo(() => {
    if (!event) return false;

    const now = new Date();
    const eventDateTime = new Date(event.date);
    const [hours, minutes] = event.time.split(":").map(Number);
    eventDateTime.setHours(hours, minutes, 0, 0);

    return now >= eventDateTime;
  }, [event]);

  const handleEnroll = async () => {
    try {
      if (!id) return;
      const res = await eventEnroll(id);
      toast.success(res?.data.message || "Enrolled!");
      setIsEnrolled(true);
    } catch (error) {
      console.error("Error enrolling in event:", error);
      toast.error("Failed to enroll. Try again.");
    }
  };

  const handleJoinEvent = () => {
    if (!event) return;
    navigate(`/user/joinEvent/${event._id}`,{
      state:{name : user}    });
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="event-details">
      <div className="event-header">
        <img src={thumbnail} alt="Event Thumbnail" className="event-thumbnail" />
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p>
          📅 {new Date(event.date).toLocaleDateString()} | ⏱ {event.time} mins
        </p>
        <p>🌐 Online Event</p>

        {!isEnrolled ? (
          <button onClick={handleEnroll} className="enroll-btn">
            Enroll Now
          </button>
        ) : canJoin ? (
          <button onClick={handleJoinEvent} className="join-btn">
            Join Event
          </button>
        ) : (
          <p className="text-yellow">
            Event can be joined at {event.time} on {new Date(event.date).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* <div className="instructor-section">
        <h3>Instructor</h3>
        <img
          src={instructor?.profileImage || profilePic}
          alt="Instructor"
          className="instructor-img"
        />
        <p>
          <strong>{instructor?.name}</strong>
        </p>
        <p>{instructor?.bio || "No bio available"}</p>
      </div> */}
    </div>
  );
};

export default EventDetails;
