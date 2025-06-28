const Notification = require('../models/notificationModel');

exports.getUserNotifications = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      console.log('❌ req.user is undefined or missing _id');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('✅ Notification user ID:', req.user._id);

    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('🔥 Notification fetch error:', err);
    res.status(500).json({ error: err.message });
  }
};



exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};