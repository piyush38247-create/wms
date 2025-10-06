const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');

const protect = asyncHandler(async (req, res, next) => {
  let token = null;


  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

    if (!token) {
    return res.status(401).json({ message: 'Please login to access this resource' });
  }


  const blacklisted = await TokenBlacklist.findOne({ token });
  if (blacklisted) {
    return res.status(401).json({ message: 'Token expired or invalid, please login again' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    req.tokenStatus = 'Token verified successfully';

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired, please login again' });
    }
    return res.status(401).json({ message: 'Token invalid' });
  }
});

module.exports = { protect };
