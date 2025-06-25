const Message = require('../models/messageModel');

// GET /api/messages/:conversationId
exports.getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/messages/:id
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    await message.deleteOne();
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting message', error: err.message });
  }
};

// POST /api/messages
// POST /api/messages
exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, itemId, text } = req.body;

  if (!senderId || !receiverId || !itemId || !text) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // 🔥 Always use sorted IDs to prevent split conversations
  const sortedIds = [senderId, receiverId].sort();
  const conversationId = `${sortedIds[0]}_${sortedIds[1]}_${itemId}`;

  const message = new Message({
    senderId,
    receiverId,
    itemId,
    text,
    conversationId,
    senderName: req.user?.fullname || 'Unknown',
  });

  try {
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error('Save message error:', err);
    res.status(500).json({ error: 'Failed to save message', details: err.message });
  }
};




exports.getUserInbox = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Get all messages where user is involved
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'fullname username')
      .populate('receiverId', 'fullname username');

    // Step 2: Group by conversationId
    const grouped = {};
    messages.forEach(msg => {
      if (!grouped[msg.conversationId]) {
        grouped[msg.conversationId] = msg; // store latest one only
      }
    });

    // Step 3: Return as array sorted by recent
    const inboxArray = Object.values(grouped).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(inboxArray);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

