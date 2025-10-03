const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getInventory,
  receiveStock,
  shipStock,
  adjustStock
} = require('../controllers/inventoryCtrl');

router.get('/', protect, getInventory);          
router.post('/receive', protect, receiveStock);   
router.post('/ship', protect, shipStock);        
router.post('/adjust', protect, adjustStock);    

module.exports = router;
