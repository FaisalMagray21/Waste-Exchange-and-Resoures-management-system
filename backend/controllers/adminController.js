const User = require('../models/User');
//const Claim = require('../models/claimModel');
const Item = require('../models/itemModel');

// controllers/adminController.js
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};


// exports.getAllClaims = async (req, res) => {
//   try {
//     const claims = await Claim.find().populate('item requester');
//     res.status(200).json(claims);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching claims', error: error.message });
//   }
// };

// exports.updateClaimStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//     const updated = await Claim.findByIdAndUpdate(id, { status }, { new: true });
//     res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating claim', error: error.message });
//   }
// };




// controllers/adminController.js
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
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
};




// controllers/adminController.js
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('user', 'fullname email');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items', error: err.message });
  }
};


// In adminController.js

// exports.getDonorsWithItems = async (req, res) => {
//   try {
//     const donors = await User.find({ role: 'donor' });
//     const donorsWithItems = await Promise.all(
//       donors.map(async (donor) => {
//         const items = await Item.find({ donorId: donor._id });
//         return { ...donor.toObject(), items };
//       })
//     );
//     res.json(donorsWithItems);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch donors', error: err.message });
//   }
// };
