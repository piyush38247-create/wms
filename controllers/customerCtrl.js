const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({});
  res.json(customers);
});

// @desc    Create a customer
// @route   POST /api/customers
// @access  Private
const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const existing = await Customer.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Customer already exists with this email' });

  const customer = await Customer.create({ name, email, phone, address, wallet: 0 });
  res.status(201).json({
    message: 'Customer created successfully',
    customer
  });
});

// @desc    Update customer wallet
// @route   PATCH /api/customers/:id/wallet
// @access  Private
const updateWallet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const customer = await Customer.findById(id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });

  customer.wallet += amount; // Can be positive (credit) or negative (debit)
  await customer.save();

  res.json({ message: 'Wallet updated successfully', walletBalance: customer.wallet });
});

module.exports = { getCustomers, createCustomer, updateWallet };
