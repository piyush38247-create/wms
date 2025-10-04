const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth')
const { processRefund, getRefunds } = require('../controllers/refundController');

// POST /api/refunds
router.post('/',protect, processRefund);

// GET /api/refunds
router.get('/',protect, getRefunds);

module.exports = router;

