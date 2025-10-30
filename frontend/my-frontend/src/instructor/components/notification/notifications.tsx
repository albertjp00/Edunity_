import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const res = await axios.get(`/api/notifications/${userId}`);
            setNotifications(res.data);
        };
        fetchNotifications();
    }, []);

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-5">All Notifications</h2>
            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                notifications.map((n) => (
                    <div
                        key={n._id}
                        className={`p-4 mb-3 rounded-lg shadow-sm border ${n.isRead ? "bg-gray-100" : "bg-white"
                            }`}
                    >
                        <h3 className="font-semibold">{n.title}</h3>
                        <p className="text-gray-600">{n.message}</p>
                        {n.link && (
                            <a
                                href={n.link}
                                className="text-blue-600 text-sm hover:underline"
                            >
                                View
                            </a>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};

export default Notifications;
