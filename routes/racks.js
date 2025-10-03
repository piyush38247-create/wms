const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getRacks, createRack } = require('../controllers/rackCtrl');

router.get('/', protect, getRacks);
router.post('/', protect, createRack);

module.exports = router;
