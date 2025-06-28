const User = require('../models/User');
const Item = require('../models/itemModel');
const Notification=require('../models/notificationModel'); 


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};






exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};



exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.deleteOne();

    await Notification.create({
      userId: item.donorId || item.user, // adjust based on your model field
      message: `Your item "${item.title}" was deleted by admin.`,
    });

    res.json({ message: 'Item deleted and donor notified.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
};





exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('user', 'fullname email');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items', error: err.message });
  }
};


