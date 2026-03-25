import { useState, useEffect } from "react";
import { getMyEvents } from "../../services/instructorServices";
import type { Ievent } from "../../interterfaces/events";
import "./allEvents.css";
import webinarImage from "../../../assets/webinar_thumnail.png";
import { useNavigate } from "react-router-dom";

const InstructorAllEventList: React.FC = () => {
  const [events, setEvents] = useState<Ievent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchEvents = async (search = "", page = 1) => {
    try {
      const result = await getMyEvents(search, page);
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

  const gotoEdit = (id: string) => {
    navigate(`/instructor/editEvent/${id}`);
  };

  const EventDetails = (id: string) => {
    navigate(`/instructor/eventDetails/${id}`);
  };

  useEffect(() => {
    fetchEvents("", currentPage);
  }, []);

 return (
  <div className="min-h-screen bg-gray-50">
    {/* Banner Section */}
    <div className="bg-slate-900 py-12 px-6 text-center text-white">
      <h1 className="text-3xl font-bold tracking-tight uppercase">MY EVENTS</h1>
      <p className="mt-1 text-xs text-slate-400 uppercase tracking-widest">Instructor Dashboard</p>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <span className="text-blue-600 font-bold text-[10px] tracking-[0.2em] uppercase">MANAGEMENT</span>
          <h2 className="text-2xl font-bold text-gray-800">Your Schedule</h2>
        </div>

        <form onSubmit={handleSearch} className="flex items-center w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-5 pr-24 py-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-full transition-colors flex items-center gap-2"
          >
            🔍 Search
          </button>
        </form>
      </div>

      {/* Event List */}
      {events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <p className="text-gray-400 font-medium">No events found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <div 
                key={event.id} 
                className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col ${event.isOver ? 'opacity-75' : ''}`}
              >
                {/* Thumbnail Wrapper */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={webinarImage}
                    alt={event.title}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${event.isOver ? 'grayscale' : ''}`}
                  />
                  
                  {/* Instructor Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold rounded shadow-sm">
                      {event.instructorName}
                    </span>
                  </div>

                  {/* Dynamic Action Button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {!event.isOver ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); gotoEdit(event.id!); }}
                        className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-xl hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        Edit Event
                      </button>
                    ) : (
                      <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
                        Event Over
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div 
                  className="p-4 flex flex-col flex-grow cursor-pointer"
                  onClick={() => EventDetails(event.id!)}
                >
                  <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      📅 {new Date(event.date).toDateString()}
                    </span>
                    {event.isOver && (
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-full font-bold text-xs transition-all ${
                    currentPage === i + 1 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110" 
                      : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
};

export default InstructorAllEventList;
