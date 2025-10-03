const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCustomers, createCustomer } = require('../controllers/customerCtrl');

router.get('/', protect, getCustomers);
router.post('/', protect, createCustomer);

module.exports = router;
