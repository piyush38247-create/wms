const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProducts, createProduct,updateProduct, deleteProduct} = require('../controllers/productCtrl');

router.get('/', protect, getProducts);
router.post('/', protect, createProduct);

router.route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
