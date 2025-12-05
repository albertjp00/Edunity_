import React, { useState, useEffect } from "react";
import { getMyEventsHomePage } from "../../services/Instructor/instructorServices";
import type { Ievent } from "../../interterfaces/events";
import './myEvents.css'
import webinarImage from '../../../assets/webinar_thumnail.png'
import { useNavigate } from "react-router-dom";

const InstructorEventList: React.FC = () => {
  const [events, setEvents] = useState<Ievent[]>([]);

  const navigate = useNavigate()

  const fetchEvents = async () => {
      try {
        const result = await getMyEventsHomePage();
        if(!result) return;
        console.log(result.data);
        setEvents(result.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    const gotoEdit = (id:string)=>{
      navigate(`/instructor/editEvent/${id}`)
    }

    const EventDetails = (id:string )=>{
      navigate(`/instructor/eventDetails/${id}`)
    }


    const allEvents = ()=>{
      navigate('/instructor/allEvents')
    }

  useEffect(() => {
    fetchEvents();
  }, []);

return (
  
  <div className="my-events-container">
    <div className="events-banner">
  <h1>MY EVENTS</h1>
  
</div>
<div className="courses-header">
          <div className="left-section">
            <span className="provides-label">PROVIDES</span>
            <h2>Events</h2>
          </div>

          <button className="create-course-btn" onClick={allEvents}>
            Show all Events
          </button>
        </div>

  {/* <h2>Your Events</h2> */}
  {events.length === 0 ? (
    <p>No events available</p>
  ) : (
    <div className="events-grid">
      {events.map((event) => (
        <div key={event.id} className="event-tile">
          <div className="tile-image-wrapper">
            <img src={webinarImage} alt={event.title} className="tile-thumbnail" />
            <span className="tile-instructor">{event.instructorName}</span>
            <span className="tile-edit" onClick={() => gotoEdit(event.id!)}>Edit</span>
          </div>

          <div className="tile-content" onClick={() => EventDetails(event.id!)}>
            <h3 className="tile-title">{event.title}</h3>
            <p className="tile-desc">{event.description}</p>
            <span className="tile-date">{new Date(event.date).toDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

);


};

export default InstructorEventList;
