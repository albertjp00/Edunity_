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
  const [topic, setTopic] = useState(""); // ✅ New field
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [initialValues, setInitialValues] = useState({
    title: "",
    topic: "", // ✅ New field
    description: "",
    date: "",
  });

  const [errors, setErrors] = useState<{
    title?: string;
    topic?: string; // ✅ New field
    description?: string;
    date?: string;
  }>({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await getEditEvent(id!);
        if (!result) return;

        const eventData = result.data.event;

        setEvent(eventData);
        setTitle(eventData.title || "");
        setTopic(eventData.topic || ""); // ✅ New field
        setDescription(eventData.description || "");
        setDate(eventData.date ? eventData.date.split("T")[0] : "");

        setInitialValues({
          title: eventData.title || "",
          topic: eventData.topic || "", // ✅ New field
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
    const newErrors: { title?: string; topic?: string; description?: string; date?: string } = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!topic.trim()) newErrors.topic = "Topic is required"; // ✅ Validation
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

    const formData = { title, topic, description, date }; // ✅ Added topic

    try {
      await updateEvent(id!, formData);
      toast.success("Event updated successfully");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };

  const isChanged =
    title !== initialValues.title ||
    topic !== initialValues.topic || // ✅ Check topic change
    description !== initialValues.description ||
    date !== initialValues.date;

  if (!event) return <p className="loading">Loading event...</p>;

  return (
    <div className="edit-event-container">
      <div className="edit-event-card">
        <h2>Edit Event</h2>
        <form onSubmit={handleSubmit} className="edit-event-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter event topic"
            />
            {errors.topic && <span className="error">{errors.topic}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description..."
            />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
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

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/events")}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={!isChanged}>
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvents;
