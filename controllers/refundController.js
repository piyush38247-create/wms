const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Refund = require('../models/Refund');
const Customer = require('../models/Customer');

// POST /api/refunds
const processRefund = asyncHandler(async (req, res) => {
  const { paymentId, amount, reason } = req.body;

  if (!paymentId || !amount) {
    return res.status(400).json({ message: 'PaymentId and amount required' });
  }

  const payment = await Payment.findById(paymentId);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });

  const customer = await Customer.findById(payment.customerId);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });

  // Refund wallet
  customer.wallet += amount;
  await customer.save();

  const refund = await Refund.create({
    paymentId,
    amount,
    reason,
    status: 'processed'
  });

  payment.status = 'refunded';
  await payment.save();

  res.status(201).json({
    message: 'Refund processed successfully',
    refund,
    walletBalance: customer.wallet
  });
});

// GET /api/refunds
const getRefunds = asyncHandler(async (req, res) => {
  const refunds = await Refund.find().populate('paymentId');
  res.json({ message: 'Refund list fetched', refunds });
});

module.exports = { processRefund, getRefunds };
