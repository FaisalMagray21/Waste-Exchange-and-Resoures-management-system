// src/pages/user/NotificationPanel.jsx

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

export default function NotificationPanel() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user && user.token) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err.message);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchNotifications();
    } catch (err) {
      console.error('Error marking as read:', err.message);
    }
  };

  if (!user || !user.token) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h2 className="text-2xl text-green-400 font-bold mb-6">🔔 Notifications</h2>
        <p className="text-gray-400">Please login to view notifications.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl text-green-400 font-bold mb-6">🔔 Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`p-4 rounded-lg border ${
                notif.isRead ? 'border-gray-600 bg-gray-800' : 'border-green-500 bg-gray-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-md font-semibold">{notif.message}</p>
                  {notif.itemTitle && (
                    <p className="text-sm text-gray-400">Item: {notif.itemTitle}</p>
                  )}
                  <p className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
                {!notif.isRead && (
                  <button
                    onClick={() => markAsRead(notif._id)}
                    className="ml-4 px-3 py-1 text-sm rounded bg-green-600 hover:bg-green-500 text-white"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
