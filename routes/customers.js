const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCustomers, createCustomer ,updateWallet} = require('../controllers/customerCtrl');

router.get('/', protect, getCustomers);
router.post('/', protect, createCustomer);
router.patch('/:id/wallet', protect, updateWallet);
module.exports = router;
