const Message = require('../models/messageModel');

const connectedUsers = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('📡 User connected:', socket.id);

    socket.on('register', (userId) => {
      connectedUsers[userId] = socket.id;
    });

    // Handle send message
 socket.on('sendMessage', async (data) => {
  const { senderId, receiverId, text, itemId, senderName } = data;

  const userIds = [senderId, receiverId].sort();
  const conversationId = `${userIds[0]}_${userIds[1]}_${itemId}`;

  // Save to DB
  const message = new Message({
    senderId,
    receiverId,
    itemId,
    text,
    conversationId,
    senderName: senderName || 'Unknown',
  });

  await message.save();

  // Emit to receiver
  const receiverSocket = connectedUsers[receiverId];
  if (receiverSocket) {
    io.to(receiverSocket).emit('newMessage', message);
  }
});


    socket.on('disconnect', () => {
      for (const id in connectedUsers) {
        if (connectedUsers[id] === socket.id) {
          delete connectedUsers[id];
          break;
        }
      }
    });
  });
};
