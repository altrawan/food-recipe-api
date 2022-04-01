const multer = require('multer');
const { failed } = require('../helpers/response');
const path = require('path');

// management file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/user');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// limit & file filter
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/jpg' &&
      file.mimetype !== 'image/png'
    ) {
      cb(null, false);
      return cb(new Error('Only image type: JPEG, JPG, PNG'));
    }
    return cb(null, true);
  },
}).single('photo');

// validation & middleware
const uploadFilter = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return failed(res, 401, 'failed', err.message)
    }
    if (err) {
      // An unknown error occurred when uploading.
      return failed(res, 401, 'failed', err.message)
    }
    return next();
  });
};

module.exports = uploadFilter;
