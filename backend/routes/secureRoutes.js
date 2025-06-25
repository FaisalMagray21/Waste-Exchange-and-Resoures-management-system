const express = require('express');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/secure-data', verifyToken, (req, res) => {
  res.json({ message: 'You have accessed secure data!', user: req.user });
});

module.exports = router;
