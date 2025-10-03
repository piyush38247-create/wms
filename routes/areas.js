const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAreas, createArea } = require('../controllers/areaCtrl');

router.get('/', protect, getAreas);
router.post('/', protect, createArea);

module.exports = router;
