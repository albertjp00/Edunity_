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
    isLive : false,
    roomId : ""
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
      setFormData({ title: "", topic: "", description: "", date: "", time: '' , isLive : false , roomId : ''});
      setErrors({});
    }
  };

  return (
  <div className="min-h-screen bg-slate-50 py-12 px-4 flex justify-center items-center">
    <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-slate-900 p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
          <span className="text-2xl">📅</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Create New Event</h2>
        <p className="text-slate-400 text-sm mt-1">Schedule a live session or webinar for your students</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        
        {/* Title Field */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Event Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Advanced System Design Workshop"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
              errors.title ? "border-red-500" : "border-slate-200 focus:border-blue-500"
            }`}
          />
          {errors.title && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.title}</p>}
        </div>

        {/* Topic Field */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Topic</label>
          <input
            type="text"
            name="topic"
            placeholder="e.g. Backend Architecture"
            value={formData.topic}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
              errors.topic ? "border-red-500" : "border-slate-200 focus:border-blue-500"
            }`}
          />
          {errors.topic && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.topic}</p>}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
          <textarea
            name="description"
            placeholder="What should attendees prepare for?"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
              errors.description ? "border-red-500" : "border-slate-200 focus:border-blue-500"
            }`}
          />
          {errors.description && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.description}</p>}
        </div>

        {/* Date and Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all focus:border-blue-500 ${
                errors.date ? "border-red-500" : "border-slate-200"
              }`}
            />
            {errors.date && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all focus:border-blue-500`}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>➕</span> Create Event
          </button>
          <button 
            type="button"
            onClick={() => window.history.back()}
            className="w-full mt-3 py-2 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default EventForm;
