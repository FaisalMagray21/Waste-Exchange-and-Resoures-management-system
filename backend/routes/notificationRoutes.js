const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, notificationController.getNotifications);
router.patch('/:id/read', verifyToken, notificationController.markAsRead);
router.delete('/:id', verifyToken, notificationController.deleteNotification);

router.put('/mark-all-read', verifyToken, notificationController.markAllAsRead);

module.exports = router;