import React, { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instructorApi from "../../../api/instructorApi";
import "./editEvents.css";
import type { Ievent } from "../../interterfaces/events";
import { toast } from "react-toastify";

const EditEvents: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Ievent | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  // Fetch event details by ID
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await instructorApi.get(`/instructor/getEvent/${id}`);
        console.log(result);
        
        // 👇 check if backend sends {event: {...}}
        const eventData = result.data.event 

        setEvent(eventData);
        setTitle(eventData.title || "");
        setDescription(eventData.description || "");
        setDate(eventData.date ? eventData.date.split("T")[0] : "");
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      date,
    };

    try {
      await instructorApi.put(`/instructor/updateEvent/${id}`, formData);
      toast.success('event updated')
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="edit-event-container">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit} className="edit-event-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-save">
          Update Event
        </button>
      </form>
    </div>
  );
};

export default EditEvents;
