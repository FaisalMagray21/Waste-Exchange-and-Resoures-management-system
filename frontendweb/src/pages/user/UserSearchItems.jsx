import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api/api'; // adjust if needed

export default function UserSearchItems() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [items, setItems] = useState([]);

  const handleSearch = async () => {
    if (!name && !location) {
      alert('Please enter item name or location');
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/items/filter`, {
        params: { name, location },
      });
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold text-green-400 text-center mb-6">🔍 Search Items</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-800 text-white border border-green-400 p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-gray-800 text-white border border-green-400 p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded w-full md:w-auto"
        >
          Search
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">No results found</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="bg-gray-800 p-4 rounded-lg border border-green-500">
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
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
              <p className="text-sm text-gray-400 mt-1">📍 {item.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
