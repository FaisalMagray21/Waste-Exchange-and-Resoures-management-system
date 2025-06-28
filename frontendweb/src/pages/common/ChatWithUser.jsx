import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../api/api';

export default function ChatWithUser() {
  const { user } = useContext(AuthContext);
  const { conversationId } = useParams(); // Format: sender_receiver_item
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const [senderId, receiverId, itemId] = conversationId?.split('_') || [];
  const isValidPayload = senderId && receiverId && itemId && text.trim() && conversationId;

  useEffect(() => {
    if (!user?.token) return;

    fetchMessages();

    if (!socketRef.current) {
      socketRef.current = io(API_BASE_URL);
      socketRef.current.emit('register', user._id);
    }

    socketRef.current.on('newMessage', (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });
      }
    });

    return () => {
      socketRef.current?.off('newMessage');
    };
  }, [conversationId, user]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err.message);
    }
  };

  const sendMessage = async () => {
    if (!isValidPayload) {
      alert('Please fill in all fields');
      return;
    }

    const newMsg = {
      senderId,
      receiverId,
      itemId,
      text,
      conversationId,
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/messages`, newMsg, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages((prev) => [...prev, res.data]);
      socketRef.current.emit('sendMessage', res.data);
      setText('');
    } catch (err) {
      console.error('Send error:', err.response?.data || err.message);
    }
  };

  const deleteMessage = async (msgId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this message for yourself?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/messages/${msgId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setMessages((prev) => prev.filter((m) => m._id !== msgId));
    } catch (err) {
      console.error('Delete error:', err.message);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user || !user.token) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-800 text-center text-green-400 font-semibold text-lg">
        💬 Chat
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isSender = msg.senderId === user._id;
          return (
            <div
              key={msg._id}
              className={`p-3 rounded-lg max-w-[80%] relative group cursor-pointer ${
                isSender ? 'bg-green-500 self-end text-black' : 'bg-gray-700 self-start text-white'
              }`}
              onClick={() => {
                if (isSender || msg.receiverId === user._id) deleteMessage(msg._id);
              }}
            >
              <div className="text-xs mb-1">{isSender ? 'You' : msg.senderName || 'Them'}</div>
              <div>{msg.text}</div>
              <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 text-xs text-red-200">
                🗑 Tap to delete
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center p-4 border-t border-gray-800">
        <input
          type="text"
          className="flex-1 px-4 py-2 bg-gray-800 rounded text-white placeholder-gray-400"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-semibold rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
