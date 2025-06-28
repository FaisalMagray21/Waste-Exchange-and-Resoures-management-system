// src/pages/admin/AdminDashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch users', err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/items`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch items', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/items/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      alert('Error deleting item');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchItems();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-green-400 text-3xl font-bold text-center mb-6">🛠 Admin Dashboard</h1>

      <h2 className="text-xl font-semibold text-green-300 mt-6 mb-3">👤 Registered Users</h2>
      {users.map((u) => (
        <div key={u._id} className="bg-gray-800 p-4 rounded mb-4 flex justify-between items-start">
          <div>
            <p className="font-bold text-lg">{u.fullname}</p>
            <p className="text-sm text-gray-300">Role: {u.role}</p>
            <p className="text-sm text-gray-300">Email: {u.email}</p>
          </div>
          <button onClick={() => deleteUser(u._id)} className="bg-red-600 px-3 py-1 rounded font-semibold">Delete</button>
        </div>
      ))}

      <h2 className="text-xl font-semibold text-green-300 mt-10 mb-3">📦 Listed Items</h2>
      {items.map((item) => (
        <div key={item._id} className="bg-gray-800 p-4 rounded mb-4">
          <p className="font-bold text-lg">📌 {item.title}</p>
          <p className="text-sm text-gray-300">📍 {item.location}</p>
          <p className="text-sm text-gray-300">📝 {item.description}</p>
          <p className="text-sm text-gray-300">👤 Donor: {item.user?.fullname || 'Unknown'}</p>

          {item.images?.length > 0 && (
            <div className="flex overflow-x-auto mt-2 space-x-2">
              {item.images.map((img, index) => (
                <img
                  key={index}
                  src={`${API_BASE_URL}/${img.replace(/\\/g, '/')}`}
                  alt="item"
                  className="w-24 h-24 rounded object-cover"
                />
              ))}
            </div>
          )}

          <button onClick={() => deleteItem(item._id)} className="mt-3 bg-red-600 px-3 py-1 rounded font-semibold">Delete</button>
        </div>
      ))}
    </div>
  );
}
