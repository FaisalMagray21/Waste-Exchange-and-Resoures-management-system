import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserItemList from './pages/user/UserItemList';
import UserSearchItems from './pages/user/UserSearchItems';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorAddItem from './pages/donor/DonorAddItem';
import DonorItemList from './pages/donor/DonorItemList';

// Common Pages
import ChatWithUser from './pages/common/ChatWithUser';
import InboxScreen from './pages/common/InboxScreen';
import NotificationPanel from './pages/common/NotificationPanel';

// 404 Page
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* User Routes */}
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/items" element={<UserItemList />} />
      <Route path="/user/search" element={<UserSearchItems />} />
      
      <Route path="/user/inbox" element={<InboxScreen />} />

      {/* Donor Routes */}
      <Route path="/donor/dashboard" element={<DonorDashboard />} />
      <Route path="/donor/add-item" element={<DonorAddItem />} />
      <Route path="/donor/my-items" element={<DonorItemList />} />
      <Route path="/donor/inbox" element={<InboxScreen />} />
      <Route path="/user/inbox" element={<InboxScreen />} />

      {/* Common Chat */}
      <Route path="/chat/:conversationId" element={<ChatWithUser />} />

<Route path="/donor/notifications" element={<NotificationPanel />} />
<Route path="/user/notifications" element={<NotificationPanel />} />


      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
