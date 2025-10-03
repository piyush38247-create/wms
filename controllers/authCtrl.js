const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.json({ user: { message: 'user signup  successfully',  id: user._id, name: user.name, email: user.email }, token: genToken(user._id) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid Password' });
  res.json({ user: {message: 'user login  successfully',  id: user._id, name: user.name, email: user.email }, token: genToken(user._id)});

});
