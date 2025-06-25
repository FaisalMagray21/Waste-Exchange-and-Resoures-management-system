// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Ensure upload folder exists
//const uploadPath = 'uploads';
const uploadPath = path.join(__dirname, '../uploads');


if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true }); // safer than just mkdirSync
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png files are allowed!'));
  }
};

// Export multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

module.exports = upload;
