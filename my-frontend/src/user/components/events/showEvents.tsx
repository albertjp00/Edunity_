import { useEffect, useState } from "react";
import { getEvents, getMyEvents } from "../../services/eventServices";
import type { MyEvent, UEvent } from "../../interfaces";
import thumbnail from "../../../assets/webinar_thumnail.png";
import "./showEvents.css";
import { useNavigate } from "react-router-dom";

const Events: React.FC = () => {
  const [events, setEvents] = useState<UEvent[]>([]);
  const [myRegisteredEvents, setMyRegisteredEvents] = useState<string[]>([]); // store registered eventIds
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

const fetchMyEvents = async () => {
  try {
    const res = await getMyEvents()
    if(!res) return
    const registeredIds = res.data.events.map((e: MyEvent) => e.eventId);
    setMyRegisteredEvents(registeredIds);
  } catch (error) {
    console.log(error);
  }
};

  const gotoDetails = (id: string) => {
    navigate(`/user/eventDetails/${id}`);
  };

  const getEventStatus = (event: UEvent) => {
    const eventDate = new Date(event.date);
    const [hours, minutes] = event.time.split(":").map(Number);
    eventDate.setHours(hours, minutes, 0, 0);
    const startTime = eventDate;
    const endTime = new Date(startTime.getTime() + event.duration * 60000);
    const now = new Date();

    if (event.isLive && now >= startTime && now <= endTime) return "LIVE";
    if (now > endTime) return "OVER";
    return "UPCOMING";
  };

  useEffect(() => {
    fetchEvents();
    fetchMyEvents();
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
            const month = eventDate.toLocaleString("default", { month: "long" });
            const status = getEventStatus(event);
            const isRegistered = myRegisteredEvents.includes(event._id); // check if registered

            return (
              <article key={event._id} className="event-card">
                <div className="event-image-wrapper">
                  <img src={thumbnail} alt={event.title} className="event-thumbnail" />
                  <div className="event-date-badge">
                    <span className="event-day">{day}</span>
                    <span className="event-month">{month}</span>
                  </div>
                  <div
                    className={`event-status ${
                      status === "LIVE" ? "live" : status === "OVER" ? "over" : "upcoming"
                    }`}
                  >
                    {status}
                  </div>
                </div>

                <div className="event-info">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description ?? "No description provided."}</p>
                  <div className="event-meta">
                    <p>⏰ Time: {event.time}</p>
                    <p>
                      📆 Date:{" "}
                      {eventDate.toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Dynamic Button / Registered */}
                  {isRegistered ? (
                    <button className="event-registered-btn" onClick={() => gotoDetails(event._id)}>
                      Details
                    </button>
                  ) : status === "UPCOMING" ? (
                    <button className="event-register-btn" onClick={() => gotoDetails(event._id)}>
                      Register
                    </button>
                  ) : status === "LIVE" ? (
                    <button className="event-register-btn live-join" onClick={() => gotoDetails(event._id)}>
                      LIVE
                    </button>
                  ) : null /* OVER: no button */}
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
