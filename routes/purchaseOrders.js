const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getPurchaseOrders, createPurchaseOrder ,deletePurchaseOrder,updatePurchaseOrder} = require('../controllers/PurchaseOrderCtrl');

router.get('/', protect, getPurchaseOrders);
router.post('/', protect, createPurchaseOrder);

router.route('/:id')
  .put(protect, updatePurchaseOrder)
  .delete(protect, deletePurchaseOrder);

module.exports = router;
