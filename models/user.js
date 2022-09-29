const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    username: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    bio: String,
    followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    followings: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    avatarUrl: String,
    avatarPublicId: String,
    savedPosts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
    website: String,
    notifications: [
      {
        user: { type: mongoose.Types.ObjectId, ref: 'User' },
        time: String,
        notificationType: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
