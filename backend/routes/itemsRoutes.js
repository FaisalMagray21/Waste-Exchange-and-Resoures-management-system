const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// Create item with up to 3 images
router.post('/add', verifyToken, upload.array('images', 3), itemController.createItem);

// Get all items
router.get('/all', itemController.getItems);

// Get items for logged-in user
router.get('/my', verifyToken, itemController.getMyItems);

// Delete item by ID
router.delete('/:id', verifyToken, itemController.deleteItem);

// Filter items by location


router.get('/filter', itemController.searchItemsByNameAndLocation);

module.exports = router;
