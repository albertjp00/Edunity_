import  { useState } from "react";
import { addEvent } from "../../services/instructorServices";
import type { Ievent } from "../../interterfaces/events";
import "./createEvents.css";
import { toast } from "react-toastify";

const EventForm: React.FC = () => {
  const [formData, setFormData] = useState<Ievent>({
    title: "",
    topic: "",
    description: "",
    date: "",
    time: '',
    isLive : false
    
  });

  const [errors, setErrors] = useState<Partial<Ievent>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };


  const validate = (): boolean => {
    const newErrors: Partial<Ievent> = {};

    if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long.";
    }
    if (formData.title.trim().length > 10) {
      newErrors.title = "Title characters is long.";
    }
    if (formData.topic.trim().length < 3) {
      newErrors.topic = "Topic must be at least 3 characters long.";
    }
    if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }
    if (!formData.date) {
      newErrors.date = "Please select a date.";
    } else if (new Date(formData.date) < new Date()) {
      newErrors.date = "Date must be in the future.";
    }

    if (!formData.time) {
      newErrors.time = "Please select a time.";
    }

    // if (!formData.ampm) {
    //   newErrors.ampm = "Please select AM or PM.";
    // }



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;


    const payload = {
      ...formData,
      // time: `${formData.time} ${formData.ampm.toUpperCase()}`
    };



    const res = await addEvent(payload);
    if (!res) return
    if (res.data.success) {
      toast.success("Event Created")
      setFormData({ title: "", topic: "", description: "", date: "", time: '' , isLive : false});
      setErrors({});
    }
  };

  return (
    
    <div className="event-card">
      <h2 className="form-title">📅 Create New Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Topic</label>
          <input
            type="text"
            name="topic"
            placeholder="Event Topic"
            value={formData.topic}
            onChange={handleChange}
          />
          {errors.topic && <span className="error">{errors.topic}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <span className="error">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>
        <div className="form-group-time">
          <label>Time</label>

          <div className="time-wrapper">
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />

            {/* <select
              name="ampm"
              value={formData.ampm}
              onChange={handleChange}
            >
              <option value="">--</option>
              <option value="am">AM</option>
              <option value="pm">PM</option>
            </select> */}

          </div>

          {/* {errors.ampm && <span className="error">{errors.ampm}</span>} */}

        </div>



        <button type="submit">➕ Add Event</button>
      </form>
    </div>
  );
};

export default EventForm;
