// DonorItemList.jsx - Converted to ReactJS with Tailwind CSS
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../api/api';

export default function DonorItemList() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchMyItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/items/my`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load items:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/items/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setItems((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        alert('Failed to delete item.');
        console.error('Delete failed:', err.message);
      }
    }
  };

  const openImage = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-green-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold text-green-400 text-center mb-6">🧾 Your Donations</h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-400">No items found</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item._id} className="bg-gray-800 border border-green-500 rounded-lg p-4 shadow-lg">
              <div className="flex space-x-2 overflow-x-auto mb-3">
                {item.images?.map((img, idx) => {
                  const imageUrl = img.startsWith('http') ? img : `${API_BASE_URL}/${img.replace(/\\/g, '/')}`;
                  return (
                    <img
                      key={idx}
                      src={imageUrl}
                      alt="preview"
                      className="w-24 h-24 rounded cursor-pointer object-cover"
                      onClick={() => openImage(imageUrl)}
                    />
                  );
                })}
              </div>
              <h2 className="text-lg font-semibold">Title: {item.title}</h2>
              <p className="text-gray-300">Description: {item.description}</p>
              <p className="text-gray-400 text-sm mt-1">Location 📍 {item.location}</p>
              <button
                className="mt-3 bg-red-600 hover:bg-red-500 text-white py-1 px-4 rounded"
                onClick={() => deleteItem(item._id)}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {modalVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setModalVisible(false)}
        >
          <img src={selectedImage} alt="full" className="max-h-[90vh] max-w-[90vw] object-contain" />
        </div>
      )}
    </div>
  );
}
