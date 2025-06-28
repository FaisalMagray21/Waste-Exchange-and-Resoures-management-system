const express = require('express'); 
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const secureRoutes = require('./routes/secureRoutes');
const itemRoutes = require('./routes/itemsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');


const app = express();
const server = http.createServer(app);  // ✅ Socket ke liye yeh use karna zaroori hai

// ✅ Socket.IO initialization
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: '*',
    methods:["GET","POST"]
   }
});
require('./socket/socketServer')(io);

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', secureRoutes);     // Protected routes
app.use('/api/items', itemRoutes);       // Public or mixed routes
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Start server using `server.listen` (NOT app.listen)
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// app.listen(PORT, () => {
//   console.log(`Server running on http://192.168.1.7:${PORT}`);
// });
 

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running at http://0.0.0.0:${PORT}`);
// });

// app.listen(3000, '0.0.0.0', () => {
//   console.log('Server running on http://192.168.1.6:3000');
// });





