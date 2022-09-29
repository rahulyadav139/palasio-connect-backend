const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    caption: { type: String, required: true },
    author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    comments: [
      {
        user: { type: mongoose.Types.ObjectId, ref: 'User' },
        comment: String,
        time: Date,
      },
    ],
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
