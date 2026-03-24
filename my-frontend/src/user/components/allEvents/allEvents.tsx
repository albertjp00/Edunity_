import { useState, useEffect } from "react";
import "./allEvents.css";
import webinarImage from "../../../assets/webinar_thumnail.png";
import { useNavigate } from "react-router-dom";
import type { Ievent } from "../../../instructor/interterfaces/events";
import { getEvents } from "../../services/eventServices";
import useDebounce from "../../../admin/components/debounce/debounce";

const UserAllEventList: React.FC = () => {
  const [events, setEvents] = useState<Ievent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchEvents = async (search = "", page = 1) => {
    try {
      const result = await getEvents(search , page);
      console.log(result);

      if (!result) return;

      const eventsData = Array.isArray(result.data?.events)
        ? result.data.events
        : [];
      const totalPagesData = result.data?.totalPages || 1;

      setEvents(eventsData);
      setTotalPages(totalPagesData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEvents(searchQuery, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchEvents(searchQuery, page);
  };

    const debouncedSearchTerm = useDebounce(searchQuery, 500)

  useEffect(() => {
    fetchEvents(debouncedSearchTerm, currentPage);
  }, [currentPage, debouncedSearchTerm]);


  const EventDetails = (id: string) => {
    navigate(`/user/eventDetails/${id}`);
  };

  useEffect(() => {
    fetchEvents("", currentPage);
  }, []);

  return (
  <div className="max-w-7xl mx-auto px-6 py-12 bg-white">
    {/* MODERN BANNER */}
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-10 py-16 mb-12 shadow-2xl shadow-slate-200">
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
          My Events
        </h1>
        <p className="text-slate-400 mt-2 font-medium italic">Your personalized learning schedule.</p>
      </div>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
    </div>

    {/* SEARCH AREA */}
    <form className="relative max-w-2xl mx-auto mb-16 group" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search your registered events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-14 pr-32 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium shadow-sm"
      />
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> */}
        </svg>
      </div>
      
    </form>

    {/* EVENT LIST */}
    {events.length === 0 ? (
      <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-slate-100">
        <div className="text-4xl mb-4">🎫</div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No events found in your library</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={() => EventDetails(event._id!)}
          >
            {/* TILE IMAGE WRAPPER */}
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={webinarImage}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* INSTRUCTOR OVERLAY */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-900 shadow-sm">
                   By {event.instructorName}
                </span>
              </div>

              {/* EVENT OVER STATUS */}
              {event.isOver && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-[0.2em]">
                    Event Over
                  </span>
                </div>
              )}
            </div>

            {/* TILE CONTENT */}
            <div className="p-8 flex flex-col flex-1">
              <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.15em] mb-2">
                {new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
              </span>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {event.title}
              </h3>
              
              <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6">
                {event.description}
              </p>

              <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-5">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tighter">
                   <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                   Registered Member
                </span>
                <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                   →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* PAGINATION */}
    {totalPages > 1 && (
      <div className="mt-16 flex justify-center items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`w-12 h-12 rounded-2xl font-black text-sm transition-all duration-300 ${
              currentPage === i + 1 
                ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-110" 
                : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    )}
  </div>
);
};

export default UserAllEventList;
