import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import { notificationMarkAsRead } from "../../services/instructorServices";

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationBellProps {
  userId: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/api/notifications/${userId}`);

      // ✅ Ensure it's always an array
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.notifications || [];

      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  // ✅ Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationMarkAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // ✅ Count only unread ones
  const unreadCount = notifications?.filter((n) => !n.isRead)?.length || 0;

  return (
    <div className="relative">
      {/* 🔔 Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📬 Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border z-50">
          <div className="p-3 border-b font-semibold">Notifications</div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 p-3">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    n.isRead ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <p className="font-medium text-sm">{n.title}</p>
                  <p className="text-xs text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <a
            href="/notifications"
            className="block text-center text-blue-600 text-sm py-2 hover:underline"
          >
            View all
          </a>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
