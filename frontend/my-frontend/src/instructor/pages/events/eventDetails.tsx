// src/pages/EventDetails.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./eventDetails.css";
import instructorApi from "../../../api/instructorApi";

interface IEvent {
  _id: string;
  instructorId: string;
  instructorName: string;
  title: string;
  description: string;
  topic: string;
  date: string;
  time: string;
  duration: number;
  participants: number;
  participantsList: string[];
  isLive: boolean;
  maxParticipants?: number;
  meetingLink?: string;
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const EventDetails: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [instructor, setInstructor] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await instructorApi.get(`/instructor/getEvent/${eventId}`);
        setEvent(result.data.event);
        setInstructor(result.data.event.instructorId);
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
      await instructorApi.patch(`/instructor/joinEvent/${event._id}`, { userId: instructor });
      navigate(`/instructor/joinEvent/${event._id}`);
    } catch (error) {
      console.error(error);
      alert("Unable to join event. Please try again.");
    }
  };

  if (loading) return <p>Loading event...</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div className="event-container">
      <h1 className="event-title">{event.title}</h1>
      <p className="event-host">Hosted by {event.instructorName}</p>

      <div className="event-info">
        <p><strong>Topic:</strong> {event.topic}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Duration:</strong> {event.duration} minutes</p>
        <p><strong>Participants:</strong> {event.participants}/{event.maxParticipants}</p>
      </div>

      <p className="event-description">{event.description}</p>

      {canJoin ? (
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
      )}
    </div>
  );
};

export default EventDetails;
