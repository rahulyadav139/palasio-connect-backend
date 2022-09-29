const multer = require('multer');

const fileFilterOption = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// const fileStorageOptions = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'images');
//   },
//   filename(req, file, cb) {
//     const uniqueFileName = req.userId + file.originalname;

//     cb(null, uniqueFileName);
//   },
// });

const storage = multer.memoryStorage();

const multerUploader = multer({
  storage,
  fileFilter: fileFilterOption,
}).single('image');

module.exports = multerUploader;
