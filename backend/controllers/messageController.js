
const Message = require('../models/messageModel');
const Notification = require('../models/notificationModel');

// ✅ Get messages in a conversation (excluding soft-deleted ones)
exports.getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }

    const messages = await Message.find({
      conversationId,
      deletedFor: { $ne: userId }, // ✅ exclude soft-deleted
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ Soft-delete for current user only
exports.deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    // ✅ Push userId to deletedFor array if not already added
    if (!message.deletedFor.includes(userId)) {
      message.deletedFor.push(userId);
      await message.save();
    }

    res.json({ message: 'Message deleted for current user only' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message', details: err.message });
  }
};



// ✅ Send a message
exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, itemId, text } = req.body;
  if (!senderId || !receiverId || !itemId || !text) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sortedIds = [senderId, receiverId].sort();
  const conversationId = `${sortedIds[0]}_${sortedIds[1]}_${itemId}`;

  const message = new Message({
    senderId,
    receiverId,
    itemId,
    text,
    conversationId,
    senderName: req.user?.fullname || 'Unknown',
    deletedFor: [], // ✅ default empty
  });

  try {
    await message.save();

    // 🔔 Send notification to receiver
    await Notification.create({
      userId: receiverId,
      message: `You received a new message from ${req.user?.fullname || 'someone'}`,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error('Save message error:', err);
    res.status(500).json({ error: 'Failed to save message', details: err.message });
  }
};



// ✅ Inbox with latest messages (excluding deleted ones)
exports.getUserInbox = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      deletedFor: { $ne: userId },
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'fullname username')
      .populate('receiverId', 'fullname username');

    const grouped = {};
    messages.forEach(msg => {
      if (!grouped[msg.conversationId]) {
        grouped[msg.conversationId] = msg;
      }
    });

    const inboxArray = Object.values(grouped).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(inboxArray);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





