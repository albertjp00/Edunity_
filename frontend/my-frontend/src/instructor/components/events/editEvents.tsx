import React, { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./editEvents.css";
import type { Ievent } from "../../interterfaces/events";
import { getEditEvent, updateEvent } from "../../services/eventsServices";

const EditEvents: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Ievent | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    date: "",
  });

  const [errors, setErrors] = useState<{ title?: string; description?: string; date?: string }>({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await getEditEvent(id!);
        if (!result) return;

        const eventData = result.data.event;

        setEvent(eventData);
        setTitle(eventData.title || "");
        setDescription(eventData.description || "");
        setDate(eventData.date ? eventData.date.split("T")[0] : "");

        setInitialValues({
          title: eventData.title || "",
          description: eventData.description || "",
          date: eventData.date ? eventData.date.split("T")[0] : "",
        });
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [id]);

  const validateForm = () => {
    const newErrors: { title?: string; description?: string; date?: string } = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";

    if (!date) {
      newErrors.date = "Date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date);

      if (selectedDate < today) {
        newErrors.date = "Event date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = { title, description, date };

    try {
      await updateEvent(id!, formData);
      toast.success("Event updated");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };

  const isChanged =
    title !== initialValues.title ||
    description !== initialValues.description ||
    date !== initialValues.date;

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
            
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>

        <button type="submit" className="btn-save" disabled={!isChanged}>
          Update Event
        </button>
      </form>
    </div>
  );
};

export default EditEvents;
