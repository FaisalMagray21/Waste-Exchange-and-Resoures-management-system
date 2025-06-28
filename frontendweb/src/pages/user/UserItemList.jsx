import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../api/api'; // make sure path is correct

export default function UserItemList() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetchItems();
  }, [user]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/items/all`);
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching items:', err.message);
    }
  };

  const handleClaim = async (itemId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/claims`,
        { item: itemId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Claim request sent!');
    } catch (err) {
      console.error('Claim error:', err.message);
      alert('Failed to send claim request.');
    }
  };

  const messageDonor = (donorId, itemId) => {
    navigate(`/chat/${user._id}_${donorId}_${itemId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold text-green-400 text-center mb-6">📦 Browse Available Items</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full">No items found</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="bg-gray-800 rounded-lg p-4 border border-green-400">
              <div className="flex overflow-x-auto gap-2 mb-3">
                {item.images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={`${API_BASE_URL}/${img.replace(/\\/g, '/')}`}
                    alt="item"
                    className="w-24 h-20 object-cover rounded"
                  />
                ))}
              </div>

              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
              <p className="text-sm text-gray-300 mt-1">📍 {item.location}</p>
              <p className="text-sm text-green-300">👤 Donor: {item.user?.fullname}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => messageDonor(item.user?._id, item._id)}
                  className="flex-1 bg-green-500 hover:bg-green-400 text-black px-3 py-2 rounded"
                >
                  Message Donor
                </button>
                
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
