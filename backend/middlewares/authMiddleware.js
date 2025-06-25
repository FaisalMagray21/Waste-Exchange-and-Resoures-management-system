// const jwt = require('jsonwebtoken');

// exports.verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     return res.status(400).json({ message: 'Invalid token' });
//   }
// };

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Access denied' });
    next();
  };
};




const jwt = require('jsonwebtoken');
const User = require('../models/User'); // 👈 Make sure this is correct

exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Get full user from DB
    const user = await User.findById(decoded.id).select('fullname username role'); // Select only needed fields
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // 👈 Attach full user to request
    next();
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Invalid token' });
  }
};

