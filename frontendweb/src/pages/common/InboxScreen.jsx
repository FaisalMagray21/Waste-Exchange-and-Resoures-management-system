import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../api/api';

export default function InboxScreen() {
  const { user } = useContext(AuthContext);
  const [groupedConversations, setGroupedConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      if (!user?.token) {
        console.warn('User token not found');
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const rawConversations = res.data;

      // Grouping by donor (otherUser)
      const grouped = {};
      rawConversations.forEach((conv) => {
        const otherUser =
          conv.senderId._id === user._id ? conv.receiverId : conv.senderId;
        const key = otherUser._id;

        if (!grouped[key]) {
          grouped[key] = { latest: conv, user: otherUser };
        } else if (new Date(conv.createdAt) > new Date(grouped[key].latest.createdAt)) {
          grouped[key].latest = conv; // update with latest message
        }
      });

      setGroupedConversations(Object.values(grouped));
    } catch (err) {
      console.error('Inbox fetch error:', err.message);
    }
  };

  const openChat = (conv) => {
    navigate(`/chat/${conv.latest.conversationId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-400">📬 Inbox</h2>
      {groupedConversations.length === 0 ? (
        <p className="text-gray-400">No conversations yet.</p>
      ) : (
        <div className="space-y-4">
          {groupedConversations.map((group) => (
            <div
              key={group.latest._id}
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 cursor-pointer"
              onClick={() => openChat(group)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">{group.user.fullname}</p>
                  {/* Optionally show: <p className="text-sm text-gray-400">{group.latest.conversationId}</p> */}
                </div>
                <span className="text-sm text-gray-300">{group.latest.text || '...'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
