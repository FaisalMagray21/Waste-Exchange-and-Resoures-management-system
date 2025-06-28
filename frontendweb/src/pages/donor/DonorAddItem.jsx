// DonorAddItem.jsx - ReactJS + Tailwind CSS Version
import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

export default function DonorAddItem() {
  const [form, setForm] = useState({ title: '', description: '', location: '' });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const fileRef = useRef();

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const pickImage = (e) => {
    const selected = Array.from(e.target.files);
    if (images.length + selected.length > 3) {
      alert('You can only upload 3 images');
      return;
    }
    setImages([...images, ...selected]);
  };

  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    const { title, description, location } = form;
    if (!title || !description || !location || images.length === 0) {
      setError('Please complete all fields and upload at least one image');
      return;
    }

    setLoading(true);
    setError('');
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('location', location);
    images.forEach((img) => data.append('images', img));

    try {
      await axios.post(`${API_BASE_URL}/api/items/add`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });
      alert('Item uploaded successfully!');
      setForm({ title: '', description: '', location: '' });
      setImages([]);
    } catch (err) {
      setError('Failed to upload item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <h1 className="text-center text-2xl text-green-400 font-bold mb-6">Add New Donation</h1>
      <div className="max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-800 border border-green-400"
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-800 border border-green-400"
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-800 border border-green-400"
        />

        <div className="mb-4">
          <button
            onClick={() => fileRef.current.click()}
            className="bg-green-400 text-black py-2 px-4 rounded font-bold"
          >
            + Add Image ({images.length}/3)
          </button>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={pickImage}
            ref={fileRef}
            hidden
          />
        </div>

        <div className="flex gap-3 flex-wrap mb-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-24 h-24">
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-full h-full object-cover rounded"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm text-center mb-2">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-green-400 text-black py-2 rounded font-bold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Item'}
        </button>
      </div>
    </div>
  );
}
