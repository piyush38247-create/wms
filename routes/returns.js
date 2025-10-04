const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createReturn, getReturns } = require('../controllers/returnsCtrl');

router.route('/').post(protect, createReturn);
 router.route('/').get(protect, getReturns);

module.exports = router;
