const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// All routes protected with admin role
router.get('/users', verifyToken, authorizeRoles('admin'), adminController.getAllUsers);
router.delete('/users/:id', verifyToken, authorizeRoles('admin'), adminController.deleteUser);

router.get('/items', verifyToken, authorizeRoles('admin'), adminController.getAllItems);
router.delete('/items/:id', verifyToken, authorizeRoles('admin'), adminController.deleteItem);

//router.get('/donors', verifyToken, authorizeRoles('admin'), adminController.getDonorsWithItems);


module.exports = router;
