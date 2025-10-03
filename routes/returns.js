const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createReturn } = require('../controllers/returnsCtrl');

router.route('/').post(protect, createReturn);

module.exports = router;
