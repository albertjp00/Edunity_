// src/pages/EventDetails.tsx
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./eventDetails.css";
import eventImage from '../../../assets/webinar_thumnail.png'
import { toast } from "react-toastify";
import { eventEnd, eventJoin, getEvent } from "../../services/eventsServices";
import type { IEvent } from "../../interterfaces/instructorInterfaces";



const EventDetails: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [instructor, setInstructor] = useState<string | null>(null);
  const [instructorName, setInstructorName] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if(!eventId) return
        const result = await getEvent(eventId)
        console.log('event',result);

        setEvent(result.data.event);
        setInstructor(result.data.event.instructorId);
        setInstructorName(result.data.event.instructorName)
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const canJoin = useMemo(() => {
    if (!event) return false;

    const now = new Date();
    const eventDateTime = new Date(event.date);
    const [hours, minutes] = event.time.split(":").map(Number);
    eventDateTime.setHours(hours, minutes, 0, 0);

    return now >= eventDateTime;
  }, [event]);

  const handleJoin = async () => {
    if (!event || !instructor) return;
    try {
      const res = await eventJoin(event.id)
      console.log(res);
      
      navigate(`/instructor/joinEvent/${event.id}`, {
        state: { instructorName }
      });
    } catch (error) {
      console.error(error);
      toast.error("Unable to join event. Please try again.")
    }
  };


  const endEvent = async () => {
    try {
      if (!eventId) return
      const res = await eventEnd(eventId)

      if (res?.data?.success) {
        toast.success("Event ended successfully");

        // Optional UI update
        setEvent((prev) =>
          prev ? { ...prev, isLive: false, isOver: true } : prev
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to end event");
    }
  };


  if (loading) return <p>Loading event...</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div className="event-container">
      <div className="event-image">
        <img src={eventImage} alt="" />
      </div>

      <div className="event-details">
        <h1 className="event-title">{event.title}</h1>
        <p className="event-host">Hosted by {event.instructorName}</p>

        <div className="event-info">
          <p><strong>Topic:</strong> {event.topic}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Duration:</strong> {event.duration || 2}  Hour</p>
          <p><strong>Participants:</strong> {event.participants}</p>
        </div>

        <p className="event-description">{event.description}</p>

        {!event.isOver ? (
          canJoin ? (
            event.isLive ? (
              event.participants < (event.maxParticipants || Infinity) ? (
                <button onClick={handleJoin} className="join-btn">
                  Join Event
                </button>
              ) : (
                <p className="text-red">This event is full.</p>
              )
            ) : (
              <button onClick={handleJoin} className="join-btn">
                Start Event
              </button>
            )
          ) : (
            <p className="text-yellow">
              Event can only be joined at {event.time} on{" "}
              {new Date(event.date).toLocaleDateString()}.
            </p>
          )
        ) : (
          <p className="text-red">
            ❌ This event has ended.
          </p>
        )}


        {event.isLive && !event.isOver && (
          <button className="end-btn" onClick={endEvent}>
            End Event
          </button>
        )}

      </div>
    </div>

  );
};

export default EventDetails;
