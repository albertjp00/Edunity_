import React, { useState, useEffect } from "react";
import { getMyEvents } from "../../../services/Instructor/instructorServices";
import type { Ievent } from "../../interterfaces/events";
import './myEvents.css'
import webinarImage from '../../../assets/webinar_thumnail.png'

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Ievent[]>([]);


  const fetchEvents = async () => {
      try {
        const result:any = await getMyEvents();
        console.log(result.data);
        setEvents(result.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }



  useEffect(() => {
    fetchEvents();
  }, []);

return (
  <div className="events-container">
    <h2>Your Events</h2>
    {events.length === 0 ? (
      <p>No events available</p>
    ) : (
      <div className="event-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            {event && (
              <div className="event-image-container">
                <img
                  src={webinarImage}
                  alt={event.title}
                  className="event-thumbnail"
                />
                <span className="event-instructor">{event.instructorName}</span>
              </div>
            )}

            {/* Event Details */}
            <div className="event-details">
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <span className="event-date">
                {new Date(event.date).toDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);


};

export default EventList;
