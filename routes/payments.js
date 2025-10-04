const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkoutPayment, paymentWebhook} = require('../controllers/paymentController');

router.post('/:orderId/checkout', protect, checkoutPayment);
router.post('/webhook',protect, paymentWebhook);

module.exports = router;
