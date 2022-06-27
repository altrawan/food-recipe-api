const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const { failed } = require('../helpers/response');

// management file
const multerUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'photo') {
        cb(null, './public/images');
      } else {
        cb(null, './public/videos');
      }
    },
    filename: (req, file, cb) => {
      const name = crypto.randomBytes(30).toString('hex');
      const ext = path.extname(file.originalname);
      const filename = `${name}${ext}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'photo') {
      // filter mimetype image
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        cb(
          { message: 'Photo extension only can .jpg, .jpeg, and .png' },
          false
        );
      }
    } else {
      // filter mimetype video
      if (file.mimetype === 'video/mp4' || file.mimetype === 'video/3gpp') {
        cb(null, true);
      } else {
        cb({ message: 'Video extension only can .mp4 or .3gp' }, false);
      }
    }
  },
  limits: { fileSize: 50000000 },
});

// middleware
module.exports = (req, res, next) => {
  const multerFields = multerUpload.fields([
    {
      name: 'photo',
      maxCount: 1,
    },
    {
      name: 'video',
      maxCount: 1,
    },
  ]);
  multerFields(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        err.message = `File ${err.field} too large, max 50mb`;
      }

      failed(res, {
        code: 400,
        message: err.message,
        error: 'Upload File Error',
      });
    } else {
      next();
    }
  });
};
