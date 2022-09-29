const express = require('express');
const multer = require('multer');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');
const multerUploader = require('../utils/multerUploader');
const cloudinaryUploader = require('../utils/cloudinaryUploader');

const router = express.Router();

// const fileStorageOptions = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'images');
//   },
//   filename(req, file, cb) {
//     console.log(file);
//     const uniqueFileName = req.userId + '_avatar_' + file.originalname;

//     cb(null, uniqueFileName);
//   },
// });

// const fileFilterOption = (req, file, cb) => {
//   if (
//     file.mimetype === 'image/png' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/jpeg'
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

router.get('/get-data', isAuth, userController.getUserData);

router.get('/get-suggestions', isAuth, userController.getSuggestions);

router.post('/save-a-post', isAuth, userController.postSaveAPost);

router.post('/remove-a-saved-post', isAuth, userController.postRemoveAPost);

router.get('/get-data/:userId', isAuth, userController.getUserDataById);

router.get('/get-followers/:userId', isAuth, userController.getFollowers);

router.get('/get-followings/:userId', isAuth, userController.getFollowings);

router.post(
  '/add-to-followings',
  isAuth,
  userController.postAddNewToFollowings
);

router.post(
  '/remove-from-followings',
  isAuth,
  userController.postRemoveFromFollowings
);

router.post('/edit-profile', isAuth, userController.postUserProfile);

router.post('/change-password', isAuth, userController.postChangePassword);

router.delete('/delete-account', isAuth, userController.deleteUserAccount);

// router.post(
//   '/upload-avatar',
//   isAuth,
//   multer({ storage: fileStorageOptions, fileFilter: fileFilterOption }).single(
//     'image'
//   ),
//   userController.postUploadAvatar
// );

router.post(
  '/upload-avatar',
  isAuth,
  multerUploader,
  cloudinaryUploader,
  userController.postUploadAvatar
);

router.get('/explore-posts', isAuth, userController.getExplorePosts);

router.delete(
  '/clear-notifications',
  isAuth,
  userController.clearNotifications
);

module.exports = router;
