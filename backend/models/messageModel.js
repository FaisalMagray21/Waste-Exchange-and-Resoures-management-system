const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' },
  text: { type: String, required: true },
  senderName: { type: String },
  conversationId: { type: String, required: true },
  deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 

}, {
  timestamps: true,
});

module.exports = mongoose.model('Message', messageSchema);
