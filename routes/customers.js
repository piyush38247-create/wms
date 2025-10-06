const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCustomers, createCustomer ,updateWallet,updateCustomer,deleteCustomer} = require('../controllers/customerCtrl');

router.get('/', protect, getCustomers);
router.post('/', protect, createCustomer);
router.delete('/:id', protect, deleteCustomer);    
router.put('/:id', protect, updateCustomer);

router.patch('/:id/wallet', protect, updateWallet);
module.exports = router;
