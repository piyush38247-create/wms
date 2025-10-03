const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProducts, createProduct } = require('../controllers/productCtrl');

router.get('/', protect, getProducts);
router.post('/', protect, createProduct);

module.exports = router;
