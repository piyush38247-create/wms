const express = require('express');
const router = express.Router();
const { signup, login, getuser,logout } = require('../controllers/authCtrl');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get("/me",protect, getuser)
router.post('/logout', protect, logout);
module.exports = router;

