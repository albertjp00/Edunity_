import React, { useEffect, useState } from "react";
import { getEvents } from "../../services/eventServices";
import type { UEvent } from "../../interfaces";
import thumbnail from "../../../assets/webinar_thumnail.png";
import "./showEvents.css";
import { useNavigate } from "react-router-dom";

const Events: React.FC = () => {
  const [events, setEvents] = useState<UEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      if (response?.data.success) {
        setEvents(response.data.events);
      }
    } finally {
      setLoading(false);
    }
  };

  const gotoDetails = (id:string  )=>{
    navigate(`/user/eventDetails/${id}`)
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <section className="events-wrapper">
      <p className="events-subtitle">📅 Our Events</p>
      <h2 className="events-heading">Yearly Events And Program</h2>

      {loading ? (
        <p className="events-loading">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="events-empty">No upcoming events found.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => {
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleString("default", {
              month: "long",
            });

            return (
              <article key={event._id} className="event-card">
                <div className="event-image-wrapper">
                  <img
                    src={thumbnail}
                    alt={event.title}
                    className="event-thumbnail"
                  />
                  <div className="event-date-badge">
                    <span className="event-day">{day}</span>
                    <span className="event-month">{month}</span>
                  </div>
                </div>

                <div className="event-info">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">
                    {event.description ?? "No description provided."}
                  </p>

                  <div className="event-meta">
                    <p>⏰ Time: 11:00am - 03:00pm</p>
                    <p>
                      📆 Date:{" "}
                      {eventDate.toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <button className="event-register-btn" onClick={()=>gotoDetails(event._id)}>Register</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Events;
