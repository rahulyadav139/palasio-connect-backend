const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  console.log(req.body);

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).send({ message: 'User not found!' });
      return;
    }

    const isMatched = await bcryptjs.compare(password, user.password);

    if (!isMatched) {
      res.status(401).send({ message: 'Invalid password!' });
      return;
    }

    const token = jwt.sign(
      { user: user.fullName, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: 30 * 60 }
    );

    res.send({
      message: 'You have successfully logged in!',
      token,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.putSignup = async (req, res) => {
  const { email, password, fullName, username } = req.body;

  try {
    const isUserWithSameEmail = await User.findOne({ email: email });

    if (isUserWithSameEmail) {
      res
        .status(409)
        .send({ message: 'User is already registered with same email!' });
      return;
    }

    const isUserWithSameUsername = await User.findOne({ username: username });
    if (isUserWithSameUsername) {
      res
        .status(410)
        .send({ message: 'User is already registered with same username!' });
      return;
    }

    const encryptedPassword = await bcryptjs.hash(password, 12);

    const user = new User({
      email,
      password: encryptedPassword,
      fullName,
      username,
    });

    user.save();

    const token = jwt.sign(
      { user: user.fullName, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: 30 * 60 }
    );

    res.send({
      message: 'Congratulation! you have successfully created an account.',
      token,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
