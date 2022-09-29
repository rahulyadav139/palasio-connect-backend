const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const Post = require('./models/post');
const cloudinaryConfig = require('./utils/cloudinaryConfig');

const app = express();

dotenv.config();
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use('*', cloudinaryConfig);

// console.log('before');
// app.post('/stats', upload.single('image'), (req, res) => {
//   // req.file is the name of your file in the form above, here 'uploaded_file'
//   // req.body will hold the text fields, if there were any
//   console.log('test');
//   console.log(req.file, req.body);
// });

// app.use('/test', async (req, res) => {
//   const posts = await Post.find()
//     .populate({
//       path: 'author',
//       select: ['fullName', 'avatarUrl'],
//     })
//     .populate({
//       path: 'comments.user',
//       select: ['username', 'fullName'],
//     });
//   res.send({ posts });
// });

app.use('/auth', authRoutes);
app.use('/post', postRoutes);
app.use('/user', userRoutes);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.onbu8.mongodb.net/${process.env.DB_COLLECTION}?retryWrites=true&w=majority`
  )
  .then(res => app.listen(process.env.PORT || 8080))
  .catch(err => console.log(err));
