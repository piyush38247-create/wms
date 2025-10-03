const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getPurchaseOrders, createPurchaseOrder } = require('../controllers/PurchaseOrderCtrl');

router.get('/', protect, getPurchaseOrders);
router.post('/', protect, createPurchaseOrder);

module.exports = router;
