import React, { useEffect, useState } from "react";
import "./notification.css"; 
import api from "../../../api/userApi";
import Navbar from "../navbar/navbar";

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


const UserNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get(`/user/notifications`);
        console.log(res);
        
        setNotifications(res.data.notifications);

        await api.put(`/user/notificationsMarkRead`);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);






  return (
    <>
    <Navbar />
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

export default UserNotifications;
