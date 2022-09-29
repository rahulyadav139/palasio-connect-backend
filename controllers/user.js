const fs = require('fs');
const bcryptjs = require('bcryptjs');
const { uploader } = require('cloudinary');

const User = require('../models/user');
const Post = require('../models/post');

exports.getUserData = async (req, res) => {
  const id = req.userId;

  try {
    const profile = await User.findById(id, {
      username: 1,
      fullName: 1,
      followings: 1,
      followers: 1,
      savedPosts: 1,
      avatarUrl: 1,
      bio: 1,
      website: 1,
      email: 1,
      notifications: 1,
    }).populate({
      path: 'notifications.user',
      select: ['avatarUrl', 'fullName'],
    });

    res.send(profile);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getSuggestions = async (req, res) => {
  const userId = req.userId;

  try {
    const { followings } = await User.findById(userId).select('followings');

    const users = await User.find({
      $and: [{ _id: { $nin: followings } }, { _id: { $ne: userId } }],
    }).select(['username', 'avatarUrl', 'fullName']);

    res.send({ suggestions: users });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.postSaveAPost = async (req, res) => {
  const userId = req.userId;
  const { postId } = req.body;

  // console.log(postId);

  try {
    const { savedPosts } = await User.findByIdAndUpdate(userId, {
      $push: { savedPosts: postId },
    });
    res.send({ message: 'Saved posts successfully!', savedPosts });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.postRemoveAPost = async (req, res) => {
  const userId = req.userId;
  const { postId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });
    res.send({ message: 'Saved posts successfully!' });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const { followers } = await User.findById(userId).populate({
      path: 'followers',
      select: ['avatarUrl', 'fullName', 'username', '_id'],
    });

    res.send({ followers });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getFollowings = async (req, res) => {
  const { userId } = req.params;

  try {
    const { followings } = await User.findById(userId).populate({
      path: 'followings',
      select: ['avatarUrl', 'fullName', 'username', '_id'],
    });

    res.send({ followings });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.postAddNewToFollowings = async (req, res) => {
  const userId = req.userId;
  const { newToFollowings } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      $push: { followings: newToFollowings },
    });
    const newNotification = {
      user: userId,
      notificationType: 'following',
      time: new Date().toISOString(),
    };
    await User.findByIdAndUpdate(newToFollowings, {
      $push: { followers: userId },
      $push: { notifications: newNotification },
    });

    res.send({ message: 'followings updated!' });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.postRemoveFromFollowings = async (req, res) => {
  const userId = req.userId;
  const { removeFromFollowings } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { followings: removeFromFollowings },
    });
    await User.findByIdAndUpdate(removeFromFollowings, {
      $pull: { followers: userId },
      $pull: { notifications: { user: userId } },
    });

    res.send({ message: 'followings updated!' });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getUserDataById = async (req, res) => {
  const { userId } = req.params;
  // console.log(userId);

  try {
    const posts = await Post.find({ author: userId });
    const {
      savedPosts,
      fullName,
      followers,
      followings,
      avatarUrl,
      bio,
      website,
    } = await User.findById(userId, {
      savedPosts: 1,
      fullName: 1,
      followers: 1,
      followings: 1,
      avatarUrl: 1,
      bio: 1,
      website: 1,
    }).populate('savedPosts');

    // console.log(Object.assign(profile, { posts }));
    // console.log(posts);
    res.send({
      savedPosts,
      fullName,
      followers,
      followings,
      avatarUrl,
      bio,
      website,
      posts,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select([
      'fullName',
      'username',
      'avatarUrl',
      'email',
      'bio',
      'website',
    ]);

    res.send(user);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.postUserProfile = async (req, res) => {
  const userId = req.userId;

  const { fullName, username, bio, website, email } = req.body;

  // console.log(req.body);

  try {
    const user = await User.findById(userId);

    // console.log(user);

    const isUsernameTaken = await User.findOne({
      username: username,
      _id: { $ne: userId },
    });

    // console.log(isUsernameTaken);

    if (!!isUsernameTaken)
      return res.status(404).send({ message: 'username is taken' });

    user.email = email;
    user.bio = bio;
    user.fullName = fullName;
    user.website = website;
    user.username = username;

    user.save();

    res.send({ message: 'profile updated successfully' });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.postChangePassword = async (req, res) => {
  const userId = req.userId;

  if (userId === '6288e6ffa35eeeeb23612d99')
    return res.status(409).send('action forbidden!');

  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    const isMatched = await bcryptjs.compare(oldPassword, user.password);

    if (!isMatched)
      return res.status(401).send({ message: 'Invalid password' });

    const encodedPassword = await bcryptjs.hash(newPassword, 12);

    user.password = encodedPassword;

    user.save();

    res.send({ message: 'password changed successfully' });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.deleteUserAccount = async (req, res) => {
  const userId = req.userId;

  if (userId === '6288e6ffa35eeeeb23612d99')
    return res.status(409).send('action forbidden!');
  try {
    const user = await User.findById(userId);

    if (user.avatarPublicId) {
      await uploader.destroy(user.avatarPublicId);
    }

    await user.deleteOne();

    await Post.deleteMany({ author: userId });

    res.send({ message: 'account deleted successfully' });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.postUploadAvatar = async (req, res) => {
  const userId = req.userId;
  const { imageUrl, publicId } = req.imageInfo;

  try {
    const user = await User.findById(userId);

    if (Boolean(user.avatarPublicId)) {
      await uploader.destroy(user.avatarPublicId);
    }

    user.avatarUrl = imageUrl;
    user.avatarPublicId = publicId;
    user.save();

    res.send({ message: 'avatar updated successfully', avatarUrl });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.getExplorePosts = async (req, res) => {
  const userId = req.userId;

  try {
    const { followings } = await User.findById(userId);

    // console.log(followings);

    const posts = await Post.find({
      $and: [{ author: { $nin: followings } }, { author: { $ne: userId } }],
    });

    res.send(posts);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.clearNotifications = async (req, res) => {
  const userId = req.userId;

  try {
    await User.findByIdAndUpdate(userId, { notifications: [] });

    res.send({ message: 'notifications cleared' });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
