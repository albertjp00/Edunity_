import { useEffect, useState } from "react";
import { getEvents, getMyEvents } from "../../services/eventServices";
import type { MyEvent, UEvent } from "../../interfaces";
import thumbnail from "../../../assets/webinar_thumnail.png";
import "./showEvents.css";
import { useNavigate } from "react-router-dom";

const Events: React.FC = () => {
  const [events, setEvents] = useState<UEvent[]>([]);
  const [myRegisteredEvents, setMyRegisteredEvents] = useState<string[]>([]); // store registered eventIds
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents('',1);
      console.log('eventsss',events);
      
      if (response?.data.success) {
        setEvents(response.data.events.splice(1,3));
      }
    } finally {
      setLoading(false);
    }
  };

const fetchMyEvents = async () => {
  try {
    const res = await getMyEvents()
    
    if(!res) return
    const registeredIds = res.data.events.map((e: MyEvent) => e.eventId);
    setMyRegisteredEvents(registeredIds);
  } catch (error) {
    console.log(error);
  }
};

  const gotoDetails = (id: string) => {
    navigate(`/user/eventDetails/${id}`);
  };

  const getEventStatus = (event: UEvent) => {
    const eventDate = new Date(event.date);
    const [hours, minutes] = event.time.split(":").map(Number);
    eventDate.setHours(hours, minutes, 0, 0);
    const startTime = eventDate;
    const endTime = new Date(startTime.getTime() + event.duration * 60000);
    const now = new Date();

    if (event.isLive && now >= startTime && now <= endTime) return "LIVE";
    if (now > endTime) return "OVER";
    return "UPCOMING";
  };

  useEffect(() => {
    fetchEvents();
    fetchMyEvents();
  }, []);


  return (
  <section className="max-w-7xl mx-auto px-6 py-24">
    {/* HEADER AREA */}
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
      <div>
        <p className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs mb-3 flex items-center gap-2">
          <span className="w-8 h-px bg-indigo-600"></span> Our Events
        </p>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Yearly Events <span className="text-slate-400">&</span> Programs
        </h2>
      </div>

      <button 
        onClick={() => navigate('/user/allEvents')} 
        className="px-8 py-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-sm"
      >
        View All Events →
      </button>
    </div>

    {loading ? (
      <div className="flex justify-center py-20">
        <div className="animate-pulse text-slate-400 font-bold uppercase tracking-widest">Loading events...</div>
      </div>
    ) : events.length === 0 ? (
      <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-medium text-lg">No upcoming events found.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {events.map((event) => {
          const eventDate = new Date(event.date);
          const day = eventDate.getDate();
          const month = eventDate.toLocaleString("default", { month: "short" });
          const status = getEventStatus(event);
          const isRegistered = myRegisteredEvents.includes(event._id);

          return (
            <article 
              key={event._id} 
              className="group flex flex-col sm:flex-row bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
            >
              {/* IMAGE & BADGES */}
              <div className="relative w-full sm:w-52 h-52 sm:h-auto overflow-hidden shrink-0">
                <img 
                  src={thumbnail} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                
                {/* DATE BADGE */}
                <div className="absolute top-4 left-4 flex flex-col items-center justify-center w-14 h-16 bg-white rounded-2xl shadow-xl">
                  <span className="text-xl font-black text-slate-900 leading-none">{day}</span>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">{month}</span>
                </div>

                {/* STATUS BADGE */}
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase shadow-lg
                    ${status === "LIVE" ? "bg-red-500 text-white animate-pulse" : 
                      status === "OVER" ? "bg-slate-800 text-white" : "bg-indigo-600 text-white"}
                  `}>
                    {status}
                  </span>
                </div>
              </div>

              {/* INFO SECTION */}
              <div className="p-8 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1">⏰ {event.time}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>📍 Online</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3 line-clamp-1">
                    {event.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6">
                    {event.description ?? "Join us for this exclusive event designed for our community."}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                   {/* DYNAMIC BUTTONS */}
                  {isRegistered ? (
                    <button onClick={() => gotoDetails(event._id)} className="text-sm font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-2">
                      VIEW DETAILS <span className="text-lg">→</span>
                    </button>
                  ) : status === "UPCOMING" ? (
                    <button onClick={() => gotoDetails(event._id)} className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 uppercase tracking-widest">
                      Register Now
                    </button>
                  ) : status === "LIVE" ? (
                    <button onClick={() => gotoDetails(event._id)} className="px-6 py-2.5 bg-red-600 text-white text-xs font-black rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 uppercase tracking-widest">
                      Join Live
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-300 uppercase italic">Event Concluded</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    )}
  </section>
);
};


export default Events;
