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
    <div className="my-events-container">
      <div className="events-banner">
        <h1>MY EVENTS</h1>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-bttn">
          🔍 Search
        </button>
      </form>

      {/* 🧾 Event List */}
      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-tile">
              <div className="tile-image-wrapper">
                <img
                  src={webinarImage}
                  alt={event.title}
                  className="tile-thumbnail"
                />
                <span className="tile-instructor">{event.instructorName}</span>
                <span
                  className={`tile-edit ${!event.isOver}`}
                  onClick={() => !event.isOver && gotoEdit(event.id!)}
                >
                  {event.isOver ? "Event Over" : "Edit"}
                </span>
              </div>

              <div
                className="tile-content"
                onClick={() => EventDetails(event.id!)}
              >
                <h3 className="tile-title">{event.title}</h3>
                <p className="tile-desc">{event.description}</p>
                <span className="tile-date">
                  {new Date(event.date).toDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📑 Pagination Controls */}
      {totalPages && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorAllEventList;
