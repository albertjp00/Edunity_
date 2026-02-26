import { useEffect, useState } from "react";
import "./notification.css";
import api from "../../../api/userApi";
import Navbar from "../navbar/navbar";
import { fetchNotifications } from "../../services/profileServices";
import { toast } from "react-toastify";

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}


const UserNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const limit = 5

  useEffect(() => {
    const getNotifications = async (page:number) => {
      try {
        const res = await fetchNotifications(page)
        console.log(res);
        if (!res) return
        setNotifications(res.data.notifications);
        setTotalPages(Math.ceil(res.data.total / limit))

        
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    getNotifications(page);
  }, [page]);


  const markAsRead = async()=>{
    try {
      await api.put(`/user/notificationsMarkRead`);
      toast.success('Marked as read')
    } catch (error) {
      console.log(error);
      
    }
  }




  return (
    <>
      <Navbar />
      <div className="notifications-container">
        <div className="header">
          <h2 className="notifications-title">All Notifications</h2>
        <button className="load-more-btn" onClick={markAsRead}>Mark as read</button>
        </div>

        {notifications.length === 0 ? (
          <p className="notifications-empty">No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`notification-card ${n.isRead ? "true" : "false"
                }`}
            >
              <h3 className="notification-title">{n.title}</h3>
              <p className="notification-message">{n.message}</p>

              {n.link && (
                <a href={n.link} className="notification-link">
                  View
                </a>
              )}

              <p className="notification-date">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}

        <div className="pagination-controls">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => ( 
              <button
                key={i + 1}
                className={page === i + 1 ? "active" : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next
            </button>
          </div>
      </div>
    </>
  );
};

export default UserNotifications;
