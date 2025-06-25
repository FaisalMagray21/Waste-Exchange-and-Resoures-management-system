const Item = require('../models/itemModel');

// Create new item
exports.createItem = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    //const images = req.files.map(file => file.path);
     //const images = req.files.map(file => file.filename);
        const images = req.files.map(file => 'uploads/' + file.filename);


    const item = new Item({
      title,
      description,
      location,
      images,
      user: req.user.id
    });

    await item.save();
    res.status(201).json({ message: 'Item created successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
};

// Get all items
exports.getItems = async (req, res) => {
  try {
     const items = await Item.find().populate('user', 'username email');

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

// Get items for logged-in user
exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user items', error: error.message });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};

// Get items by location
exports.getItemsByLocation = async (req, res) => {
  try {
    const location = req.query.location;
    if (!location) return res.status(400).json({ message: "Location query required" });

    const items = await Item.find({ location: new RegExp(location, 'i') });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Unified search controller
exports.searchItemsByNameAndLocation = async (req, res) => {
  try {
    const { name, location } = req.query;
    const query = {};

    if (name) {
      query.title = new RegExp(name, 'i'); // Case-insensitive name search
    }

    if (location) {
      query.location = new RegExp(location, 'i'); // Case-insensitive location search
    }

    const items = await Item.find(query).populate('user', 'fullname email');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Search error', error: error.message });
  }
};



