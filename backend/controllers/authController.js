const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

// ✅ Register a new user
exports.register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const user = new User({ fullname, email, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    console.log(isMatch)
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = generateToken(user);
     res.status(200).json({ token, 
    // user: { 
      
    //   fullname: user.fullname, email: user.email, role: user.role } });
user: {
    _id: user._id,                 // ✅ add this line
    fullname: user.fullname,
    email: user.email,
    role: user.role
  }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





