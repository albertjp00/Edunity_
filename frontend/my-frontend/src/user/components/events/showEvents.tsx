// components/Events.tsx
import React, { useEffect, useState } from "react";
import { getEvents } from "../../services/eventServices";
import type { Event } from "../../interfaces";
import thumbnail from '../../../assets/webinar_thumnail.png'
import './showEvents.css'

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const response = await getEvents();
    if (response?.data.success) {
      setEvents(response.data.events);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="events-container">
      <h2 className="events-title">Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt={event.title}
                  className="event-thumbnail"
                />
              )}
              <div className="event-details">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>
                  By <b>{event.instructorName}</b> on{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p>Duration: 1 Hour</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
