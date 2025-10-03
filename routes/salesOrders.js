const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getSalesOrders, createSalesOrder ,allocateSalesOrder} = require('../controllers/SalesCtrl');

router.get('/', protect, getSalesOrders);
router.post('/', protect, createSalesOrder);
router.patch('/:id/allocate', protect, allocateSalesOrder);
module.exports = router;
