const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const SalesOrder = require('../models/SalesOrder');

// POST /api/payments/:orderId/checkout
const checkoutPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { customerId, amount } = req.body;

  if (!customerId || !amount)
    return res.status(400).json({ message: 'Customer and amount are required' });

  // Check customer
  const customer = await Customer.findById(customerId);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });

  // Check wallet balance
  if (customer.wallet < amount)
    return res.status(400).json({ message: 'Insufficient wallet balance' });

  // Deduct from wallet
  customer.wallet -= amount;
  await customer.save();

  // Create Payment record
  const payment = await Payment.create({
    orderId,
    customerId,
    amount,
    status: 'success', 
    method: 'wallet'
  });

  // Update Sales Order
  const order = await SalesOrder.findById(orderId);
  if (order) {
    order.status = 'paid';
    await order.save();
  }

  res.status(201).json({
    message: 'Payment successful and wallet debited',
    payment,
    walletBalance: customer.wallet
  });
});

// POST /api/payments/webhook
const paymentWebhook = asyncHandler(async (req, res) => {
  const event = req.body;

  if (!event || !event.data) {
    return res.status(400).json({ message: 'Invalid webhook payload' });
  }

  const { orderId, customerId, amount, status, txnId } = event.data;

  // Save Payment info
  const payment = await Payment.create({
    orderId,
    customerId,
    amount,
    status, // success / failed
    method: 'gateway',
    transactionId: txnId
  });

  // Agar payment success hai to order update karo
  if (status === 'success') {
    const order = await SalesOrder.findById(orderId);
    if (order) {
      order.status = 'paid';
      await order.save();
    }
  }

  res.status(200).json({
    message: 'Webhook processed successfully',
    payment
  });
});

module.exports = { checkoutPayment, paymentWebhook };
