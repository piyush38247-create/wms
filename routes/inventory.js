const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  receiveStock,
  shipStock,
  adjustStock
} = require('../controllers/inventoryCtrl');

router.route('/')
  .get(protect, getInventory)
  .post(protect, createInventory);

router.route('/:id')
  .put(protect, updateInventory)
  .delete(protect, deleteInventory);
router.post('/receive', protect, receiveStock);
router.post('/ship', protect, shipStock);
router.post('/adjust', protect, adjustStock);

module.exports = router;
