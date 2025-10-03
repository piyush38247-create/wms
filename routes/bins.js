const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getBins, createBin } = require('../controllers/binCtrl');

router.get('/', protect, getBins);
router.post('/', protect, createBin);  

module.exports = router; 
