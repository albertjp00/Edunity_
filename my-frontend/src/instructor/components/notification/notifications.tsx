import { useEffect, useState } from "react";
import "./notifications.css"; 
import InstructorNavbar from "../navbar/navbar";
import { getNotification } from "../../services/instructorServices";

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// interface NotificationBellProps {
//   userId: string;
// }



const InstructorNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotification()
        // console.log(res);
        if(!res) return
        
        setNotifications(res.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <>
    <InstructorNavbar />
    <div className="notifications-container">
      <h2 className="notifications-title">All Notifications</h2>

      {notifications.length === 0 ? (
        <p className="notifications-empty">No notifications yet.</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            className={`notification-card ${
              n.isRead ? "true" : "false"
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
    </div>
    </>
  );
};

export default InstructorNotifications;
