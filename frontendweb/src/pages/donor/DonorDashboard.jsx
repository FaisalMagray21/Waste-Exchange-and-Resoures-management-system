import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function DonorDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8 flex flex-col justify-between">
      {/* 🔝 Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-400">
          👋 Welcome, {user?.fullname}
        </h1>

        <div className="flex items-center gap-3">
          {/* 🔔 Notification Button */}
          <Link
            to="/donor/notifications"
            className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1 rounded-full font-semibold transition"
          >
            <img src="https://img.icons8.com/fluency/24/appointment-reminders.png" alt="notif" />
            Notifications
          </Link>

          {/* 🔓 Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-500 px-4 py-1 rounded-full font-semibold transition"
          >
            <img src="https://img.icons8.com/color/24/logout-rounded.png" alt="logout" />
            Logout
          </button>
        </div>
      </div>

      {/* 📦 Box Icon */}
      <div className="flex justify-center mb-6">
        <img
          src="https://img.icons8.com/color/96/open-box--v2.png"
          alt="Donation Box"
          className="w-24 h-24"
        />
      </div>

      {/* 📋 Dashboard Actions */}
      <div className="space-y-4 mb-6">
        <Link
          to="/donor/add-item"
          className="flex items-center bg-gray-800 hover:bg-gray-700 transition p-5 rounded-xl border-l-4 border-green-400 shadow-md"
        >
          <img src="https://img.icons8.com/color/48/plus-math.png" alt="add" className="w-6 h-6 mr-3" />
          <div>
            <h2 className="text-xl font-semibold">Upload Item</h2>
            <p className="text-gray-400 text-sm">Add items you want to donate</p>
          </div>
        </Link>

        <Link
          to="/donor/my-items"
          className="flex items-center bg-gray-800 hover:bg-gray-700 transition p-5 rounded-xl border-l-4 border-green-400 shadow-md"
        >
          <img src="https://img.icons8.com/fluency/48/box.png" alt="my items" className="w-6 h-6 mr-3" />
          <div>
            <h2 className="text-xl font-semibold">My Items</h2>
            <p className="text-gray-400 text-sm">Manage your uploaded items</p>
          </div>
        </Link>
      </div>

      {/* 💬 Inbox Link at Bottom */}
      <div className="mb-4">
        <Link
          to="/donor/inbox"
          className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition p-4 rounded-lg border border-green-500 text-green-300 font-medium"
        >
          <img src="https://img.icons8.com/fluency/24/speech-bubble-with-dots.png" alt="inbox" className="mr-2" />
          Go to Inbox
        </Link>
      </div>

      {/* 👣 Footer */}
      <div className="text-center text-gray-500 pt-4 border-t border-gray-700">
        Your contribution makes a difference 💚
      </div>
    </div>
  );
}
