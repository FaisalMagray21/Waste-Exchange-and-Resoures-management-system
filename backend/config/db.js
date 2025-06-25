const mongoose = require('mongoose');
require('dotenv').config();
const url= process.env.MONGO_URI || 'mongodb+srv://wasteresources:wasteresources123@cluster0.11cczlf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
