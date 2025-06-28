import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const { fullname, email, password, role } = form;
    if (!fullname || !email || !password || !role) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-green-400 text-center mb-6">Waste-to-Resource Exchange</h1>

        <input
          name="fullname"
          placeholder="Full Name"
          className="w-full mb-3 px-4 py-2 rounded bg-gray-700 text-white"
          value={form.fullname}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-2 rounded bg-gray-700 text-white"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-3 px-4 py-2 rounded bg-gray-700 text-white"
          value={form.password}
          onChange={handleChange}
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white"
        >
          <option value="">Select Role</option>
          <option value="donor">Donor</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <button
          onClick={handleSignup}
          className="w-full bg-green-400 text-black py-2 rounded hover:bg-green-300"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Signup'}
        </button>

        <p className="text-center text-gray-300 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-green-400 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
