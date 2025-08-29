import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import profilePic from "../../../assets/profilePic.png";
import api from "../../../api/userApi";
import type { UEvent, UInstructor } from "../../interfaces";
import thumbnail from '../../../assets/webinar_thumnail.png'
import './userEventDetails.css'
import { eventEnroll, getDetailsEvent } from "../../services/eventServices";
import { toast } from "react-toastify";


const EventDetails: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<UEvent | null>(null);
  const [instructor, setInstructor] = useState<UInstructor | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      const res = await getDetailsEvent(id);
      if (!res) return;

      if (res.data.success) {
        console.log(res.data);
        
        setEvent(res.data.event);
        setInstructor(res.data.instructor);
        setIsEnrolled(res.data.enrolled); 
      }
    };
    fetchEvent();
  }, [id]);

  const handleEnroll = async () => {
    try {
      if (!id) return;
      const res = await eventEnroll(id);
      toast.success(res?.data.message || "Enrolled!");
      setIsEnrolled(true); // update state
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Already enrolled");
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="event-details">
      <div className="event-header">
        <img src={thumbnail} alt="Event Thumbnail" className="event-thumbnail" />
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p>
          📅 {new Date(event.date).toLocaleDateString()} | ⏱ {event.duration} mins
        </p>
        <p>🌐 Online Event</p>
        {!isEnrolled ? (
          <button onClick={handleEnroll} className="enroll-btn">
            Enroll Now
          </button>
        ) : (
          <button className="enroll-btn" disabled>
            ✅ Already Enrolled
          </button>
        )}
      </div>

      <div className="instructor-section">
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
      </div>
    </div>
  );
};

export default EventDetails;
