
const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/authMiddleware');



router.get('/',verifyToken, getUserNotifications);
router.patch('/:id/read',verifyToken, markAsRead);

module.exports = router;