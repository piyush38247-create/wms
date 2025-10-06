const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartQuantity
} = require('../controllers/cartController');

router.post('/', protect, addToCart);          
router.get('/', protect, getCart);             
router.delete('/:productId', protect, removeFromCart); 
router.delete('/', protect, clearCart);    
router.put('/:productId', protect, updateCartQuantity);

module.exports = router;
