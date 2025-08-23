import React, { useState } from "react";
import { addEvent } from "../../../services/Instructor/instructorServices";
import type { Ievent } from "../../interterfaces/events";
import './createEvents.css'



const EventForm: React.FC = () => {
  const [formData, setFormData] = useState<Ievent>({
    title: "",
    description: "",
    date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent(formData);
    setFormData({ title: "", description: "", date: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
  <input
    type="text"
    name="title"
    placeholder="Event Title"
    value={formData.title}
    onChange={handleChange}
    required
  />
  <textarea
    name="description"
    placeholder="Event Description"
    value={formData.description}
    onChange={handleChange}
    required
  />
  <input
    type="date"
    name="date"
    value={formData.date}
    onChange={handleChange}
    required
  />
  <button type="submit">Add Event</button>
</form>

  );
};

export default EventForm;
