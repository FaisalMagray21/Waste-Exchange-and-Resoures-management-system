const express = require('express');
const router = express.Router();

const {
  getMessagesByConversation,
  deleteMessage,
  sendMessage,getUserInbox
} = require('../controllers/messageController');

const { verifyToken } = require('../middlewares/authMiddleware');

// ✅ Use verifyToken for all routes
router.use(verifyToken);

// ✅ Get all messages in a conversation
router.get('/:conversationId', getMessagesByConversation);

// ✅ Send a message
router.post('/', sendMessage);

// ✅ Delete a message
router.delete('/:id', deleteMessage);
router.get('/', getUserInbox);

module.exports = router;
