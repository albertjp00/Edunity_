import { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./editEvents.css";
import type { Ievent } from "../../interterfaces/events";
import { getEditEvent, updateEvent } from "../../services/eventsServices";
import type { IEventFormData } from "../../interterfaces/instructorInterfaces";

const EditEvents: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Ievent | null>(null);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [initialValues, setInitialValues] = useState({
    title: "",
    topic: "",
    description: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState<{
    title?: string;
    topic?: string;
    description?: string;
    date?: string;
    time?: string;
  }>({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await getEditEvent(id!);
        if (!result) return;

        const eventData = result.data.event;

        setEvent(eventData);
        setTitle(eventData.title || "");
        setTopic(eventData.topic || "");
        setDescription(eventData.description || "");
        setDate(eventData.date ? eventData.date.split("T")[0] : "");
        setTime(eventData.time || "");

        setInitialValues({
          title: eventData.title || "",
          topic: eventData.topic || "",
          description: eventData.description || "",
          date: eventData.date ? eventData.date.split("T")[0] : "",
          time: eventData.time || "",
        });
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [id]);

  const validateForm = () => {
    const newErrors: {
      title?: string;
      topic?: string;
      description?: string;
      date?: string;
      time?: string;
    } = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!topic.trim()) newErrors.topic = "Topic is required";
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

    if (!time) {
      newErrors.time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData :IEventFormData = { title, topic, description, date, time };

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
    topic !== initialValues.topic ||
    description !== initialValues.description ||
    date !== initialValues.date ||
    time !== initialValues.time; 

  if (!event) return <p className="loading">Loading event...</p>;

return (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-slate-900 px-8 py-10 text-center">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Edit Event</h2>
        <p className="text-slate-400 mt-2 text-sm">Modify your session details, timing, and topic</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        
        {/* Title & Topic Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.title ? "border-red-500" : "border-slate-200 focus:border-blue-500"
              }`}
              placeholder="e.g., Live Coding Q&A"
            />
            {errors.title && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.topic ? "border-red-500" : "border-slate-200 focus:border-blue-500"
              }`}
              placeholder="e.g., Advanced React Patterns"
            />
            {errors.topic && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.topic}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 ${
              errors.description ? "border-red-500" : "border-slate-200 focus:border-blue-500"
            }`}
            placeholder="Provide a detailed agenda for the attendees..."
          />
          {errors.description && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.description}</p>}
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.date ? "border-red-500" : "border-slate-200 focus:border-blue-500"
              }`}
            />
            {errors.date && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.time ? "border-red-500" : "border-slate-200 focus:border-blue-500"
              }`}
            />
            {errors.time && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.time}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            className="flex-1 px-6 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95"
            onClick={() => navigate("/events")}
          >
            Discard Changes
          </button>
          <button
            type="submit"
            disabled={!isChanged}
            className={`flex-1 px-6 py-3.5 font-bold rounded-xl transition-all shadow-lg active:scale-95 ${
              isChanged 
              ? "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            Update Event
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default EditEvents;
