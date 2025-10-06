const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getSuppliers, createSupplier ,updateSupplier,deleteSupplier} = require('../controllers/supplierCtrl');

router.get('/', protect, getSuppliers);       
router.post('/', protect, createSupplier);


router.route('/:id')
  .put(protect, updateSupplier)
  .delete(protect, deleteSupplier);

module.exports = router;
