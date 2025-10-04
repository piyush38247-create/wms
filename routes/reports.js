const express = require('express');
const router = express.Router();
const { getStockLevels,getSalesReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth'); // if using auth

router.get('/stock-levels', protect, getStockLevels);
router.get('/sales', protect, getSalesReport);


module.exports = router;
