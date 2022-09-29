const fs = require('fs');
const { uploader } = require('cloudinary');

const Post = require('../models/post');
const User = require('../models/user');

exports.postRemoveLike = async (req, res) => {
  const userId = req.userId;

  const { postId } = req.body;

  try {
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: userId },
    });

    res.send({ message: 'post updated' });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getAllPosts = async (req, res) => {
  const userId = req.userId;

  try {
    const { followings } = await User.findById(userId).select('followings');

    const postsToShow = followings.concat(userId);

    const posts = await Post.find({ author: { $in: postsToShow } })
      .populate({
        path: 'author',
        select: ['fullName', 'avatarUrl', 'username'],
      })
      .populate({
        path: 'comments.user',
        select: ['username', 'fullName'],
      });

    res.send({ posts });
  } catch (err) {
    console.log(err);

    res.send(err);
  }
};

exports.postCreateNewPost = async (req, res, next) => {
  const caption = req.body.caption;
  const { imageUrl, publicId } = req.imageInfo;

  try {
    const post = new Post({
      imageUrl,
      caption,
      author: req.userId,
      publicId,
    });

    post.save();

    next();
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.postLikeAPost = async (req, res) => {
  const userId = req.userId;

  const { postId } = req.body;

  try {
    await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });

    res.send({ message: 'post updated' });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.deleteAPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const { publicId } = await Post.findById(postId);

    await uploader.destroy(publicId);

    await Post.findByIdAndDelete(postId);

    await User.findOneAndUpdate(
      {
        savedPosts: { $in: [postId] },
      },
      { $pull: { savedPosts: postId } }
    );

    res.send({ message: 'post deleted!' });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.postCommentOnAPost = async (req, res) => {
  const userId = req.userId;
  const { postId, comment } = req.body;

  const commentData = {
    user: userId,
    comment,
    time: new Date().toISOString(),
  };

  try {
    await Post.findByIdAndUpdate(postId, { $push: { comments: commentData } });

    res.send({ message: 'comment added' });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getSinglePostData = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId)
      .populate({
        path: 'author',
        select: ['fullName', 'avatarUrl'],
      })
      .populate({
        path: 'comments.user',
        select: ['username'],
      });

    res.send(post);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
