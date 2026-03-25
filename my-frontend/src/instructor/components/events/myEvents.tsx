import { useState, useEffect } from "react";
import { getMyEventsHomePage } from "../../services/instructorServices";
import type { Ievent } from "../../interterfaces/events";
import './myEvents.css'
import webinarImage from '../../../assets/webinar_thumnail.png'
import { useNavigate } from "react-router-dom";

const InstructorEventList: React.FC = () => {
  const [events, setEvents] = useState<Ievent[]>([]);

  const navigate = useNavigate()

  const fetchEvents = async () => {
      try {
        const result = await getMyEventsHomePage();
        if(!result) return;
        console.log(result.data);
        setEvents(result.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    const gotoEdit = (id:string)=>{
      navigate(`/instructor/editEvent/${id}`)
    }

    const EventDetails = (id:string )=>{
      navigate(`/instructor/eventDetails/${id}`)
    }


    const allEvents = ()=>{
      navigate('/instructor/allEvents')
    }

  useEffect(() => {
    fetchEvents();
  }, []);

return (
  <div className="min-h-screen bg-gray-50">
    {/* Banner Section */}
    <div className="bg-slate-900 py-12 px-6 text-center text-white">
      <h1 className="text-3xl font-bold tracking-tight uppercase">MY EVENTS</h1>
      <p className="mt-1 text-xs text-slate-400 uppercase tracking-widest">Home / Instructor</p>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <span className="text-blue-600 font-bold text-[10px] tracking-[0.2em] uppercase">PROVIDES</span>
          <h2 className="text-2xl font-bold text-gray-800">Events</h2>
        </div>

        <button 
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all shadow-md active:scale-95" 
          onClick={allEvents}
        >
          Show all Events <span className="ml-2">→</span>
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-400">No events available</p>
        </div>
      ) : (
        /* Event Grid - 4 columns on large screens to match Courses */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col"
            >
              {/* Image & Overlay Wrapper */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
                <img 
                  src={webinarImage} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Instructor Tag */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold rounded shadow-sm">
                    👤 {event.instructorName}
                  </span>
                </div>

                {/* Edit Button - Visible on Hover */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    gotoEdit(event.id!);
                  }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-xl">
                    ✏️ Edit Event
                  </span>
                </button>
              </div>

              {/* Content Section */}
              <div 
                className="p-4 flex flex-col flex-grow cursor-pointer" 
                onClick={() => EventDetails(event.id!)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    Webinar
                  </span>
                  <span className="text-[10px] font-medium text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-1 leading-tight group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                
                <p className="text-[11px] text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                  {event.description}
                </p>

                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  📅 {new Date(event.date).toDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);


};

export default InstructorEventList;
