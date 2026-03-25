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
      console.log('joinnn',res);
      
      // navigate(`/instructor/joinEvent/${event.id}`, {
      //   state: { instructorName }
      // });

      navigate(`/instructor/groupEvent/${res.data.roomId}`, {
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
  <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Image and Description */}
        <div className="lg:w-2/3 space-y-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-200 aspect-video">
            <img 
              src={eventImage} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            {event.isLive && !event.isOver && (
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Live Now
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {event.title}
            </h1>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {event.instructorName?.charAt(0)}
              </div>
              <p className="font-semibold text-lg">Hosted by {event.instructorName}</p>
            </div>
            <hr className="border-slate-100" />
            <div className="prose prose-slate max-w-none">
              <h3 className="text-xl font-bold text-slate-800">About this event</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Event Info Card */}
        <div className="lg:w-1/3">
          <div className="sticky top-8 bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl">🏷️</span>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Topic</p>
                  <p className="font-bold text-slate-900">{event.topic}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Date & Time</p>
                  <p className="font-bold text-slate-900">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-slate-600 font-medium">{event.time} ({event.duration || 2} Hours)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl">👥</span>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Attendance</p>
                  <p className="font-bold text-slate-900">{event.participants} Participants Joined</p>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              {!event.isOver ? (
                canJoin ? (
                  event.isLive ? (
                    event.participants < (event.maxParticipants || Infinity) ? (
                      <button 
                        onClick={handleJoin} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95"
                      >
                        Join Event
                      </button>
                    ) : (
                      <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-red-600 text-center font-bold">
                        ⚠️ This event is currently full
                      </div>
                    )
                  ) : (
                    <button 
                      onClick={handleJoin} 
                      className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold text-lg transition-all"
                    >
                      Start Event
                    </button>
                  )
                ) : (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-sm text-center font-medium">
                    The join link will activate at <span className="font-bold">{event.time}</span> on event day.
                  </div>
                )
              ) : (
                <div className="p-4 bg-slate-100 rounded-xl text-slate-500 text-center font-bold">
                  🚫 This event has ended
                </div>
              )}

              {/* End Event Button for Instructors */}
              {event.isLive && !event.isOver && (
                <button 
                  className="w-full py-3 text-red-600 font-bold hover:bg-red-50 rounded-2xl transition-colors" 
                  onClick={endEvent}
                >
                  End Session for Everyone
                </button>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
);
};

export default EventDetails;
