const express = require('express');
const multer = require('multer');

const postController = require('../controllers/post');
const isAuth = require('../middleware/is-auth');
const multerUploader = require('../utils/multerUploader');
const cloudinaryUploader = require('../utils/cloudinaryUploader');

// const fileStorageOptions = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'images');
//   },
//   filename(req, file, cb) {
//     const uniqueFileName = req.userId + '_post_' + file.originalname;

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

const router = express.Router();

// router.post(
//   '/create-new-post',
//   isAuth,
//   multer({ storage: fileStorageOptions, fileFilter: fileFilterOption }).single(
//     'image'
//   ),
//   postController.postCreateNewPost
// );

// router.post(
//   '/create-new-post',
//   isAuth,
//   multerUploader,
//   cloudinaryUploader,
//   postController.postCreateNewPost
// );

router.post('/like-a-post', isAuth, postController.postLikeAPost);

router.post('/comment-on-a-post', isAuth, postController.postCommentOnAPost);

router.get('/all', isAuth, postController.getAllPosts);

router.post(
  '/new-post',
  isAuth,
  multerUploader,
  cloudinaryUploader,
  postController.postCreateNewPost,
  postController.getAllPosts
);

router.post('/like', isAuth, postController.postLikeAPost);

router.post('/remove-like', isAuth, postController.postRemoveLike);

router.delete('/delete-a-post/:postId', isAuth, postController.deleteAPost);

router.post('/add-comment', isAuth, postController.postCommentOnAPost);

router.get('/:postId', isAuth, postController.getSinglePostData);

module.exports = router;
