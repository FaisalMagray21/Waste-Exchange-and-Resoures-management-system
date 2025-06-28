import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function UserDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold text-green-400 text-center mb-8">
          👋 Welcome, {user?.fullname}
        </h1>

        <div className="space-y-6">
          <Link
            to="/user/items"
            className="block bg-gray-800 hover:bg-gray-700 transition p-5 rounded-xl border-l-4 border-green-400 shadow-lg"
          >
            <h2 className="text-xl font-semibold">📦 Browse Available Items</h2>
            <p className="text-gray-400 text-sm">View all items and send messages to donors</p>
          </Link>

          <Link
            to="/user/search"
            className="block bg-gray-800 hover:bg-gray-700 transition p-5 rounded-xl border-l-4 border-green-400 shadow-lg"
          >
            <h2 className="text-xl font-semibold">🔍 Search & Filter</h2>
            <p className="text-gray-400 text-sm">Search by category or location</p>
          </Link>

          <Link
            to="/user/inbox"
            className="block bg-gray-800 hover:bg-gray-700 transition p-5 rounded-xl border-l-4 border-green-400 shadow-lg"
          >
            <h2 className="text-xl font-semibold">💬 Inbox</h2>
            <p className="text-gray-400 text-sm">Chat with donors</p>
          </Link>

          <Link
            to="/user/notifications"
            className="block bg-gray-800 hover:bg-gray-700 transition p-5 rounded-xl border-l-4 border-green-400 shadow-lg"
          >
            <h2 className="text-xl font-semibold">🔔 Notifications</h2>
            <p className="text-gray-400 text-sm">View your latest activity alerts</p>
          </Link>
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-500 transition text-white px-6 py-2 rounded-full font-semibold"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
