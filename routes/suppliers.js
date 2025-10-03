const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getSuppliers, createSupplier } = require('../controllers/supplierCtrl');

router.get('/', protect, getSuppliers);       
router.post('/', protect, createSupplier);    

module.exports = router;
